const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const app = express();

// 서버 설정
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // 메시지 받기
  socket.on('sendMessage', (data) => {
    // 받은 메시지를 모든 클라이언트에게 전달
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 서버 시작
server.listen(3000, () => {
  console.log('Socket.io server listening on port 3000');
});
