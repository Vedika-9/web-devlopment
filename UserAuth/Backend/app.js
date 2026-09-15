//Step 1- import the modules so we can use the modules
const express =require('express') //API      // first we install all these module in terminal and then write here.
const cors = require('cors') //Different Address Data Sharing
const mongoose = require('mongoose') //Backend - Database
const bcrypt = require('bcrypt') //Hash the sensitive data
const { type } = require('node:os')

//step 2- to create a express function
const app = express()

//MiddleWare  - security layer
app.use(cors())  //Enable
app.use(express.json())

//1. BACKEND - DATABASE CONNECTION

//A. syntax- mongoose.connect('Database Address')    

mongoose.connect('mongodb://localhost:27017/JuneUserAuth')

.then(()=>console.log("MongoDB Connected"))

.catch((err)=>console.log(err))

//B. Schema - BluePrint of Data which you want to store in DB/Collection
const UserSchema =   new    mongoose.Schema({
            //Key:value Pair
    
            name:String,
            email:{
                type:String,
                unique:true
            },
            password:String

        })


//C. Collection - Model
const User  =    mongoose.model('User',UserSchema)    


//API- Route Frontend - Backend  app.methodName

app.get('/',(req,res)=>{
    res.send('API Running ')
})


//1st API-Resgiter
app.post('/register', async(req,res)=>{


    const {username , email , password } =   req.body           //Frontend

    //Validation
    if(!username || !email || !password){
       return  res.json({ message : 'All Fields Are Required '})
    }

    //Check Existing User
    const existingUser   =  await   User.findOne({email})


    if(existingUser){
        return res.json({ message:'User Already Exits'})
    }

    //Hash Password
    const hashPassword = await bcrypt.hash(password,10)

    //Save The Data in Mongodb Collection

     const newUser = new User({
        username,
        email,
        password:hashPassword
    })

    await newUser.save()  //Store The Data

    res.json({
        message:'User Created Succesfully'
    })
})

//2nd API-Login

app.post('/login', async(req,res)=>{

const {email,password} = req.body

//1.Find user

const user = await User.findOne({email})

if(!user){
    return res.json({
        message:'User Not Found - Regsiter First'
    })
}

//Compare password 

const valid = await   bcrypt.compare(password , user.password)

if(valid){
    res.json({message:'Login Successfull'})
}else{
    res.json({message:'Invalid Credentials'})
}

})

//Start The Server
app.listen(3000,()=>{
    console.log('Server Running http://localhost:3000')
})