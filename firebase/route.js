const route=require('express').Router();

//getting all status  of land ownership
route.get('/landownershipstatus', function (req, res) {
    console.log("HTTP Get Request");
    var landownershipReference=firebase.database().ref("LandownershipStatus");
    landownershipReference.on("value",
    function(snapshot){
        res.json(snapshot.val());
        landownershipReference.off("value");
    },function(errorObject){
        res.send("there was an error"+errorObject.code);
    }
    )
  });




//getting all owners of lands
  route.get('/owners', function (req, res) {
    console.log("HTTP Get Request");
    var ownerReference=firebase.database().ref("owner");
    ownerReference.on("value",
    function(snapshot){
        res.json(snapshot.val());
        ownerReference.off("value");
    },function(errorObject){
        res.send("there was an error"+errorObject.code);
    }
    )
  });

  


 //getting all lands
     
 route.get('/lands', function (req, res) {
    console.log("HTTP Get Request");
 var landReference=firebase.database().ref("Lands");
    landReference.on("value",
    function(snapshot){
         res.json(snapshot.val());
    landReference.off("value");
      },function(errorObject){
        console.log("There was an error"+errorObject.code);
       res.send("there was an error"+errorObject.code);
        }
        )
});  
     


module.exports=route;
