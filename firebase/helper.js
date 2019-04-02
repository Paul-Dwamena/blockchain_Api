const randomstring =require("randomstring");
const Nexmo=require('nexmo');
const nodemailer=require('nodemailer');
const hashmap=require('hashmap');
const crypto=require('crypto');
const algorithm='aes-256-cbc';
const key='abcdefghijklmnopqrstuvwxyz123456';
const iv=crypto.randomBytes(16);
const util = require('util')
var randomNumber = require("random-number-csprng");






const nexmo=new Nexmo({
    apiKey:'05f924fc',
    apiSecret:'IgKHp14vPaDHj6Mc'
});

//function to send message
var sendMessage=function(ownerNumber){
    nexmo.message.sendSms(
        '233559225573', ownerNumber, 'yo',
          (err, responseData) => {
            if (err) {
              console.log(err);
            } else {
              console.dir(responseData);
            }
          }
       );
}

//function to generatestring
var generateString=function(){
    var theString=randomstring.generate({
        length:3,
        charset:'numeric'
    });
    return theString;
    
}

function designMessagebody(asaasecode,securitycode){
    var message;
    var msg1;
    var msg2;
    var msg3;
      msg1="Thanks for registering with hashlands.Kindly keep the details given to you very safe from unauthorised people."
      msg2="Asaasecode"+" "+asaasecode+ " gives you access to all your land ownership details.";
      msg3="Securitycode"+" "+securitycode+" will be use later for login into the mobile app.";
      message=msg1+" "+msg2+" "+msg3;

    

      return message;
}
 var sendEmail=function(reciepient,messageBody,messageSubject){
     
     var transporter=nodemailer.createTransport({
         service:'gmail',
         auth:{
             user:"app@gmail.com",
             pass:''
         }

     });
     var mailOptions={
         from:"app@gmail.com",
         to:reciepient,
         subject:messageSubject,
         html: messageBody
     }
     transporter.sendMail(mailOptions,function(error,info){
         if(error){
             console.log(error)
         }else{
             console.log('Email sent:'+info.response)
         }
     });
 }

var AreaCodes=new hashmap();

//function to generate Area code
var getareacode=function(region){
    var code='';
    AreaCodes.multi("Greater-Accra","GEA","Eastern","EAS","Western","WES","Brong-Ahafo","BHA",
    "Ashanti","ASI","Northern","NOR","Central","CNT","Volta","VLT","Upper-East","UPE","Upper-West","UPW");
    switch(region){
        case "Greater-Accra":
        code=AreaCodes.get(region);
        break;

        case "Eastern":
        code=AreaCodes.get(region);
        break;

        case "Western":
        code=AreaCodes.get(region);
        break;

        case "Brong-Ahafo":
        code=AreaCodes.get(region);
        break;

        case "Ashanti":
        code=AreaCodes.get(region);
        break;

        case "Northern":
        code=AreaCodes.get(region);
        break;

        case "Central":
        code=AreaCodes.get(region);
        break;

        case "Volta":
        code=AreaCodes.get(region);
        break;

        case "Upper-East":
        code=AreaCodes.get(region);
        break;

        case "Upper-Wast":
        code=AreaCodes.get(region);
        break;

        default:
        code="NRL"
    }
    return code;
}

//function to generate asaasecode
var generateAsaaseCode=function(landarea){
    var firstrandomword=generateString();
    var secondrandomword=generateString();
    var thirdrandomword=generateString();

    var areacode=getareacode(landarea);
    var asaasecode=areacode+"-"+firstrandomword+"-"+secondrandomword+"-"+thirdrandomword;

    return(asaasecode);

}


//console.log(AsaaseCode("Greater-Accra"));

function encryptData(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(new Buffer(JSON.stringify(text)));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
         iv: iv.toString('hex'), 
    encryptedData: encrypted.toString('hex') };
   }
   
   function decryptdata(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
   }
   
   
   var generateSecurityKey=function(){
    var theString=randomstring.generate({
        length:8,
        charset:'hex',
        capitalization:'uppercase'
    });
    return theString;
    
}

   //console.log(land.OtherDocument);
   export{encryptData,decryptdata,generateAsaaseCode,generateSecurityKey,sendEmail,designMessagebody};
   
   
