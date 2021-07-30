Steps to demonstration of claimback milestone for retail investors:
1.	/XSGDdeploy: Deploy xsgd contract
2.	/XSGDtransfer : transfer XSGD from owner to retail investor 1 
3.	/XSGDtransfer : transfer XSGD from owner to retail investor 2 
4.	/ETdeploy: Deploy equitytoken contract
5.	/CFdeploy: Deploy crowdfunding token
6.	/CFsetCF: set crowdfunding address of crowdfunding contract
7.	/XSGDincreaseAllowance: allocate XSGD from retail investor 1 to cf smart contract
8.	/XSGDincreaseAllowance : allocate XSGD from retail investor 2 to cf smart contract
9.	/ETtransferCF : transfer equity token balance to cf smart contract
10.	/CFdonate: transfer xsgd from retail investor 1 to cf smart contract + record balance
11.	/CFdonate: transfer xsgd from retail investor 1 to cf smart contract + record balance
12.	/CFsetCFdeadlineTrue: set cf deadline true
13.	/CFcrowdfundingGetFunds: goal of cf met + deadline true => issue equity token to retail investor 
14.	/CFfinishMilestoneOne: send company milestone one XSGD
15.	/CFsetMilestoneDeadlineTrue: set company milestone deadline true
16.	/ETburnToken : claimback of XSGD for uncompleted milestones for retail investor 1
17.	/XSGDtransferFrom: transfer back xsgd from allowance in XSGD to balance for accounts
