
const p2p=require("./src/peer2peer");
const express=require("express");
const morgan=require("morgan");
const bodyParser=require("body-parser");
//var httpPort = parseInt(process.env.HTTP_PORT) || 5000;
var p2pPort = parseInt(process.env.P2P_PORT) || 6001;
const blockchain=require("./src/blockchain");
const cors = require('cors')
const app = express();
const routes=require('./firebase/route');
const path = require('path');




import {connectToPeers, getSockets, initP2PServer} from './src/peer2peer';
import {Block,Transaction,LandOwnerShip, generateNextBlock, getBlockchain} from './src/blockchain';
import {generatekeys,generateSignature,getDataFromSignature,ProcessTransaction}from './src/transaction';
import {firebase}from './firebase/firebasekey';
import {addland,landownership,saveAsaasecode,getAsaaseDetails,updateAsaaseCode,AsaasecodeExist} from './firebase/modules';
import {encryptData,decryptdata} from './firebase/helper';








   
    
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan("short"));
    app.use('/',routes);
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, 'index.html'));
  });

   
     
      app.get('/blocks', function (req, res) {
        res.send(getBlockchain());
      });

      app.post('/RegisterLand',function(req,res){
        var data=landownership(req.body);
        var newBlock=generateNextBlock(req.body);
        var feedback=newBlock.message;
        if(feedback !=null && data.msg !=null){
          res.send(feedback);
        }else{
          res.send("An error occurred and was unable to save");
        }
        let body='';
        body={
          landid:data.index,
          others:req.body
        }
        saveAsaasecode(body);
      
      })


      app.post('/completeTransaction',function(req,res){
        updateAsaaseCode(req.body,"GEA-467-188-732",function(detail){
          var data=detail;
          res.send(data);
        });
       var newBlock=generateNextBlock(req.body);
       var feedback=newBlock.message;
       if(feedback !=null && data.msg !=null){
        res.send(feedback);
      }else{
        res.send("An error occurred and was unable to save");
      }
       
      })

      app.post('/GetDetails',function(req,res){
        getAsaaseDetails(req.body.asaasecode,function(detail){
          var data=detail;
          res.send(data);
        })
      })
      app.post('/createSignature',function(req,res){
        var asaasecode=req.body.asaasecode;
        
        var reciepientkey=req.body.Reciepientpublickey;
        var senderkey=req.body.Senderpublickey;
        
        var signature=generateSignature(senderkey,reciepientkey,asaasecode);
        res.send(signature);
      })
      app.post('/getSignatureDetails',function(req,res){
        var data=getDataFromSignature(req.body.data);
        res.send(data);

      })
      app.post('/validateSignatureDetails',function(req,res){
        
        ProcessTransaction(req.body,function(detail){
          var validatedData=detail;
          res.send(validatedData.detail);
        });
     
      
      })
      app.post('/mineBlock', function (req, res) {
        var newBlock = generateNextBlock(req.body);
        var feedback=newBlock.message;
        res.send(feedback)
      });

      app.get('/peers', function (req, res) {
        res.send(getSockets().map(function (s) { return s._socket.remoteAddress + ':' + s._socket.remotePort; }));
       });
      app.post('/addPeer', function (req, res) {
        connectToPeers(req.body.peer);
        res.send();
       });

app.get('/getKeys',function(req,res){
    
    res.send(generatekeys());
  
});

app.listen(process.env.PORT || 4000, function(){
  console.log('Your node js server is running');
});


//initHttpServer(httpPort);
initP2PServer(p2pPort);
