
---

# Backend API Documentation

This is the backend server for the application, built with **Node.js**, **Express**, and **MongoDB**. The server manages multiple routes and includes a payment gateway integration using **Stripe**.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Stripe Integration](#stripe-integration)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started
These instructions will help you set up and run the backend server on your local machine for development and testing purposes.

---

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe Account](https://stripe.com/)

---

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (see [Environment Variables](#environment-variables) section).

4. Start the server:
   ```bash
   npm run start
   ```
   The server will run at `http://localhost:5000` by default.

---

## Environment Variables
Create a `.env` file in the root directory with the following keys:

```env
# Server Configuration
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/your-database-name

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_WEBHOOK_SECRET=your-web-hook-key

# Other
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

Replace placeholders with your actual keys and credentials.

---

## Project Structure
The folder structure for the backend:

```
service/
├── controllers/         # Route logic (CRUD operations, Stripe integration)
├── models/              # MongoDB models (Mongoose schemas)
├── routers/             # API endpoints
├── middleware/          # Custom middleware (authentication, error handling)
├── utils/               # Utility functions (optional)
├── services/            # Configuration files
├── server.js            # Server entry point
├── package.json         # Node.js dependencies and scripts
├── README.md            # Project documentation
```

---

## API Endpoints
### Authentication
- `POST /api/auth/sign-up` - Register a new user.
- `POST /api/auth/login` - Login and generate a JWT.

### Payments
- `POST /api/payments/checkout` - Process a payment via Stripe.

---

## Stripe Integration
The project uses **Stripe** for payment processing.

1. **Endpoint**: `/api/payments/checkout`
2. **Method**: `POST`
3. **Request Body**:
   ```json
   {
     "amount": 1000, 
     "currency": "usd",
     "bookingId": "8ssc8dw339vcjsw9ef"
   }
   ```
4. **Response**:
   ```json
   {
     "success": true,
     "message": "Payment processed successfully"
   }
   ```
5. **Logic**:
   - Validate request body.
   - Use Stripe SDK to process the payment.
   - Handle success and error scenarios.

Ensure you set up your **webhooks** in Stripe Dashboard to handle events like `payment_intent.succeeded`.

---

## Running Tests
1. Install testing dependencies:
   ```bash
   npm install --save-dev jest supertest
   ```
2. Run tests:
   ```bash
   npm test
   ```

---

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---