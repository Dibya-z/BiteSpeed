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
    console.log(email,phoneNumber)
    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Email or Phone number is requierd" })
    }
    const relatedContacts = await prisma.contact.findMany({
        where: {
            OR: [{ email},{phoneNumber}]
        }
    });
    console.log(relatedContacts);
    if (relatedContacts.length === 0) {
        const contactToBeAdded = await prisma.contact.create({
            data: {
                email: email,
                phoneNumber: phoneNumber
            }
        })
        console.log(contactToBeAdded);
        return res.status(200).json({
            contact: {
                primaryContatctId: contactToBeAdded.id,
                emails: [contactToBeAdded.email],
                phoneNumbers: [contactToBeAdded.phoneNumber],
                secondaryContactIds: []
            }
        })

    }
    else {
        const mySet = new Set();

        for (let i = 0; i < relatedContacts.length; i++) {     //adding all the ids of parent to set to check
            if (relatedContacts[i].linkPrecedence === "secondary") {
                mySet.add(relatedContacts[i].linkedId);
            }
            else {
                mySet.add(relatedContacts[i].id)
            }
        }
        const arr = [...mySet]
        if (mySet.size === 1) {   //if 1 parent id that means case-2
            if (email && phoneNumber) {
                const contact = await prisma.contact.create({
                    data: {
                        email: email,
                        phoneNumber: phoneNumber,
                        linkedId:  arr[0],
                        linkPrecedence: "secondary"
                    }
                })

            }
            const primaryMail = await prisma.contact.findUnique({
                where : {id : arr[0]},
                select : {
                    email : true,
                }
            })
            const secondaryEmails = await prisma.contact.findMany({
                where : {linkedId : arr[0]},
                select : {
                    email : true,
                }
            })
            const primaryNumber = await prisma.contact.findUnique({
                where : {id : arr[0]},
                select : {
                    phoneNumber : true,
                }
            })
            const secondaryNumber = await prisma.contact.findMany({
                where : {linkedId : arr[0]},
                select : {
                    phoneNumber : true,
                }
            })
            const secondaryIds = await prisma.contact.findMany({
                where : {linkedId : arr[0]},
                select : {
                    id : true
                }
            })
            const mail = [primaryMail.email, ...secondaryEmails.map((item) => item.email)]
            const set = new Set(mail);
            const mails = [...set]
            const numbers = [primaryNumber.phoneNumber, ...secondaryNumber.map((item) => item.phoneNumber)]
            const newset = new Set(numbers);
            const nums = [...newset]
            const secondaryContactIds = secondaryIds.map((item) => item.id);
            return res.status(200).json({
                contact: {
                    primaryContatctId: arr[0],
                    emails: mails,
                    phoneNumbers: nums,
                    secondaryContactIds: secondaryContactIds
                }
            })
        }
        else if (mySet.size === 2) {    //  if 2 parents id that means case-3
            
        }

    }


})

app.listen(PORT, () => {
    console.log('Server running on port 4000')
})