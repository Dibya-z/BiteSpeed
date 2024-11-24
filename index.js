const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client')
require('dotenv').config();
const prisma = new PrismaClient()
const bodyparser = require('body-parser')

const contactRoutes = require('./routes/contactRoutes')

const PORT = process.env.PORT || 4000;
app.use(bodyparser.json());
app.use('/',contactRoutes);

app.get('/', (req, res) => {
    res.send('Welcome home');
})

app.listen(PORT, () => {
    console.log('Server running on port 4000')
})