const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client')
require('dotenv').config();
const prisma = new PrismaClient()
const bodyparser = require('body-parser')

app.use(bodyparser.json());
const PORT = process.env.PORT || 4000;

app.get('/', (req,res)=>{
    res.send('Welcome home');
})
app.post('/identify', async(req,res)=>{
    const body = req.body;
    console.log(body);
    res.status(200).json({'body': body})
})
app.listen(PORT, ()=>{
    console.log('Server running on port 4000')
})