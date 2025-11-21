require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const messagesRoute = require('./routes/messages');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/messages', messagesRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET','POST']
  }
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join', (username) => {
    socket.data.username = username;
    console.log(username, 'joined');
    // optionally broadcast join message
  });

  socket.on('send_message', async (payload) => {
    // payload: { username, text }
    try {
      const msg = new Message({
        username: payload.username,
        text: payload.text
      });
      await msg.save();
      io.emit('receive_message', msg); // broadcast saved message
    } catch (err) {
      console.error('save err', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-clone';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}).catch(err => {
  console.error('Mongo connect error', err);
});
