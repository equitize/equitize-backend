
module.exports =
`
(***************************************************)
(*                 Scilla version                  *)
(***************************************************)

scilla_version 0

(***************************************************)
(*               Associated library                *)
(***************************************************)
library Milestone

let not_owner_code  = Uint32 1
let milestone_one_completed  = Uint32 2
let claimed_code = Uint32 3
let milestone_one_not_completed = Uint32 4
let milestone_two_completed = Uint32 5
let milestone_two_not_completed = Uint32 6
let milestone_three_completed = Uint32 7
let set_deadline_successful = Uint32 8
let deadline_over = Uint32 9
let deadline_not_over_yet = Uint32 10
let refund_owner = Uint32 11

let one_msg =
  fun (msg : Message) =>
    let nil_msg = Nil {Message} in
    Cons {Message} msg nil_msg

(***************************************************)
(*             The contract definition             *)
(***************************************************)

contract Milestone

(owner: ByStr20,
milestone_one: Uint128,
milestone_two: Uint128,
company_address: ByStr20
 )

field completed_milestone_one : Bool = False
field completed_milestone_two : Bool = False
field completed_milestone_three : Bool = False
field after_deadline : Bool = False

procedure PerformGetFunds (amount : Uint128)
  msg = {_tag : ""; _recipient : company_address; _amount : amount; code : claimed_code};
  msgs = one_msg msg;
  e = { _eventname : "ClaimSuccess"; caller : company_address; amount : amount; code : claimed_code};
  event e;
  send msgs
end

transition FinishMilestoneOne()
    is_owner = builtin eq owner _sender;
    d <- after_deadline;
    match is_owner with
    | False =>
        e = {_eventname : "finish_milestone_one"; code : not_owner_code};
        event e
    | True =>
        match d with
        | False =>
            PerformGetFunds milestone_one;
            tt = True;
            completed_milestone_one := tt;
            e = {_eventname : "finish_milestone_one"; code : milestone_one_completed};
            event e
        | True =>
            e = {_eventname : "finish_milestone_one"; code : deadline_over};
            event e
        end
    end
end

transition FinishMilestoneTwo()
    is_owner = builtin eq owner _sender;
    match is_owner with
    | False =>
        e = {_eventname : "finish_milestone_two"; code : not_owner_code};
        event e
    | True =>
        d <- after_deadline;
        match d with 
        | True =>
            e = {_eventname : "finish_milestone_two"; code : deadline_over};
            event e
        | False =>
            c <- completed_milestone_one;
            match c with 
            | False =>
                e = {_eventname : "finish_milestone_two"; code : milestone_one_not_completed};
                event e
            | True =>
                PerformGetFunds milestone_two;
                tt = True;
                completed_milestone_two := tt;
                e = {_eventname : "finish_milestone_two"; code : milestone_two_completed};
                event e
            end
        end
    end
end




transition FinishMilestoneThree()
    is_owner = builtin eq owner _sender;
    match is_owner with
    | False =>
        e = {_eventname : "finish_milestone_three"; code : not_owner_code};
        event e
    | True =>
        d <- after_deadline;
        match d with 
        | True =>
            e = {_eventname : "finish_milestone_three"; code : deadline_over};
            event e
        | False =>
            c <- completed_milestone_two;
            match c with 
            | False =>
                e = {_eventname : "finish_milestone_three"; code : milestone_two_not_completed};
                event e
            | True =>
                bal <- _balance;
                PerformGetFunds bal;
                tt = True;
                completed_milestone_three := tt;
                e = {_eventname : "finish_milestone_three"; code : milestone_three_completed};
                event e
            end
        end 
    end
end

transition SetDeadlineTrue()
    is_owner = builtin eq owner _sender;
    match is_owner with 
    |  False =>
        e = {_eventname : "set_deadline"; code : not_owner_code};
        event e
    |  True =>
        tt = True;
        after_deadline := tt;
        e = {_eventname : "set_deadline"; code : set_deadline_successful};
        event e
    end
end

transition Claimback()
    is_owner = builtin eq owner _sender;
    match is_owner with 
    |  False =>
        e = {_eventname : "Claimback"; code : not_owner_code};
        event e
    |  True =>
        d <- after_deadline;
        match d with
        |  False =>
            e = {_eventname : "Claimback"; code : deadline_not_over_yet};
            event e
        |  True =>
            bal <- _balance;
            msg = {_tag : ""; _recipient : owner; _amount : bal; code : refund_owner};
            msgs = one_msg msg;
            send msgs
        end
    end
end
    
transition AddFunds ()
    is_owner = builtin eq owner _sender;
    match is_owner with
    | False =>
        e = {_eventname : "addFunds"; code : not_owner_code};
        event e
    | True =>
        accept;
        e = {_eventname : "addFunds"; code : not_owner_code };
        event e
    end
end

`