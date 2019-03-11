const SHA256 = require('crypto-js/sha256');
import {broadcastLatest} from './peer2peer';
import {hexToBinary} from './util';
const ecda=require("elliptic");
const ec=new ecda.ec('secp256k1');
const randomstring =require("randomstring");

import {ProcessTransaction,TransactionInputs,TransactionOutput} from './transaction';

//function to generatestring
var generateString=function(){
    var theString=randomstring.generate({
        length:4,
        charset:'numeric'
    });
    return theString;
    
}

//Transaction Class
var Transaction = /** @class */ (function () {
    function Transaction(index,title, fromAddress,toAdrress, landtitle) {
        this.title=title;
        this.index = index;
        this.fromAddress = fromAddress;
        this.timestamp = new Date().getTime();
        this.toAdrress = toAdrress;
        this.landtitle=landtitle;
        this.hash =this.calculateHashForTransaction();
    }
    Transaction.prototype.calculateHashForTransaction= function(){
        return SHA256(this.index+this.title+this.fromAddress + this.timestamp+this.toAdrress + this.landtitle).toString();
       }
    return Transaction;
}());

//LandOwnership Class
var LandOwnerShip= /** @class */ (function () {
    function LandOwnerShip(index,title,LandTitle,OtherDocument) {
        this.index = index;
        this.title= title;
        this.timestamp =new Date().getTime();
        this.LandTitle=LandTitle;
        this.OtherDocument=OtherDocument;
        this.hash = this.calculateHashForLandOwnerShip();
    }
    LandOwnerShip.prototype.calculateHashForLandOwnerShip= function(){
        return SHA256(this.index+this.title+this.timestamp+this.LandTitle+JSON.stringify(this.OtherDocument)).toString();
       }
    return LandOwnerShip;
}());








var Block = /** @class */ (function () {
    function Block(index,blockTitle, hash, previousHash, timestamp, data, difficulty, nonce) {
        this.index = index;
        this.blockTitle=blockTitle;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
    return Block;
}());



//genesis Block
var genesisBlock = new Block(0,"First Block", '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705, 'my genesis block!!', 0, 0);

var blockchain = [genesisBlock];

//getting the blockchain
var getBlockchain = function () { 
    return blockchain; };

//getting the last block of the chain
var getLatestBlock = function () 
{
     return blockchain[blockchain.length - 1]; 
    };


//  defines how often a block should be found
var BLOCK_GENERATION_INTERVAL = 3;

//  defines how often the difficulty should adjust 
var DIFFICULTY_ADJUSTMENT_INTERVAL = 3;

//getting and adjusting the diffivulty
var getDifficulty = function (aBlockchain) {
    var latestBlock = aBlockchain[blockchain.length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    }
    else {
        return latestBlock.difficulty;
    }
};

//getting the adjusted difficulty
var getAdjustedDifficulty = function (latestBlock, aBlockchain) {
    var prevAdjustmentBlock = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    var timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    var timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficulty + 1;
    }
    else if (timeTaken > timeExpected * 2 && prevAdjustmentBlock.difficulty!=0) {
        return prevAdjustmentBlock.difficulty - 1;
    }
    else {
        return prevAdjustmentBlock.difficulty;
    } 
};

//getting the current timestamp
var getCurrentTimestamp = function () { return Math.round(new Date().getTime() / 1000); };

//generating the next block
var generateNextBlock = function (blockData) {
    var Blocktitle=""; 
    var newBlockData;
    if(blockData.Title==="transaction"){
        Blocktitle="transaction";
        newBlockData={
            TransactionId:generateString(),
            SenderAddress:blockData.Senderaddress,
            ReciepientAddress:blockData.Reciepientaddress,
            LandOwnerShipDetailsNumber:blockData.LandOwnerShipDetails

        }
       

    }
    else{
        Blocktitle="Landownership";
        newBlockData={
            ownerDetails:blockData.firstname+" "+blockData.lastname+" "+blockData.othername,
            LandDetails:blockData.region+" "+blockData.landarea,
            LandOwnerShipDetails:blockData.DocumentofApproval
        }
    }
    var previousBlock = getLatestBlock();
    var difficulty = getDifficulty(getBlockchain());
    
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = getCurrentTimestamp();
    var newBlock = findBlock(nextIndex,Blocktitle, previousBlock.hash, nextTimestamp, newBlockData, difficulty);
    var message;
    message=addBlock(newBlock).msg;
    broadcastLatest();
    return{
      newBlock,
      message:message  
    } 
};

//a function to find a block
var findBlock = function (index,blockTitle, previousHash, timestamp, data, difficulty) {
    var nonce = 0;
    while (true) {
        var hash = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new Block(index,blockTitle, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};

//function to calculate hash for block
var calculateHashForBlock = function (block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);
};
var calculateHash = function (index, previousHash, timestamp, data, difficulty, nonce) {
    return SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();
};


//adding block to the chain
var addBlock = function (newBlock) {
    
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return{
            msg:"Data added successfully"
        }
    }
    else{
        return{
            msg:"An error occured"
        }
    }
};




//checking the structure of the block
var isValidBlockStructure = function (block) {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'object';
};

//validating a newblock to be added to 
var isValidNewBlock = function (newBlock, previousBlock) {
    if (!isValidBlockStructure(newBlock)) {
        console.log('invalid structure');
        return false;
    }
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    }
    else if (!isValidTimestamp(newBlock, previousBlock)) {
        console.log('invalid timestamp');
        return false;
    }
    else if (!hasValidHash(newBlock)) {
        return false;
    }
    return true;
};

//getting the accumulated difficulty of the blockchain
var getAccumulatedDifficulty = function (aBlockchain) {
    return aBlockchain
        .map(function (block) { return block.difficulty; })
        .map(function (difficulty) { return Math.pow(2, difficulty); })
        .reduce(function (a, b) { return a + b; });
};

//checking the  validity of the time stamp
var isValidTimestamp = function (newBlock, previousBlock) {
    return (previousBlock.timestamp - 60 < newBlock.timestamp)
        && newBlock.timestamp - 60 < getCurrentTimestamp();
};

//checking if the block has valid hash
var hasValidHash = function (block) {
    if (!hashMatchesBlockContent(block)) {
        console.log('invalid hash, got:' + block.hash);
        return false;
    }
    if (!hashMatchesDifficulty(block.hash, block.difficulty)) {
        console.log('block difficulty not satisfied. Expected: ' + block.difficulty + 'got: ' + block.hash);
    }
    return true;
};


//checking if the hash is equal to the content
var hashMatchesBlockContent = function (block) {
    var blockHash = calculateHashForBlock(block);
    return blockHash === block.hash;
};

//checking if the hash matches the difficulty
var hashMatchesDifficulty = function (hash, difficulty) {
    var hashInBinary = hexToBinary(hash);
    var requiredPrefix = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
};

//checking if the blockchain is valid
var isValidChain = function (blockchainToValidate) {
    var isValidGenesis = function (block) {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};

//Replacing the blockchain with new one
var replaceChain = function (newBlocks) {
    if (isValidChain(newBlocks) &&
        getAccumulatedDifficulty(newBlocks) > getAccumulatedDifficulty(getBlockchain())) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcastLatest();
    }
    else {
        console.log('Received blockchain invalid');
    }
};

    
    export {Block, getBlockchain, getLatestBlock, generateNextBlock, isValidBlockStructure, replaceChain, addBlock};    
    
    

    