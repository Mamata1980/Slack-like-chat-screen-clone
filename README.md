# Chat Clone (React + TypeScript frontend, Node.js backend, MongoDB)

## Prereqs
- Node.js (16+)
- npm or yarn
- MongoDB running locally or a hosted URI

## Setup

### 1. Server
cd server
cp .env.example .env
# edit .env to set MONGODB_URI
npm install
npm run dev   # or npm start

Server default: http://localhost:4000

### 2. Client
cd client
npm install
npm run dev

Client default: http://localhost:3000

Open the client in your browser. The client will connect to the server via Socket.IO and fetch persisted messages via REST.

## Notes
- The server saves messages to MongoDB.
- Socket.IO broadcasts incoming messages to all connected clients.
- The client is implemented in TypeScript using Vite and React.
- For production: build client (`npm run build`) and serve static files or host separately. Secure origins/CORS and authentication should be added for real deployments.

## Screenshot reference
Design reference you provided: `/mnt/data/Screenshot (1225).png`
