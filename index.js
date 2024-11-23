const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client')
require('dotenv').config();
const prisma = new PrismaClient()
const bodyparser = require('body-parser')

app.use(bodyparser.json());
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Welcome home');
})

app.post('/identify', async (req, res) => {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Email or Phone number is requierd" })
    }
    const contactToBeAdded = await prisma.contact.create({
        data: {
            email: email,
            phoneNumber: phoneNumber
        }
    })
    console.log(contactToBeAdded);
    res.status(200).json({
        contact: {
            primaryContatctId: contactToBeAdded.id,
            emails: [contactToBeAdded.email],
            phoneNumbers: [contactToBeAdded.phoneNumber],
            secondaryContactIds: []
        }
    })

})

app.listen(PORT, () => {
    console.log('Server running on port 4000')
})