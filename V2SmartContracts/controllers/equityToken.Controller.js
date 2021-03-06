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
  deploy: async function (req, res, next) {
    try {
      const privateKeys = req.body.privateKey ? req.body.privateKey : "";
      if (!req.body.coinName || !req.body.coinSupply ||!req.body.coinSymbol || req.body.coinDecimals < 0  || !req.body.privateKey) {
        res.status(400).send({    
          message: "coinName, coinSupply, coinSymbol, coinDecimals and privateKey cannot be empty!"
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
      console.log(`Deploying a new Equity Token Smart Contract....`);
      var fungibleToken = require("../smart_contracts/equitytoken.js");
      const init = [
        // this parameter is mandatory for all init arrays
        {
          vname: '_scilla_version',
          type: 'Uint32',
          value: '0',
        },
        {
          vname: 'contract_owner',
          type: 'ByStr20',
          value: `${address}`,
        },
        {
          vname: 'name',
          type: 'String',
          value: `${req.body.coinName}`,
        },
        {
          vname: 'symbol',
          type: 'String',
          value: `${req.body.coinSymbol}`,
        },
        {
          vname: 'decimals',
          type: 'Uint32',
          value: `${req.body.coinDecimals}`,
        },
        {
          vname: 'init_supply',
          type: 'Uint128',
          value: `${req.body.coinSupply}`,
        },
      ];
  
      // Instance of class Contract
      const contract = zilliqa.contracts.new(fungibleToken, init);
      console.log(contract);
  
      // Deploy the contract.
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // A contract can be deployed at either the shard or at the DS. Always set this value to false.
      const [deployTx, deployedFungibleToken] = await contract.deploy(
        {
          version: VERSION,
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(10000),
        },
        33,
        1000,
        false,
      );
  
      // Introspect the state of the underlying transaction
      console.log(`Deployment Transaction ID: ${deployTx.id}`);
      console.log(`Deployment Transaction Receipt:`);
      console.log(deployTx.txParams.receipt);
  
      // Get the deployed contract address
      console.log('The contract address is:');
      console.log(deployedFungibleToken.address);
      // save address of smart contract to json file
      const saveAddress = {
        equityToken: deployedFungibleToken.address,
      }
      const jsonString = JSON.stringify(saveAddress);
      await fs.writeFile('./V2SmartContracts/config/equitytoken.json', jsonString, err => {
          if (err) {
              console.log('Error writing file', err)
          } else {
              console.log('Successfully wrote file')
          }
      });

      
      if (deployedFungibleToken.address && deployTx.txParams.receipt) { 
        req.body.SCstatus = {};
        req.body.SCstatus['EquityTokenSC'] = {
          status: true,
          address: deployedFungibleToken.address
        };
        next();
      } else {
        throw createHttpError(500, `Something went wrong with ET Deployment for startpupId=${req.params.startupId}`)
      }      
      //Following line added to fix issue https://github.com/Zilliqa/Zilliqa-JavaScript-Library/issues/168
      // const deployedContract = zilliqa.contracts.at(deployedFungibleToken.address);
    } catch (err) {
      console.log(err);
      next(err)
    }
  },
  transfer: async function(req, res, next){
    // needs req.recipientAddress and req.sendFT
    if (!req.body.to || !req.body.amount ) {
      res.status(400).send({    
        message: "recipientAddress, amount not be empty!"
      });
      return;
    }
    try {
      privateKeys = req.body.privateKey ? req.body.privateKey : "";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      console.log(address);
      // console.log(req.body.recipientAddress ,req.body.sendFT)
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {equityToken} = require('../config/equitytoken.json');
      const deployedContract = zilliqa.contracts.at(equityToken);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling Transfer transition' );
      const callTx = await deployedContract.call(
        'Transfer',
        [
          {
            vname: 'to',
            type: 'ByStr20',
            value: req.body.to,
          },
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
      console.log(JSON.parse(JSON.stringify(state, null, 4)));
      // console.log(callTx)
      if (callTx.receipt) {
        console.log(`Succesfully transfer ${req.body.amount} to ${req.body.to}`);
        next()
      } else {
        res.status(500).send({
          "error": `Failed to transfer XSGD ${req.body.amount} from ${address} to ${req.body.to}`
        })
      }
    } catch (err) {
      console.log(err);
      next(err)
    }
  },
  transferBalanceToCF: async function(req, res, next){
    try {
      privateKeys = req.body.privateKey ? req.body.privateKey : "";
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {equityToken} = require('../config/equitytoken.json');
      const deployedContract = zilliqa.contracts.at(equityToken);
      const {crowdfundingAddress} = require('../config/crowdfunding.json');
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling TransferBalanceToCF transition' );
      const callTx = await deployedContract.call(
        'TransferBalanceToCF',
        [
          {
            vname: 'cf_address',
            type: 'ByStr20',
            value: `${crowdfundingAddress}`,
          },
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
      next()
    } catch (err) {
      console.log(err);
    }
  },
  burnToken: async function(req, res, next){
    try {
      privateKeys = req.body.privateKey;
      zilliqa.wallet.addByPrivateKey(privateKeys);
      const address = getAddressFromPrivateKey(privateKeys);
      zilliqa.wallet.setDefault(address);
      // console.log(req.body.recipientAddress ,req.body.sendFT)
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      var {equityToken} = require('../config/equitytoken.json');
      const deployedContract = zilliqa.contracts.at(equityToken);
  
      // Create a new timebased message and call setHello
      // Also notice here we have a default function parameter named toDs as mentioned above.
      // For calling a smart contract, any transaction can be processed in the DS but not every transaction can be processed in the shards.
      // For those transactions are involved in chain call, the value of toDs should always be true.
      // If a transaction of contract invocation is sent to a shard and if the shard is not allowed to process it, then the transaction will be dropped.
      console.log('Calling BurnToken transition' );
      const callTx = await deployedContract.call(
        'BurnToken',
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
  }
}
