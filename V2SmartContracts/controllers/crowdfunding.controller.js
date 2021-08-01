const fs = require('fs');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
  toBech32Address,
  getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');
const createHttpError = require('http-errors');


const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);

module.exports = {
  deploy: async function(req, res, next) {
    try {
      const privateKeys = req.body.privateKey ? req.body.privateKey : "";
      if (!req.body.milestones.part1Goal || !req.body.milestones.part2Goal || !req.body.startup.dataValues["zilAddr"] || !req.body.milestones.campaignGoal) {
        res.status(400).send({    
          message: "milestoneOneGoal, milestoneTwoGoal, recipientAddress, campaignGoal can not be empty!"
        });
        return;
      }
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log("zilliqa wallet address: ", address);
      // Get Balance
      const balance = await zilliqa.blockchain.getBalance(address);
      // Get Minimum Gas Price from blockchain
      const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
  
      // Account balance (See note 1)
      console.log(`Your account balance is:`);
      console.log(balance.result);
      console.log(`Current Minimum Gas Price: ${minGasPrice.result}`);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      console.log(`My Gas Price ${myGasPrice.toString()}`);
      const isGasSufficient = myGasPrice.gte(new BN(minGasPrice.result)); // Checks if your gas price is less than the minimum gas price
      console.log(`Is the gas price sufficient? ${isGasSufficient}`);
  
      // Deploy a contract
      console.log(`Deploying a new Crowdfunding Smart Contract....`);
      
      var {xsgd} = require('../config/XSGD.json');
      var {equityToken} = require('../config/equitytoken.json');
      var cf = require("../smart_contracts/crowdfunding.js")(xsgd,equityToken);
      const init = [
        // this parameter is mandatory for all init arrays
        {
          vname: '_scilla_version',
          type: 'Uint32',
          value: '0',
        },
        {
          vname: 'owner',
          type: 'ByStr20',
          value: `${address}`,
        },
        {
          vname: 'goal',
          type: 'Uint128',
          value: `${req.body.milestones.campaignGoal}`,
        },
        {
          vname: 'milestone_one',
          type: 'Uint128',
          value: `${req.body.milestones.part1Goal}`,
        },
        {
          vname: 'milestone_two',
          type: 'Uint128',
          value: `${req.body.milestones.part2Goal}`,
        },
        {
          vname: 'company_address',
          type: 'ByStr20',
          value: `${req.body.startup.dataValues["zilAddr"]}`,
        },
      ];
  
      // Instance of class Contract
      const contract = zilliqa.contracts.new(cf, init);
      console.log(contract);
  
      // Deploy the contract.
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // A contract can be deployed at either the shard or at the DS. Always set this value to false.
      const [deployTx, deployedFungibleToken] = await contract.deploy(
        {
          version: VERSION,
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(80000),
        },
        33,
        1000,
        false,
      );
  
      // process confirm
      console.log(deployTx)
      console.log(deployedFungibleToken)
      console.log(`The transaction id is:`, deployTx.id);
      console.log(`Waiting transaction be confirmed`);
      const confirmedTxn = await deployTx.confirm(deployTx.id);
      console.log(`The transaction status is:`);
      console.log(confirmedTxn.receipt);
  
      // Introspect the state of the underlying transaction
      console.log(`Deployment Transaction ID: ${deployTx.id}`);
      console.log(`Deployment Transaction Receipt:`);
      console.log(deployTx.txParams.receipt);
  
      // Get the deployed contract address
      console.log('The contract address is:');
      console.log(deployedFungibleToken.address);
      // save address of smart contract to json file
      const saveAddress = {
        crowdfundingAddress: deployedFungibleToken.address,
      }
      const jsonString = JSON.stringify(saveAddress);
      await fs.writeFileSync('./V2SmartContracts/config/crowdfunding.json', jsonString, 'utf-8', err => {
          if (err) {
              console.log('Error writing file', err)
          } else {
              console.log('Successfully wrote file')
          }
      });
      //Following line added to fix issue https://github.com/Zilliqa/Zilliqa-JavaScript-Library/issues/168
      // const deployedContract = zilliqa.contracts.at(deployedFungibleToken.address);
      if (deployedFungibleToken.address && deployTx.txParams.receipt) {
        req.body.SCstatus['CrowdfundingSC'] = {
          status : true,
          address : deployedFungibleToken.address
        };
        next();
      } else {
        throw createHttpError(500, `Something went wrong with CF SC for startupId=${req.params.startupId}`);
      }
       
    } catch (err) {
      console.log(err);
      next(err)
    }
  },
  setCrowdfundingSCAddress:  async function(req, res, next) {
    try {
      const privateKeys = req.body.privateKey ? req.body.privateKey : "";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log("zilliqa wallet address: ", address);
      // console.log(req.body.recipientAddress ,req.body.sendFT)
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      const { crowdfundingAddress } = require('../config/crowdfunding.json');
      console.log(typeof crowdfundingAddress)
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);

      console.log("change deployed contract");
      console.log(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling SetCrowdfundingSCAddress transition' );
      const callTx = await deployedContract.call(
        'SetCrowdfundingSCAddress',
        [
          {
              vname: 'address',
              type: 'ByStr20',
              value: `${crowdfundingAddress}`,
          },
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      console.log(deployedContract);
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
      if (state.crowdfunding_sc_address) {
        next();
      } else {
        throw createHttpError(500, `Something went wrong when setting Crowdfunding Smart Contract address for startupId=${req.params.startupId}.`);
      }
    } catch (err) {
      console.log(err);
      // next(err)
    }

  },
  donate:  async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey;
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      // console.log(req.body.recipientAddress ,req.body.sendFT)
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling Donate transition' );
      const callTx = await deployedContract.call(
        'Donate',
        [
          {
              vname: 'amount',
              type: 'Uint128',
              value: `${req.body.amount}`,
          },
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
    } catch (err) {
      console.log(err);
    }
  },
  crowdfundingGetFunds: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey ? req.body.privateKey : "";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      // console.log(req.body.recipientAddress ,req.body.sendFT)
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling CrowdfundingGetFunds transition' );
      const callTx = await deployedContract.call(
        'CrowdfundingGetFunds',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
      if (state) {
        res.status(200).send({
          "message": "Succesfully set returned monies to retail investors"
        })
      } else {
        throw createHttpError(500, 'Something went wrong with CF.crowdfundingGetFunds')
      }
    } catch (err) {
      console.log(err);
    }
  },
  setCrowdfundingDeadlineTrue: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey ? req.body.privateKey : "";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling SetCrowdfundingDeadlineTrue transition' );
      const callTx = await deployedContract.call(
        'SetCrowdfundingDeadlineTrue',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
      if (state.after_crowdfunding_deadline.constructor === "True") {
        res.status(200).send({
          "message": "Succesfully set CF deadline to True"
        })
      } else {
        throw createHttpError(500, 'Something went wrong setting CF deadline to True')
      }
    } catch (err) {
      console.log(err);
      next(err)
    }
  },
  finishMilestoneOne: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey ? req.body.privateKey : "";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling FinishMilestoneOne transition' );
      const callTx = await deployedContract.call(
        'FinishMilestoneOne',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
      if (state) {
        res.send(state);
      }
    } catch (err) {
      console.log(err);
    }
  },
  finishMilestoneTwo: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey;
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling FinishMilestoneTwo transition' );
      const callTx = await deployedContract.call(
        'FinishMilestoneTwo',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
    } catch (err) {
      console.log(err);
    }
  },
  finishMilestoneThree: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey;
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling FinishMilestoneThree transition' );
      const callTx = await deployedContract.call(
        'FinishMilestoneThree',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
    } catch (err) {
      console.log(err);
    }
  },
  setMilestoneDeadlineTrue: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey ? req.body.privateKey :"";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling SetMilestoneDeadlineTrue transition' );
      const callTx = await deployedContract.call(
        'SetMilestoneDeadlineTrue',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
      if (state) {
        res.send(state)
      }
    } catch (err) {
      console.log(err);
    }
  },
  crowdfundingFailClaimback: async function(req, res, next) {
    try {
      privateKeys = req.body.privateKey;
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {crowdfundingAddress} = require('../config/crowdfunding.json');
      const deployedContract = zilliqa.contracts.at(crowdfundingAddress);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling CrowdfundingClaimBack transition' );
      const callTx = await deployedContract.call(
        'CrowdfundingClaimBack',
        [
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(8000),
        },
        33,
        1000,
        false,
      );
  
      // Retrieving the transaction receipt (See note 2)
      console.log(JSON.stringify(callTx.receipt, null, 4));
  
      //Get the contract state
      console.log('Getting contract state...');
      const state = await deployedContract.getState();
      console.log('The state of the contract is:');
      console.log(JSON.stringify(state, null, 4));
      if (state) {
        res.status(200).send(state)
      }
    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}