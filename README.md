[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DIHvCS29)

---

## Team Name: 404 Brainstormers

## Project Video Link:
https://northeastern-my.sharepoint.com/:v:/r/personal/desai_dhruv1_northeastern_edu/Documents/SkyOpt.mp4?csf=1&web=1&e=2jkTDc&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

## Team Members and emails:

-   Sakshi Parikh: parikh.saks@northeastern.edu
-   Dhruv Desai: desai.dhruv1@northeastern.edu
-   Fenil Vaghasiya: vaghasiya.f@northeastern.edu
-   Poorvika Girish Babu: girishbabu.p@northeastern.edu

# SkyOpt

## Project Overview

This project is a comprehensive flight booking application designed to help users find the best deals on flights. It includes features such as a user-friendly login page, flight booking with customizable filters (date, from and to locations), and specil offer which user new user get on initial booking. Stripe payment is also integrated which allows user to pay and book flight.

## Features

-   **Login Page:** Secure login for users to access their flight booking account.
-   **Flight Search:** Search flights by origin, destination, dates, and other filters.
-   **Booking Flights:** Ability to book flights based on search results.

-   **First User Discounts:** First-time user discount system, this will provide a discount of x%.
-   **Export to CSV:** User can export data to CSV to analysis there spending of his past booking.
-   **User Dashboard:** Manage and view booking details, canceled flights, and other preferences.

## Technologies Used

-   **Backend:** Node.js, Express
-   **Frontend:** React.js
-   **Database:** MongoDB
-   **Authentication:** JWT or OAuth for secure user login

## API Endpoints

### 1. User Authentication

-   **POST /api/auth/login:** User login
-   **POST /api/auth/register:** User registration
-   **POST /api/auth/logout:** User logout
-   **GET /api/auth/user:** Retrieve the authenticated user's profile details (requires valid JWT token).
-   **POST /api/auth/forgot-password:** Initiate a password reset process.
-   **POST /api/auth/reset-password:** Complete the password reset using the new credentials.

### 2. Flight Search and Booking

-   **GET /api/flights/search:** Search for flights based on origin, destination, dates, and other filters.
-   **GET /api/flights/{id}:** Retrieve details of a specific flight.
-   **POST /api/flights/book:** Book a flight for the user.

### 3. Stripe

-   **POST /api/booking/checkout:** Creates Payment intent.

### 4.⁠ ⁠Pricing and Discounts

-   **GET /api/bookings/coupon-codes:** Compare prices for a specific route and date range across airlines.

## Setup and Installation

### Prerequisites

-   Node.js (v14 or later)
-   MongoDB (local or cloud instance)
-   NPM (Node Package Manager)

### Testing

To test the application, you can use Postman or any API testing tool to hit the available endpoints.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Object Model for the project using Domain Driven Design

---

## Title: SkyOpt: Flight Booking System

    classDiagram
    %% direction LR
    
    class Airline {
        UUID airlineId
        String name
        String country
    }
    
    class User {
        ObjectId _id
        String username
        String email
        String phone
        String passwordHash
        Boolean isFirstTimeCustomer
        Preferences preferences
        Date createdAt
        Date updatedAt
    }
    
    class Preferences {
        String currency
        Array~String~ preferredAirlines
        Number maxStops
        FlightDurationRange flightDurationRange
    }
    
    class FlightDurationRange {
        Number min
        Number max
    }
    
    class Flight {
        ObjectId _id
        String flightNumber
        String airline
        Route route
        Date departureTime
        Date arrivalTime
        Number duration
        Number availableSeats
        Price price
        String flightStatus
        Date createdAt
        Date updatedAt
    }
    
    class Route {
        Location from
        Location to
    }
    
    class Location {
        String city
        String airportCode
        String country
    }
    
    class Price {
        Number amount
        String currency
    }
    
    class Booking {
        ObjectId _id
        ObjectId userId
        ObjectId flightId
        Date bookingDate
        Date travelDate
        String seatClass
        Price price
        String status
        Array~PassengerDetails~ passengerDetails
        String couponApplied
        Date createdAt
        Date updatedAt
    }
    
    class PassengerDetails {
        String name
        Number age
        String passportNumber
        String nationality
    }
    
    class Coupon {
        ObjectId _id
        String code
        Number discountPercentage
        Boolean isFirstTimeUserOnly
        Date validFrom
        Date validUntil
        Number usageLimit
        Number timesUsed
        Date createdAt
        Date updatedAt
    }
    
    class PersonalAccessToken {
        UUID id
        UUID userId
        String name
        String token
        Array~String~ abilities
        Date lastUsedAt
        Date createdAt
        Date updatedAt
        Date expiresAt
    }
    
    class Payment {
        UUID paymentId
        UUID userId
        UUID bookingId
        Amount amount
        String paymentStatus
        String stripePaymentIntentId
        DateTime transactionDate
        String paymentMethod
        DateTime createdAt
        DateTime updatedAt
    }
    
    class Amount {
        String currency
        Number total
    }
    
    %% Relationships
    User "1" --> "1..*" PersonalAccessToken : has
    User "1" --> "0..*" Booking : makes
    User "1" --> "0..*" Payment : makes
    User "1" --> "0..*" SharedTicket : shares
    Booking "1" --> "0..1" Coupon : applies
    Booking "1" --> "1" Flight : books
    Booking "1" --> "0..*" SharedTicket : canShare
    Booking "1" --> "0..*" PassengerDetails : hasPassengers
    Flight "1" --> "1" Airline : operatedBy
    SharedTicket "1" --> "1" PasswordProtectedFile : protects
    Payment "1" --> "1" Amount : has

#  Model Diagram

<img width="480" alt="image" src="https://github.com/user-attachments/assets/1f388160-72e7-4ea8-83c8-efa1a6bc8134">

# Assignment 09 

# Flight Booking API Documentation

## Overview
The Flight Booking API provides endpoints for managing flight bookings, user authentication, and flight management. Built with Express.js and MongoDB, it offers secure and scalable functionality for airline reservation systems.

## Core Features

### 1. User Management
- User registration and authentication
- Role-based access control (Admin/User)
- JWT-based authentication
- Secure password hashing

### 2. Flight Management
- Add/Delete flights (Admin only)
- Seat availability tracking

### 3. Booking System
- Secure booking creation
- Cancellation handling

## API Endpoints

### Authentication Routes
POST /auth/sign-up - Register new user <br>
POST /auth/login - User login <br>


### Flight Routes
POST /flights/add - Add new flight (Admin only)<br>
DELETE /flights/:flightNumber - Delete flight (Admin only)<br>


### Booking Routes
POST /bookings/create - Create new booking<br>
GET /bookings/:bookingId - Get booking details<br>
PUT /bookings/:bookingId/cancel - Cancel booking<br>


## Models

### User Model
- Username
- Email (unique)
- Phone (unique)
- Password (hashed)
- User Role (user/admin)
- Preferences
  - Currency
  - Preferred Airlines
  - Max Stops
  - Flight Duration Range

### Flight Model
- Flight Number (unique)
- Airline
- Departure/Arrival Cities
- Departure/Arrival Times
- Price
- Available Seats
- Number of Stops

### Booking Model
- User ID
- Flight ID
- Flight Number
- Passenger Details
  - First Name
  - Last Name
  - Date of Birth
  - Seat Number
- Booking Status
- Payment Status
- Total Amount

## Error Handling
The API implements comprehensive error handling with appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error


## Security Features
- JWT-based authentication
- Password hashing using bcrypt library
- Role-based access control
- Input validation and sanitization
- MongoDB injection protection

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the server: `npm run start`

## Error Codes Reference
| Code | Description |
|------|-------------|
| 400  | Invalid request parameters |
| 401  | Authentication failed |
| 403  | Insufficient permissions |
| 404  | Resource not found |
| 409  | Resource conflict |
| 500  | Server error |

# Assignment 10

# Flight Booking System

This repository contains the frontend code for a Flight Booking System built with React and TypeScript. 

The application allows users to:

1. Browse flights and bookings: Access a home page for general information.
2. User Authentication: Includes sign-up and login pages to manage user accounts securely.
3. Create Bookings: Provides a form to book flights.
4. Add Flights: Admin interface to add new flights to the system.

## Key Features:

1. React Router: Manages navigation with various routes such as  /sign-up, /login, /createBookings, and /add-flight.
2. State Management: To ensure seamless state handling across the application.
3. Toast Notifications: Integrated with react-toastify for user-friendly feedback.
4. TypeScript Integration: Ensures robust and type-safe development.
5. Vite: Utilized as a modern build tool for fast development and optimized builds.


    
