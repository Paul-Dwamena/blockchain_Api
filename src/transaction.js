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



var generateSignature=function(Senderpublickey,Reciepientpublickey,asaasecode,callback){
    var error=null;
    var success=null;
    if(!isValidAddress(Senderpublickey)){
        error=new Error("The Sender key  you provided is incorrect")
    }
    else if((!isValidAddress(Reciepientpublickey))){
        error=new Error("The Reciepient key  you provided is incorrect")
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
    return callback(error,signature)

}

var getDataFromSignature=function(data){
    var Data=data;
    var decrytedData=decryptdata(Data);
    return {
        decrytedData:decrytedData
}
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





function lockTransaction(){
    
} 


 const transact=function(asaasecode,senderkey,reciepientkey,callback){
     var error=null;
     var mydata=null;
     generateSignature(senderkey,reciepientkey,asaasecode,function(err,signature){
         if(err){
             error=new Error(err.message);
             return callback(error,null);
         }else{
            var data=signature;
            
            var signatureDetails=getDataFromSignature(data);
            
            asaasecodeExist(signatureDetails.decrytedData.code,function(response){
                if(response.response){
                    mydata={
                        signature:data,
                        senderkey:senderkey,
                        reciepientkey:reciepientkey
   
                    }  
                 
                 
                }
                   else{
                    error=new Error("The asaasecode you provided is incorrect");    
                   }
       return callback(error,mydata);
                })
     };
     


    
     

     })
 }
       
 function ProcessTransaction  (data,callback) {
   transact
       
}
         

            
        

    

    
export {generatekeys,generateSignature,getDataFromSignature, ProcessTransaction,TransactionInputs,TransactionOutput,transact,isValidAddress};


