const mongoose = require('mongoose'); // Mongoose 모듈 가져오기
const express = require('express'); // Express 모듈 가져오기
const app = express(); // Express 앱 생성
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
app.use(express.json());
app.use(cors());
// 모델 가져오기
const User = require('./models/UserModel'); // 회원 모델 가져오기
const Resume = require('./models/Resume'); // 이력서 모델 가져오기

// Mongoose로 MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB에 성공적으로 연결되었습니다.');

    // 서버 실행
    app.listen(3000, () => {
      console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
    });
  })
  .catch(err => {
    console.log('MongoDB 연결 중 오류 발생:', err);
  });

// 기본 라우트 설정 (홈페이지 표시)
app.get('/', (req, res) => {
  res.send('MongoDB와 Express가 성공적으로 연결되었습니다.');
});


// 회원가입 및 로그인
app.use('/users',require('./routes/users'));
app.use('/mypage', require('./routes/mypage'));
