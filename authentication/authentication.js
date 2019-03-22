var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var secret=require("../config/secret");
const randomstring =require("randomstring");
import {firebase} from "../firebase/firebasekey";

var generateString=function(){
    var theString=randomstring.generate({
        length:8,
        charset:'numeric'
    });
    return theString;
    
}



var User= /** @class */ (function () {
    function user(firstname,lastname,email,password) {
        this.firstname=firstname;
        this.lastname=lastname;
       // this.role=role;
        this.email=email,
        this.password=password
        //this.ImageUrl=ImageUrl
    }
    return user;
}());

  

const register=function login(data,callback){
    var id=generateString();
    var hashedPassword = bcrypt.hashSync(data.password, 8);
    
    var newUser=new User(data.firstname,data.lastname,data.email,hashedPassword);
    const userReference=firebase.database().ref("staff");
    userReference.child(id).set({
        firstname:newUser.firstname,
        lastname:newUser.lastname,
        email:newUser.email,
        password:newUser.password

    },function(error){
      if(error){
          console.log("Registration failed"+error);
          return false

      }else{
         //console.log(secret.jwt)   
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

       



const login=function(data,callback){
    const user=firebase.database().ref("staff").orderByChild('email').equalTo(data.email);
    user.once("child_added",function(snapshot){
       
        if(snapshot.exists()){
            
           var user=snapshot.val();
           
           var userpassword=user.password;
           
           var passwordIsValid = bcrypt.compareSync(data.password, userpassword);
           
           if (!passwordIsValid) {
              var response="Authentication failed because no token was found"
              var auth=false
           }else
           {   
               var auth=true;
               var response="Login successfully";
               var token = jwt.sign({user:user},secret.jwt, {
                   expiresIn: 86400
                 });
           }
            

       }else{
           
        var response="User with this email does not exist";
        var auth=false;
       }
           return callback({
               response:response,
               auth:auth,
               token:token
           })
        }
        )
    }

            
        
    


  
export{register,login};
