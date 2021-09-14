require('dotenv').config();
const express = require("express");
const path = require ("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");


const Rejister = require("./models/rejisters");
require("./db/conn"); 

const port = process.env.PORT || 3000;


const static_path= path.join(__dirname , "../public");
const template_path= path.join(__dirname , "../templates/views");
const partials_path= path.join(__dirname , "../templates/partials");

;

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use(express.static(static_path));
app.set("view engine","hbs")
app.set("views", template_path);



hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY);

app.get("/" , (req , res) => {
    res.render("index")
});
app.get("/rejister" ,(req,res) =>{
    res.render("rejister")
})
app.post("/rejister" , async  (req,res) =>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

       if(password===cpassword){
           const rejisterEmployee = new Rejister({
               firstname:req.body.firstname,
               lastname:req.body.lastname,
               birthday:req.body.birthday,
               gender:req.body.gender,
               phone:req.body.phone,
               email:req.body.email,
               password:req.body.password,
               confirmpassword:req.body.confirmpassword

           })
           
           const token =  rejisterEmployee.generateAuthToken();
           console.log("Perfectly working");
           res.cookie("jwt" , token , {
               expires:new Date(Date.now() + 3000),
               httpOnly:true
           });
           console.log(cookie);
           const rejistered = await rejisterEmployee.save();
              
           




           console.log("the eroor is here");
           res.status(201).render("index");
       }else{
           res.send("password is not matching with your confirm password try again")
       }
    }catch(error){
        res.status(400).send(error);
        console.log("error in catch is avaliable");
    } 
})
app.get("/login" ,(req,res) =>{
    res.render("login")
})
app.post("/login" , async  (req,res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;
         const useremail = await Rejister.findOne({email:email});
         const inMatch=  await bcrypt.compare(password,useremail.password);
         

         const token =   await useremail.generateAuthToken();
         res.cookie("jwt" , token , {
            expires:new Date(Date.now() + 3000),
            httpOnly:true
        });
        console.log(cookie);
         console.log("login token working working");
         if(inMatch){
             res.status(201).render("index");
         }else{
             res.send("incorrect password")
         }
          
    
    }catch(error){
        res.status(400).send("invalid email and password");
    } 
})
        


app.listen(port , () => {
    console.log(`you are listening the ${port} `)
})