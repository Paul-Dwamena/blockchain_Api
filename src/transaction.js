const ecda=require("elliptic");
const lodash=require("lodash");
const SHA256=require("crypto-js");
const ec=new ecda.ec('secp256k1');

import {getAsaaseDetails,asaasecodeExist}from '../firebase/modules';
import{encryptData,decryptdata}from '../firebase/helper';



//checks the validity of the address
var isValidAddress = function (address) {
    if (address.length !== 130) {
       // console.log('invalid public key length');
        return false;
    }
    else if (address.match('^[a-fA-F0-9]+$') === null) {
        //console.log('public key must contain only hex characters');
        return false;
    }
    else if (!address.startsWith('04')) {
       // console.log('public key must start with 04');
        return false;
    }
    return true;
};


//to hex function
var toHexString = function (byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};


//this class is where the address and the landcode is put
var TransactionOutput = /** @class */ (function () {
    function TransactionOutput(address) {
        this.Reciepientaddress = address;
    }
    return TransactionOutput;
}());




//this class checks whether the property exist 
var TransactionInputs = /** @class */ (function () {

    function TransactionInputs(signature) {
        this.signature=signature;
        
    }
    return TransactionInputs;
})


var generateSignature=function(Senderpublickey,Reciepientpublickey,asaasecode){
    if(!isValidAddress(Senderpublickey)){
        return{
            error:"The Sender key you provided is incorrect"
        }
    }
    else if((!isValidAddress(Reciepientpublickey))){
        return{
            error:"The Reciepient key  you provided is incorrect"
        }
    }
    else{
        var code=asaasecode;
        var Senderkey=Senderpublickey;
        var Reciepientkey=Reciepientpublickey;
        var dataToSign={
            code:code,
            senderkey:Senderkey,
            reciepientkey:Reciepientkey
        }
var signature=encryptData(dataToSign);
    }
return signature;
}

var getDataFromSignature=function(data){
    var Data=data;
    var decrytedData=decryptdata(Data);
    return decrytedData
}

    

var keys=[];

//generating the private key
var generatekeys=function(){
    var privatekey= ec.genKeyPair().priv;
    var publickey=ec.keyFromPrivate(privatekey, 'hex').getPublic().encode('hex');
    keys.push(privatekey);
    keys.push(publickey);
    return publickey;


}

//console.log(generatekeys());




 function ProcessTransaction  (data,callback) {
    asaasecodeExist(data.code,function(response){
        var status=response
        if(status){
            var resp;
            if(!isValidAddress(data.senderkey)){
                resp="The Sender key you provided is wrong"
            }
            else if(!isValidAddress(data.reciepientkey)){
                resp="The Reciepient key you provided is wrong"
            }
            else{
                 resp={
                    asaasecode:data.code,
                    senderkey:data.senderkey,
                    reciepientkey:data.reciepientkey
                }
            }
        }
        return callback({
            detail:resp
        })
    })
       
    }
          

       
        
         

            
        

    

    
export {generatekeys,generateSignature,getDataFromSignature, ProcessTransaction,TransactionInputs,TransactionOutput};


