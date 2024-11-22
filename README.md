
# Dhanapatha

Dhanapatha is a robust money transfer application designed for seamless financial transactions. It offers a user-friendly interface for managing personal wallets and direct money transfers while ensuring security and reliability through advanced features.


## DEMO LINK

LIVE =>
https://dhanapatha.surajsingh.online

SOURCE FRONTEND CODE => https://github.com/surajsinghgore/Dhanapatha-client.git

SOURCE BACKEND CODE => https://github.com/surajsinghgore/Dhanapatha-backend
## Screenshots

![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1732265669/socket.io/dhanapatha/ho9noqgfrqmfpbvxydhp.png)

![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1732265671/socket.io/dhanapatha/sdml6wrqmjgm1caztnd0.png)

![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1732265669/socket.io/dhanapatha/zu3pjxj3ulybjzu3bgb5.png)
![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1732265668/socket.io/dhanapatha/sjzmqtbhxhrb3xrq6yva.png)
![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1732265669/socket.io/dhanapatha/fdwxtgsladen0qaejuav.png)
### User Features:  
1. **Gmail-Based Registration**  
   - Simplified onboarding with Gmail authentication for enhanced security and convenience.  

2. **Direct Money Transfers**  
   - Easy and quick transfers to other users or linked bank accounts.  

3. **Wallet Management**  
   - Add funds, check wallet balance, and manage transactions efficiently.  

4. **Withdrawals**  
   - Hassle-free withdrawal of funds from the wallet to bank accounts.  

5. **Transaction History**  
   - View detailed logs of all financial activities for better tracking.  

6. **Refund Policy**  
   - Supports refund processing for failed or incorrect transactions.  

7. **Test Mode**  
   - Sandbox environment for testing transactions before going live.  

8. **Stripe Integration**  
   - Secure payment processing for deposits and transfers using Stripe.  

---

### Security Features:  
1. **Encrypted Transactions**  
   - Ensures all payments and transfers are secured with robust encryption.  

2. **User Authentication**  
   - Gmail-based verification to prevent unauthorized access.  

---

### Additional Features:  
- Intuitive and user-friendly interface.  
- Real-time updates for wallet balances and transaction statuses.  
- Scalable backend to handle growing user demand efficiently.  

**Dhanapatha** simplifies money transfers while prioritizing security, user satisfaction, and reliability.
## Authors

- [@surajsingh](https://github.com/surajsinghgore)

## Authors

- [@surajsingh](https://github.com/surajsinghgore)


## Tech Stack  

**Dhanapatha** is built with the following technologies:  

### Frontend:  
- **React.js**: For building a responsive and user-friendly interface.  
- **Redux**: State management for seamless application behavior.  
- **CSS/SCSS**: Styling for an intuitive and visually appealing design.  

### Backend:  
- **Node.js**: Server-side JavaScript runtime.  
- **Express.js**: Framework for creating APIs and handling backend functionality.  
- **MongoDB**: Database for storing user data, transactions, and wallet information.  

### Payment Integration:  
- **Stripe**: Secure and reliable payment gateway for managing transactions.  

### Authentication & Security:  
- **JSON Web Tokens (JWT)**: Token-based authentication for secure user sessions.  
- **BCrypt**: Password hashing to enhance security.  

### Hosting & Deployment:  
- **VERCEL**: For frontend hosting.  
- **VERCEL**: For backend server hosting.  

## Installation  

Follow these steps to set up and run the **Dhanapatha** project locally:  

### Prerequisites  
1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).  
2. Install [MongoDB](https://www.mongodb.com/) and ensure it is running.  

---
### Backend Environment Variables  
### Clone the Repository  

1. Clone the repository:  
   ```bash
   git clonehttps://github.com/surajsinghgore/Dhanapatha-backend.git

   cd Dhanapatha-backend


### Environment Variables  

Create a `.env` file in the root directory of the backend and configure the following environment variables:  

| Variable Name         | Description                              |
|-----------------------|------------------------------------------|
| `MONGODB_URI`         | Your MongoDB connection string.         |
| `STRIPE_PUBLISH_KEY`  | Stripe publishable key for payments.    |
| `STRIPE_SECRET_KEY`   | Stripe secret key for secure transactions. |
| `JWT_SECRET`          | Secret key for generating JWT tokens.   |

> **Note:** Replace the placeholder values with your actual credentials. Ensure the `.env` file is included in `.gitignore` to prevent sensitive data from being exposed.

3.npm i 

4.node index.js



### FRONTEND 

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend


  2. Navigate to the frontend directory:
   ```bash
  REACT_APP_API_URL=your_backend_url  
FRONTEND_URL_MAIN=your_frontend_url  
