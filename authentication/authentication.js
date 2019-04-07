var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var secret=require("../config/secret");
const randomstring =require("randomstring");
import {firebase} from "../firebase/firebasekey";
import { isUndefined } from 'util';

var generateString=function(){
    var theString=randomstring.generate({
        length:8,
        charset:'numeric'
    });
    return theString;
    
}



var User= /** @class */ (function () {
    function user(username,email,password) {
        this.username=username,
       // this.role=role;
        this.email=email,
        this.password=password
        //this.ImageUrl=ImageUrl
    }
    return user;
}());

  
//work on the other details later
const register=function login(data,callback){
    var id=generateString();
    var hashedPassword = bcrypt.hashSync(data.password, 8);
    
    var newUser=new User(data.username,data.email,data.password)
    const userReference=firebase.database().ref("staff");
    userReference.child(id).set({
        username:newUser.username,
        email:newUser.email,
        password:newUser.password

    },function(error){
      if(error){
          console.log("Registration failed"+error);
          return false

      }else{
         
        var token = jwt.sign({user:newUser},secret.jwt, {
            expiresIn: 60 * 24 
          });
      }
    
      return callback({
          auth:true,
          token:token,
          user:newUser
      })
    })

}

const checkifUserExist=function(email,callback){
    
    const user=firebase.database().ref("staff").orderByChild('email').equalTo(email);
    user.on("value",function(snapshot){
        if (snapshot.exists()) {
          var  userExist=true
        }
        else{
           var  userExist=false
        }
           return callback({
               userExist:userExist
           })
        })
    } 

       


const login=function(data,callback){
   checkifUserExist(data.email,function(detail){
    var userExist=detail.userExist
    if(!userExist){
        return callback({
            auth:false,
            response:"User with this email does not exist"
        })
       
    }else{
        const user=firebase.database().ref("staff").orderByChild('email').equalTo(data.email);
        user.on("child_added",function(snapshot){
            var userpassword = snapshot.val().password; 
            var passwordIsValid = bcrypt.compareSync(data.password, userpassword);
            
            if (!passwordIsValid) {
               var response="The password you entered might be incorrect"
               var auth=false
            }else
            {   
                 var auth=true;
                var response="Login successfully";
                var token = jwt.sign({user:user},secret.jwt, {
                    expiresIn: 86400
                  });
            }
              return callback({
                  auth:auth,
                  response:response,
                  token:token
              })
                  }
   



        )}

                })


        
            }


  
export{register,login};
