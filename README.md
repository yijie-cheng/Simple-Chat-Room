# Simple Chat Room

This is a full-stack simple chat room application.

Modified from the homework of NTU EE 3035, Fall 2022.

Instructor: Chung-Yang Huang

## Requirements

## Install
1. Clone the repository: `git clone https://github.com/yijie-cheng/simple-chat-room.git simple-chat-room; cd simple-chat-room`

2. Ensure you have MongoDB installed. Copy your MongoDB connection string into the file `./backend/.env.defaults` and rename the file to `.env`.

3. Install dependencies for both the frontend and backend: `yarn build`

## Quick start
To run the Simple Chat Room application, follow these steps:

1. Start the backend server: `yarn server`

2. In a new terminal, start the frontend application: `yarn start`

These commands will set up both the frontend and backend parts of the application. The backend serves the API and handles interactions with the MongoDB database on http://localhost:4000, while the frontend provides the user interface at http://localhost:3000.
