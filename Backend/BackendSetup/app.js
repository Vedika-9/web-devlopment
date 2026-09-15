//Backend Rules To Write Code

//Step1 : Importing(To Get) All Required modules Whatever we want to use in our Backend Application
//express(backend and the database connection) , mongoose(backend and the database connection) , cors(helps to share data) , dotenv(sensitive data/address of...) , bcrypt(encrypt the password) ,jsonwebtoken (when you login it create unique token id)etc

//syntax :  require('module-name')  Method - help us to import modules

const express   =     require('express')

//Step 2 : Create Express Application (function)  //You cannot build API without this.

const app   =   express()  //express()= build-in function       //Task - Build API

//Step 3: Define Routes- API Endpoint

//API Methods of Communication - GET , POST , PUT , DELETE
//Get  : Get The Data from Server/Backend
//Post : Send The Data To Server
//Put  : Update The Existing Data
//Delete : Completely Delete The Data

//Syntax to build API - app.methodname('Path/Api Address', (req,res)=>{ })

//Home Backend - testing
app.get('/',(req,res)=>{
    res.send('Api Running')  // 'APi..'- text/string
})


app.get('/login' , (req,res)=>{
    res.send('Fill The Form To Login/Good Evening User')
})  

app.get('/signup' , (req,res)=>{
    res.send('Fill The Signup To Login/Good Morning User')
})  

//Step 4 : Start the Backend/ activate the backend
//Port : Port is Like Address on Internet Which Acts Like Backend Address So That Frontend can communicate with Backend using The Port

//We have Different Free Port Like 3000,5000, 8000, 8080: We can use Any of Them Ports Start ours server

//Syntax to start server : app.listen(portNumber, function-Confirmation Message)

app.listen(3000,()=>{
  console.log('Server Running on http://localhost:3000 ')
})