## Introduction
This is a Affiliate Referral MVP Project made with Typescript, Express, Node.js, Next.js (for UI) and Mongo DB.
Via this MVP, We can generate a referral link. This referral link can be used to sign up on our project. If a user signs up with our referral link,
then the Referrer would gain a successful signup. If the user also successfully completes onboarding then our referrer would get $10 for the conversion. 

For the authentication I have used JWT based system and the token is stored via HTTP only secure cookies. The token by default is valid for 14 days.
This project does not use the traditional password based logins but utilizes an OTP based email system. Whenever a user tries to login or sign up, an OTP is sent to their email with which they can successfully authenticate.

The email service for the OTPs is Resend.com so please make sure to get an API key from them.

Once the user signs up, They have to complete onboarding. The system does not allow the user to bypass the onboarding so they must complete it to access the dashboard. On the dashboard the user can see relevant stats of their referral link such as:
- Number of Clicks
- Signups
- Conversions
- Earnings

Overall, this was a great learning project for me to better understand full stack development (especially developing our own backend). 

## Tech Stack
- Frontend: Next.js, Shadcn, React, Tailwind CSS
- Backend: Express
- Database: MongoDB
- Authentication: JWT

## Requirements
- Node.js v18+
- MongoDB database
- Resend API

## Getting Started
1. **Clone the repository:**

   ```bash
   git clone https://github.com/Daniel-1647/Referr.git
   cd Referr
   ```

2. **Install node dependencies:**

   ```bash
   cd frontend
   npm install
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   First create a .env file in the frontend and backend folder each. 
   For the frontend we have one environment variable which is:
   ```bash
   NEXT_PUBLIC_API_BASE_URL #This should be set to the URL of our Express server.
   ```

   For the backend we have the following environment variables:
   ```bash
   MONGO_URI #This is the connection string from our Mongo DB server.
   RESEND_API_KEY #The API Key of Resend mail service.
   PORT #Port on which we would like to host our server
   JWT_SECRET #JWT Secret key for authentication
   WEBSITE_URL #This URL corresponds to the URL where our frontend is hosted. Important to prevent CORS related errors.
   BACKEND_URL #URL where we will host our backend on.
   SYSTEM_EMAIL_ADDRESS #The email address which we will use to send our OTPs.

4. **Run the server and frontend**

    In both frontend and backend directories run this:
    ```bash
    npm run dev
    ```
5. **Check your browser**

    On your browser, You will find the frontend at http://localhost:3000 and the backend would be hosted at the port which you defined in the .env

## Credit
   1. **v0.dev** - For the frontend generation.
   2. **Resend.com** - For the email sender API.