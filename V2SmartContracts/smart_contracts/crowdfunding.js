module.exports = function(xsgd_contract_address,ft_contract_address){
  modstr = sc.replace("0x10134dd91d0d59777927edc3f136e00a4ad11a4c",xsgd_contract_address)
  modstr = modstr.replace("0x24069ed518a4d131e7b2f07436bc30f007d5d343",ft_contract_address)
  return modstr
}
var sc =
`
scilla_version 0

(***************************************************)
(*               Associated library                *)
(***************************************************)

import BoolUtils ListUtils PairUtils

library Crowdfunding

(* Define XSGD Smart Contract Address*)
let xsgd_contract_address = 0x10134dd91d0d59777927edc3f136e00a4ad11a4c 

(* Define Fungible Token Smart Contract Address*)
let ft_contract_address = 0x24069ed518a4d131e7b2f07436bc30f007d5d343 

let zero = Uint128 0

let one_msg = 
  fun (msg : Message) => 
    let nil_msg = Nil {Message} in
    Cons {Message} msg nil_msg

let two_msgs : Message -> Message -> List Message =
  fun (msg1 : Message) =>
    fun (msg2 : Message) =>
      let first = one_msg msg1 in
      Cons { Message } msg2 first
      
let dynamic_msg_list: List Message -> List Message -> List Message =
  fun (lmsg : List Message) =>
    fun (msg : List Message) =>
      let la = @list_append Message in
        la lmsg msg

let check_update = 
  fun (bs : Map ByStr20 Uint128) =>
  fun (sender : ByStr20) =>
  fun (amount : Uint128) =>
    let c = builtin contains bs sender in
    match c with 
    | False => 
      let bs1 = builtin put bs sender amount in
      Some {Map ByStr20 Uint128} bs1 
    | True  => None {Map ByStr20 Uint128}
    end

(* Transfer Fungible Token Helpers*)
let mk_transfer_token_msg : ByStr20 -> Uint128 -> Message =
  fun (reciepient_address: ByStr20) =>
  fun (request_balance: Uint128) =>
  let msg =  {_tag : "Transfer";
           _recipient : ft_contract_address; 
           _amount : Uint128 0; 
           to:  reciepient_address; 
           amount: request_balance}
  in msg

let f  =
  fun (h: Pair ByStr20 Uint128) =>
    match h with
    | Pair a b =>
      mk_transfer_token_msg a b
    end

(* Error code for Crowdfunding*)
let accepted_code = Int32 1
let missed_deadline_code = Int32 2
let already_backed_code  = Int32 3
let not_owner_code  = Int32 4
let too_early_code  = Int32 5
let campaign_success_code = Int32 6
let campaign_error_code = Int32 7
let cannot_reclaim_code = Int32 8
let reclaimed_code = Int32 9
let set_crowdfunding_deadline_successful_code = Int32 10
let set_crowdfunding_sc_address_code = Int32 24

(* Error code for Milestone*)
let milestone_one_completed_code  = Int32 11
let milestone_claimed_code = Int32 12
let milestone_one_not_completed_code = Int32 13
let milestone_two_completed_code = Int32 14
let milestone_two_not_completed_code = Int32 15
let milestone_three_completed_code = Int32 16
let set_milestone_deadline_successful_code = Int32 17
let milestone_deadline_over_code = Int32 18
let milestone_deadline_not_over_yet_code = Int32 19
let milestone_refund_retail_investor_code = Int32 20
let not_owner_or_not_funded_code  = Int32 21

(* Error code for Fungible Token *)
let not_ft_sc_code = Int32 22
let milestone_claimback_successful_code = Int32 23


  
(***************************************************)
(*             The contract definition             *)
(***************************************************)
contract Crowdfunding

(*  Parameters *)
(owner     : ByStr20,
 goal      : Uint128,
 milestone_one: Uint128,
 milestone_two: Uint128,
 company_address: ByStr20
 )

(* Mutable fields *)
field backers : Map ByStr20 Uint128 = Emp ByStr20 Uint128
field funded : Bool = False
field after_crowdfunding_deadline : Bool = False
field xsgd_balance : Uint128 = zero

(* Fields for milestone *)
field completed_milestone_one : Bool = False
field completed_milestone_two : Bool = False
field completed_milestone_three : Bool = False
field after_milestone_deadline : Bool = False

(* Fields for fungible token *)
field failed_milestone_balance : Uint128 = zero

(* Fields to set CF smart contract address*)
field crowdfunding_sc_address: ByStr20 = 0x5fC00617d88CB7B92e5c195e27ED5D3c1627575c

transition SetCrowdfundingSCAddress ( address: ByStr20 )
  is_contract_owner = builtin eq _sender owner;
  match is_contract_owner with
  | False =>
    msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0;
            code : not_owner_code};
    msgs = one_msg msg;
    send msgs
  | True =>
    crowdfunding_sc_address := address;
    e = {_eventname : "SetCrowdfundingSCAddress"; code : set_crowdfunding_sc_address_code};
    event e
  end
end


(* Calls Transfer() function in XSGD token*)
transition Donate ( amount : Uint128 )
  d <- after_crowdfunding_deadline;
  in_time = negb d;
  match in_time with 
  | True  => 
    bs  <- backers;
    res = check_update bs _sender amount;
    match res with
    | None => 
      msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0; 
              code : already_backed_code};
      msgs = one_msg msg;
      send msgs
    | Some bs1 =>
      (* backers := bs1;  *)
      cf_sc_address<- crowdfunding_sc_address;
      msg  = {_tag : "TransferFrom"; _recipient : xsgd_contract_address; _amount : Uint128 0; 
              from:_sender; to: cf_sc_address; amount: amount};
      msgs = one_msg msg;
      e = { _eventname : "DonationInProgress"; donor : cf_sc_address; amount : amount };
      event e;
      send msgs     
    end  
  | False => 
    msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0; 
            code : missed_deadline_code};
    msgs = one_msg msg;
    send msgs
  end 
end

(* XSGD Transition *)
transition RecipientAcceptTransfer(
  sender : ByStr20,
  recipient : ByStr20,
  amount : Uint128
)
end


transition TransferSuccessCallBack(
  sender : ByStr20,
  recipient : ByStr20,
  amount : Uint128
)  
end

transition RecipientAcceptTransferFrom(
  initiator : ByStr20,
  sender : ByStr20,
  recipient : ByStr20,
  amount : Uint128
)
  (* add to balance*)
  backers[sender] := amount;
  bal <- xsgd_balance;
  new_bal = builtin add bal amount;
  xsgd_balance := new_bal;
  e = { _eventname : "XSGDReceivedSuccess"; claimed_by : _sender; amount : amount };
  event e
end

(* Callback Transition for XSGD to make sure that XSGD received by SC*)
transition TransferFromSuccessCallBack(
initiator : ByStr20,
sender : ByStr20,
recipient : ByStr20,
amount : Uint128
)
end

(* call upon campaign success + deadline over*)
transition CrowdfundingGetFunds ()
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False => 
    msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0;
            code : not_owner_code};
    msgs = one_msg msg;
    send msgs
  | True => 
    d <- after_crowdfunding_deadline;
    c1 = d;
    bal <- xsgd_balance;
    c2 = builtin lt bal goal;
    c3 = negb c2;
    c4 = andb c1 c3;
    match c4 with 
    | False =>  
      msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0;
              code : campaign_error_code};
      msgs = one_msg msg;
      send msgs
    | True => 
      tt = True;
      funded := tt;
      (* msg  = {_tag : ""; _recipient : owner; _amount : Uint128 0; 
              code : campaign_success_code};
      ft_msg = {_tag : "SetCampaignSucceed"; _recipient : ft_contract_address; _amount : Uint128 0};
      msgs = two_msgs msg ft_msg;
      send msgs *)
      bs  <- backers;
      backer_list = builtin to_list bs;
      convert = @list_map (Pair ByStr20 Uint128) (Message);
      msgs = convert f backer_list;
      send msgs
    end
  end   
end

(* transition ClaimBack *)
(* transition CrowdfundingClaimBack ()
  d <- after_crowdfunding_deadline;
  match d with
  | False =>
    msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0;
            code : too_early_code};
    msgs = one_msg msg;
    send msgs
  | True =>
    bs <- backers;
    bal <- xsgd_balance;
    f <- funded;
    c1 = builtin lt bal goal;
    c2 = builtin contains bs _sender;
    c3 = negb f;
    c4 = andb c1 c2;
    c5 = andb c3 c4;
    match c5 with
    | False =>
      msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0;
              code : cannot_reclaim_code};
      msgs = one_msg msg;
      send msgs
    | True =>
      res = builtin get bs _sender;
      match res with
      | None =>
        msg  = {_tag : ""; _recipient : _sender; _amount : Uint128 0;
                code : cannot_reclaim_code};
        msgs = one_msg msg;
        send msgs
      | Some v =>
        bs1 = builtin remove bs _sender;
        backers := bs1;
        msg  = {_tag : ""; _recipient : _sender; _amount : v; 
                code : reclaimed_code};
        msgs = one_msg msg;
        e = { _eventname : "ClaimedBack"; claimed_by : _sender; amount : v };
        event e;
        send msgs
      end
    end
  end  
end *)

transition SetCrowdfundingDeadlineTrue()
    is_owner = builtin eq owner _sender;
    match is_owner with 
    |  False =>
        e = {_eventname : "set_crowdfunding_deadline"; code : not_owner_code};
        event e
    |  True =>
        tt = True;
        after_crowdfunding_deadline := tt;
        e = {_eventname : "set_crowdfunding_deadline"; code : set_crowdfunding_deadline_successful_code};
        event e
    end
end

(* Milestone transitions*)
procedure MilestonePerformGetFunds (amount : Uint128, to: ByStr20 )
  b <- xsgd_balance;
  new_xsgd_balance= builtin sub b amount;
  xsgd_balance := new_xsgd_balance;
  cf_sc_address<- crowdfunding_sc_address;
  first_msg  = {_tag : "IncreaseAllowance"; _recipient : xsgd_contract_address; _amount : Uint128 0; 
          spender:to; amount: amount};
  (* msg  = {_tag : "TransferFrom"; _recipient : xsgd_contract_address; _amount : Uint128 0; 
          from:cf_sc_address; to: to; amount: amount}; *)
  (*  TODO: create javascript to receive TransferFrom for company*)
  msgs = one_msg first_msg;
  e = { _eventname : "ClaimInProgress"; caller : to; amount : amount; code : milestone_claimed_code};
  event e;
  send msgs
end

transition FinishMilestoneOne()
    is_owner = builtin eq owner _sender;
    d <- after_milestone_deadline;
    f <- funded;
    c1 = andb is_owner f;
    match c1 with
    | False =>
        e = {_eventname : "finish_milestone_one"; code : not_owner_or_not_funded_code};
        event e
    | True =>
        match d with
        | False =>
            MilestonePerformGetFunds milestone_one company_address;
            tt = True;
            completed_milestone_one := tt;
            e = {_eventname : "finish_milestone_one"; code : milestone_one_completed_code};
            event e
        | True =>
            e = {_eventname : "finish_milestone_one"; code : milestone_deadline_over_code};
            event e
        end
    end
end

transition FinishMilestoneTwo()
    is_owner = builtin eq owner _sender;
    f <- funded;
    c1 = andb is_owner f;
    match c1 with
    | False =>
        e = {_eventname : "finish_milestone_two"; code : not_owner_or_not_funded_code};
        event e
    | True =>
        d <- after_milestone_deadline;
        match d with 
        | True =>
            e = {_eventname : "finish_milestone_two"; code : milestone_deadline_over_code};
            event e
        | False =>
            c <- completed_milestone_one;
            match c with 
            | False =>
                e = {_eventname : "finish_milestone_two"; code : milestone_one_not_completed_code};
                event e
            | True =>
                MilestonePerformGetFunds milestone_two company_address;
                tt = True;
                completed_milestone_two := tt;
                e = {_eventname : "finish_milestone_two"; code : milestone_two_completed_code};
                event e
            end
        end
    end
end


transition FinishMilestoneThree()
    is_owner = builtin eq owner _sender;
    f <- funded;
    c1 = andb is_owner f;
    match c1 with
    | False =>
        e = {_eventname : "finish_milestone_three"; code : not_owner_or_not_funded_code};
        event e
    | True =>
        d <- after_milestone_deadline;
        match d with 
        | True =>
            e = {_eventname : "finish_milestone_three"; code : milestone_deadline_over_code};
            event e
        | False =>
            c <- completed_milestone_two;
            match c with 
            | False =>
                e = {_eventname : "finish_milestone_three"; code : milestone_two_not_completed_code};
                event e
            | True =>
                bal <- xsgd_balance;
                MilestonePerformGetFunds bal company_address;
                tt = True;
                completed_milestone_three := tt;
                e = {_eventname : "finish_milestone_three"; code : milestone_three_completed_code};
                event e
            end
        end 
    end
end


    

transition SetMilestoneDeadlineTrue()
    is_owner = builtin eq owner _sender;
    f <- funded;
    c1 = andb is_owner f;
    match c1 with 
    |  False =>
        e = {_eventname : "set_milestone_deadline"; code : not_owner_or_not_funded_code};
        event e
    |  True =>
        tt = True;
        after_milestone_deadline := tt;
        (* Set the remaining balance left in the contract because of uncompleted milestones*)
        b <- xsgd_balance;
        failed_milestone_balance:= b;
(*        e = {_eventname : "set_milestone_deadline"; code : set_milestone_deadline_successful_code};*)
(*        event e*)
        (* Send Message that will set milestone_deadline_reached in fungible token smart contract to True*)
        msg =  {_tag : "MilestoneDeadlineReached"; _recipient : ft_contract_address; _amount : Uint128 0};
        msgs = one_msg msg;
        send msgs
    end
end

(* Fungible Token transitions*)
transition RecipientAcceptTransferFT(
    sender : ByStr20,
    recipient : ByStr20,
    amount : Uint128
  )
end

(* Callback Transition for FT to make sure that FT received by SC*)
transition TransferSuccessCallBackFT(
  sender : ByStr20,
  recipient : ByStr20,
  amount : Uint128
)
end

(* Triggered by transition from fungible token smart contract *)
transition CalculateClaimback(address: ByStr20, sender_balance: Uint128, init_supply: Uint128)
  is_ft_sc = builtin eq ft_contract_address _sender;
      match is_ft_sc with 
      |  False =>
          e = {_eventname : "Claimback"; code : not_ft_sc_code};
          event e
      |  True =>
        d <- after_milestone_deadline;
        match d with
        |  False =>
            e = {_eventname : "Claimback"; code : milestone_deadline_not_over_yet_code};
            event e
        |  True =>
            (* the formula to refund retail investors is:*)
            (* sender_balance/init_supply*failed_milestone_balance *)
            cal_balance <- failed_milestone_balance;
            intermed = builtin mul sender_balance cal_balance;
            return_amount_to_address = builtin div intermed init_supply;
            (*as rounding of of values can result in return a balance that is more than what is inside account, we need to perforrm check and return whats left in account*)
            current_bal <- xsgd_balance;
            lt_available_bal = builtin lt current_bal return_amount_to_address;
            match lt_available_bal with
            | True =>
              (* return available balance*)
              MilestonePerformGetFunds current_bal address;
              e = {_eventname : "ClaimbackSuccess"; _recipient : address; _amount :current_bal; code : milestone_claimback_successful_code};
              event e
            | False =>
              MilestonePerformGetFunds return_amount_to_address address;
              e = {_eventname : "ClaimbackSuccess"; _recipient : address; _amount :return_amount_to_address; code : milestone_claimback_successful_code};
              event e
            end
        end
    end
end 


`