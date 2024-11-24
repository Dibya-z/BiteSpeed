# Bitespeed: Identity Reconciliation

## Overview

This project implements an API endpoint to reconcile customer identities based on their email addresses and phone numbers. It ensures that all related orders made using different contact details are linked to the same primary contact. This solution is designed for FluxKart.com to reward loyal customers and provide personalized experiences.

---

## Tech Stack

- **Backend Framework**: Node.js
- **Database**: MySQL
- **ORM**: Prisma
- **Server**: Express.js

---

## Features

- Consolidates customer identities based on shared email or phone numbers.
- Creates new contact entries when no match is found.
- Links existing contacts under a primary contact for related entries.
- Dynamically updates contact precedence (primary or secondary) as required.
- Returns detailed responses, including all linked contact information.

---

## API Documentation

### Endpoint: `/identify`

**Method**: `POST`

**Request Body**:  
Accepts either `email` or `phoneNumber` (or both).  
Example:

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
**Response**:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
Error Handling:

If both email and phoneNumber are missing in the request:
json
Copy code
{
  "error": "Email or Phone number is required"
}
