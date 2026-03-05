require('dotenv').config();

const express=require('express');
const cors=require('cors');

const app=express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Backend');
});

const PORT= process.env.PORT;

app.listen(PORT,()=>{
    console.log("Server is running");
});