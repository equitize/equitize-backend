// get address of deployed fungibleToken smart contract 
const fs = require('fs');
var {fungibleTokenAddress} = require('../config/fungibleToken.json');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
  toBech32Address,
  getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);

if (process.env.NODE_ENV !== 'prod-VPC') {
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
}
// Populate the wallet with an account
const privateKey = "9ec14378e6b6058e21497917df8632d6afde2d0ffced3305c8e7d6411dd00ef7";
  // process.env.ZILLIQA_PRIVATE_KEY
  // '9ec14378e6b6058e21497917df8632d6afde2d0ffced3305c8e7d6411dd00ef7';


zilliqa.wallet.addByPrivateKey(privateKey);
const address = getAddressFromPrivateKey(privateKey);
// const sendFT = 20;
// const recipientAddress = "0xF9726EDC5EE6A46B0c9986636182Ae71c31b3E2D";

module.exports ={
  deploy: async function(req, res, next){
    console.log(req.body)
    if (!req.body.coinName || !req.body.coinSupply ||!req.body.coinSymbol ||!req.body.coinDecimals) {
      
      res.status(400).send({    
        message: "coinName, coinSupply, coinSymbol, coinDecimals can not be empty!"
      });
      return;
    }
    
    try {
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
      console.log(`Deploying a new contract....`);
      var fungibleToken = require("../smart_contracts/fungibleToken.js")
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
        fungibleTokenAddress: deployedFungibleToken.address,
      }
      const jsonString = JSON.stringify(saveAddress);
      fs.writeFile('./smartContracts/config/fungibleToken.json', jsonString, err => {
          if (err) {
              console.log('Error writing file', err)
          } else {
              console.log('Successfully wrote file')
              
          }
      });
      req.body.SCstatus['fungibleTokenSC'] = {
        status: true,
        address: deployedFungibleToken.address
      };
      next()
      
      //Following line added to fix issue https://github.com/Zilliqa/Zilliqa-JavaScript-Library/issues/168
      // const deployedContract = zilliqa.contracts.at(deployedFungibleToken.address);
    } catch (err) {
      console.log(err);
    }
  },
  transfer: async function(req, res, next){
    // needs req.recipientAddress and req.sendFT
    if (!req.body.recipientAddress || !req.body.sendFT ) {
      res.status(400).send({    
        message: "recipientAddress, sendFTcan not be empty!"
      });
      return;
    }
    try {
      console.log(req.body.recipientAddress ,req.body.sendFT)
      const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
      const deployedContract = zilliqa.contracts.at(fungibleTokenAddress);
  
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
            value: req.body.recipientAddress,
          },
          {
            vname: 'amount',
            type: 'Uint128',
            value: `${req.body.sendFT}`,
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
  }
}
