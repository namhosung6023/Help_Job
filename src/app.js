const mongoose = require('mongoose'); // Mongoose 모듈 가져오기
const express = require('express'); // Express 모듈 가져오기
const app = express(); // Express 앱 생성
const dotenv = require('dotenv');
const cors = require('cors');
const port = 3000
// nodemon다운 받았거든 앞으로 이거 실행할려면 npm run dev 치면 되고 다운 받은 이유는 실행되는 와중에 우리가 변경사항이 있으면 그것을 즉시 처리해주는 라이브러리임 
// MongoDB Atlas 연결 URL
const url = `mongodb+srv://namhosung:whfwkr2024@helpjob.kszot.mongodb.net/HelpJob?retryWrites=true&w=majority`;

// Express에서 JSON 요청 본문을 파싱하기 위해 미들웨어 추가
dotenv.config();
app.use(express.json());
app.use(cors());
// 모델 가져오기
const User = require('./models/UserModel'); // 회원 모델 가져오기
const Resume = require('./models/Resume'); // 이력서 모델 가져오기

// Mongoose로 MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(()=> {
    console.log('연결완료')
  })
  .catch(err => {
    console.error(err)
  })


// 기본 라우트 설정 (홈페이지 표시)
app.get('/', (req, res) => {
  res.send('MongoDB와 Express가 성공적으로 연결되었습니다.');
});
app.use((error,req,res,next)=> {
  res.status(error.status || 500);
  res.send(error.message || '서버에서 에러가 났습니다.');
})

app.listen(port, () => {
  console.log( port + '번에서 실행이 되었습니다.1111');
});

// 회원가입 및 로그인
app.use('/users',require('./routes/users'));

// 신고 
app.use('/declaration',require('./routes/declaration'));