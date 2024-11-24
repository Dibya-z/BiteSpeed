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
```
**Response**:
Success (HTTP 200): Returns the consolidated contact details:(just an example, actual respose can vary)
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```
**Error Handling**:

If both email and phoneNumber are missing in the request:
Error (HTTP 400): Occurs if neither email nor phoneNumber is provided:
json
```json
{
  "error": "Email or Phone number is required"
}
```
## Database Behavior
**1. New Contact Creation**: 

*If no matching contact is found, a new Contact row is created with linkPrecedence: "primary".**
**2. Link Existing Contacts**: 

*If an email or phoneNumber matches existing entries, the data is linked under the oldest "primary" contact.**
**3. Primary to Secondary Transition**:

*Updates the linkPrecedence of an existing primary contact to secondary if linking requires a new primary.*

**And more based on edge cases**
## Database Schema

The application uses a single table named `Contact`.

```prisma
model Contact {
  id              Int       @id @default(autoincrement())
  phoneNumber     String?   // Customer's phone number (optional)
  email           String?   // Customer's email address (optional)
  linkedId        Int?      // ID of the primary contact this contact is linked to
  linkPrecedence  String    @default("primary") // Indicates whether the contact is primary or secondary
  createdAt       DateTime  @default(now())     // Timestamp when the contact was created
  updatedAt       DateTime  @updatedAt          // Timestamp when the contact was last updated
  deletedAt       DateTime?                     // Timestamp when the contact was deleted (optional)
}
```

