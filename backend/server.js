const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const middleware = require('./middleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// Future: app.use('/api/docs', middleware, docsRoutes);

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinDoc', (docId) => {
    socket.join(docId);
  });

  socket.on('sendChanges', ({ docId, delta }) => {
    socket.to(docId).emit('receiveChanges', delta);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
