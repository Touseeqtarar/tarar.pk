const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema= new mongoose.Schema ({
   firstname : {
       type:String,
       required:true
   },
   lastname : {
    type:String,
    required:true
},
  birthday : {
    type:String,
    required:true
},
 gender : {
    type:String,
    required:true
},
phone : {
    type:Number,
    required:true,
    unique:true
},
email : {
    type:String,
    required:true,
    unique:true 
},
password : {
    type:String,Number,
    required:true,
    
},
confirmpassword : {
    type:String,Number,
    
    required:true
},

tokens :[{
    token:{
        type:String,
        required:true
    }
}]

})
   
employeeSchema.methods.generateAuthToken = async function () {

try{
    const token = jwt.sign({_id:this._id.toString()}  , process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token});
    
    await this.save();
    return token;
}catch(error){
  
   console.log("the error part" + error);
}

     

}










employeeSchema.pre("save" , async function (next) {

   if(this.isModified("password")){
    
       this.password = await bcrypt.hash(this.password ,10)
       this.confirmpassword = await bcrypt.hash(this.confirmpassword ,10)


    
   }
   next();

})




const Rejister =  new mongoose.model("Rejister" , employeeSchema);
module.exports= Rejister ;