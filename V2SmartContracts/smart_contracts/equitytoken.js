module.exports=
`
scilla_version 0

(***************************************************)
(*               Associated library                *)
(***************************************************)
import IntUtils
library FungibleToken

(* burn address*)
let burn_address = 0xc5D1335fA8ad5e5963547aA4C4137CbC8F7C6252

let one_msg = 
  fun (msg : Message) => 
  let nil_msg = Nil {Message} in
  Cons {Message} msg nil_msg

let two_msgs =
fun (msg1 : Message) =>
fun (msg2 : Message) =>
  let msgs_tmp = one_msg msg2 in
  Cons {Message} msg1 msgs_tmp

let three_msgs =
fun (msg1 : Message) =>
fun (msg2 : Message) =>
fun (msg3 : Message) =>
  let msgs_tmp = two_msgs msg1 msg2 in
  Cons {Message} msg3 msgs_tmp

(* Error events *)
type Error =
| CodeIsSender
| CodeInsufficientFunds
| CodeInsufficientAllowance
| CodeIsContractOwner

let make_error =
  fun (result : Error) =>
    let result_code = 
      match result with
      | CodeIsSender              => Int32 -1
      | CodeInsufficientFunds     => Int32 -2
      | CodeInsufficientAllowance => Int32 -3
      | CodeIsContractOwner       => Int32 -4
      end
    in
    { _exception : "Error"; code : result_code }
  
let zero = Uint128 0

(* Dummy user-defined ADT *)
type Unit =
| Unit

let get_val =
  fun (some_val: Option Uint128) =>
  match some_val with
  | Some val => val
  | None => zero
  end

(* code for Fungible Token*)
let set_milestone_deadline_reached_code = Int32 1
let transfer_balance_cf_succeed_code = Int32 2

(***************************************************)
(*             The contract definition             *)
(***************************************************)

contract FungibleToken
(
  contract_owner: ByStr20,
  name : String,
  symbol: String,
  decimals: Uint32,
  init_supply : Uint128
)

(* Mutable fields *)
field current_contract_owner: ByStr20 = contract_owner (* will be changed to crowdfunding smart contract *)
field total_supply : Uint128 = init_supply

field balances: Map ByStr20 Uint128 
  = let emp_map = Emp ByStr20 Uint128 in
    builtin put emp_map contract_owner init_supply

field milestone_deadline_reached :  Bool = False 

(**************************************)
(*             Procedures             *)
(**************************************)

procedure ThrowError(err : Error)
  e = make_error err;
  throw e
end

procedure IsNotSender(address: ByStr20)
  is_sender = builtin eq _sender address;
  match is_sender with
  | True =>
    err = CodeIsSender;
    ThrowError err
  | False =>
  end
end

procedure IsContractOwner()
  current_owner <- current_contract_owner;
  is_contract_owner = builtin eq _sender current_owner;
  match is_contract_owner with
  | True =>
  | False =>
    err = CodeIsContractOwner;
    ThrowError err
  end
end

procedure AuthorizedMoveIfSufficientBalance(from: ByStr20, to: ByStr20, amount: Uint128)
  o_from_bal <- balances[from];
  bal = get_val o_from_bal;
  can_do = uint128_le amount bal;
  match can_do with
  | True =>
    (* Subtract amount from from and add it to to address *)
    new_from_bal = builtin sub bal amount;
    balances[from] := new_from_bal;
    (* Adds amount to to address *)
    get_to_bal <- balances[to];
    new_to_bal = match get_to_bal with
    | Some bal => builtin add bal amount
    | None => amount
    end;
    balances[to] := new_to_bal
  | False =>
    (* Balance not sufficient *)
    err = CodeInsufficientFunds;
    ThrowError err
  end
end

(***************************************)
(*             Transitions             *)
(***************************************)

(* @dev: Moves an amount tokens from _sender to the recipient. Used by token_owner. *)
(* @dev: Balance of recipient will increase. Balance of _sender will decrease.      *)
(* @param to:  Address of the recipient whose balance is increased.                 *)
(* @param amount:     Amount of tokens to be sent.                                  *)
transition Transfer(to: ByStr20, amount: Uint128)
  IsContractOwner;
  AuthorizedMoveIfSufficientBalance _sender to amount;
  e = {_eventname : "TransferSuccess"; sender : _sender; recipient : to; amount : amount};
  event e;
  (* Prevent sending to a contract address that does not support transfers of token *)
  msg_to_recipient = {_tag : "RecipientAcceptTransfer"; _recipient : to; _amount : zero; 
                      sender : _sender; recipient : to; amount : amount};
  msg_to_sender = {_tag : "TransferSuccessCallBack"; _recipient : _sender; _amount : zero; 
                  sender : _sender; recipient : to; amount : amount};
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end

(* to be called by ft owner before cf sends over Transfer() requests*)
transition TransferBalanceToCF(cf_address: ByStr20, amount :Uint128)
    IsContractOwner;
    AuthorizedMoveIfSufficientBalance _sender cf_address amount;
    (* make cf_address the owner*)
    current_contract_owner := cf_address;
    e = {_eventname : "TransferBalanceToCFSuccess"; code : transfer_balance_cf_succeed_code};
    event e;
    (* Prevent sending to a contract address that does not support transfers of token *)
    msg_to_recipient = {_tag : "RecipientAcceptTransfer"; _recipient : cf_address; _amount : zero; 
                        sender : _sender; recipient : cf_address; amount : amount};
    msg_to_sender = {_tag : "TransferSuccessCallBack"; _recipient : _sender; _amount : zero; 
                    sender : _sender; recipient : cf_address; amount : amount};
    msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end

(* constraints to be met before can burn token*)
transition MilestoneDeadlineReached()
  (* validate that contract owner is cf smart contract*)
  IsContractOwner;
  tt = True;
  milestone_deadline_reached := tt;
  e = {_eventname : "MilestoneDeadlineReached"; code : set_milestone_deadline_reached_code};
  event e
end

(* retail investors can call the burn function by themselves, allows burn token even if all milestones are reached*)
transition BurnToken()
  (* check if milestone deadline reached *)
  m <- milestone_deadline_reached;
  match m with
  | False =>
      e = {_eventname : "BurnTokenUnsucessful"; sender : _sender; recipient : burn_address; amount : Uint128 0};
      event e
  | True =>
      (* burn all tokens held by sender*)
      balance_sender_o <- balances[_sender];
      sender_balance = get_val balance_sender_o;
      (* check ownership, then burn token*)
      AuthorizedMoveIfSufficientBalance _sender burn_address sender_balance;
      e = {_eventname : "BurnTokenSuccessful"; sender : _sender; recipient : burn_address; amount : sender_balance};
      event e;
      (* Prevent sending to a contract address that does not support transfers of token *)
      msg_to_recipient = {_tag : "RecipientAcceptTransfer"; _recipient : burn_address; _amount : zero; 
                          sender : _sender; recipient : burn_address; amount : sender_balance};
      msg_to_sender = {_tag : "TransferSuccessCallBack"; _recipient : _sender; _amount : zero; 
                      sender : _sender; recipient : burn_address; amount : sender_balance};
      (* Send message to call payout in the crowdfunding smart contract*)
      integrate_sc_address <- current_contract_owner;
      supply <- total_supply;
      (* Send message for claimback*)
      msg_to_call_payout = {_tag : "CalculateClaimback"; _recipient : integrate_sc_address; _amount : zero; 
      address: _sender; sender_balance:sender_balance;init_supply: supply};
      msgs = three_msgs msg_to_recipient msg_to_sender msg_to_call_payout;
      send msgs
  end
end




`