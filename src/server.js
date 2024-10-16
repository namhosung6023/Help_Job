const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Static files
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 폴더를 정적 파일로 제공

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Socket.io server listening on port 3000');
});
