# Gym Membership Management API

## Overview

The Gym Membership Management API provides an interface for managing gym memberships. It allows you to register new members, view membership details, update membership start dates, cancel memberships, track attendance, add payments, and manage referrals. This API is ideal for gym owners who want to maintain an efficient system to manage their members and related activities.

## Features

- Register new gym members
- View member details and all active members
- Modify membership start dates
- Cancel memberships
- Track member attendance
- Add payments for members
- Add referral information

## Technologies Used

- Node.js
- Express.js
- Swagger (for API documentation)
- In-memory data storage (can be replaced with a database like MongoDB, PostgreSQL, or MySQL)

## API Endpoints

### 1. Register Membership
**POST** `/register`

Registers a new gym member.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "startDate": "string",
  "tier": "string",
  "referredBy": "string",
  "referralCount": 0
}
