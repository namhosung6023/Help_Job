const mongoose = require('mongoose'); // Mongoose 모듈 가져오기
const express = require('express'); // Express 모듈 가져오기
const http = require('http'); // HTTP 모듈 가져오기
const socketIo = require('socket.io'); // Socket.io 모듈 가져오기
const dotenv = require('dotenv');
const cors = require('cors');
const chatRoutes = require('./routes/chat'); // chat.js 경로에 맞게 설정
const path = require('path');

dotenv.config();

const app = express(); // Express 앱 생성
const port = 3000;

// Static files
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

// MongoDB Atlas 연결 URL
const url = `mongodb+srv://namhosung:whfwkr2024@helpjob.kszot.mongodb.net/HelpJob?retryWrites=true&w=majority`;

// CORS 설정
app.use(cors());
app.use(express.json());

// Mongoose로 MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB에 성공적으로 연결되었습니다.');

    // 서버 시작
    const server = http.createServer(app); // HTTP 서버 생성
    const io = socketIo(server); // Socket.io 서버 생성

    // Socket.io 설정
    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data); // 모든 클라이언트에게 메시지 전송
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // 서버 실행
    server.listen(port, () => {
      console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    });
  })
  .catch(err => {
    console.error(err);
  });

// 기본 라우트 설정 (홈페이지 표시)
app.get('/', (req, res) => {
  res.send('MongoDB와 Express가 성공적으로 연결되었습니다.');
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message || '서버에서 에러가 났습니다.');
});

// 회원가입 및 로그인
app.use('/users', require('./routes/users'));

// 신고 
app.use('/declaration', require('./routes/declaration'));
app.use('/mypage', require('./routes/mypage'));

// 채팅 
app.use('/chat', chatRoutes); // chat.js 라우터를 '/chat'로 사용
