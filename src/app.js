const mongoose = require('mongoose'); // Mongoose 모듈 가져오기
const express = require('express'); // Express 모듈 가져오기
const app = express(); // Express 앱 생성
const dotenv = require('dotenv');
const cors = require('cors');
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
mongoose.connect(process.env.MONGI_URI)
  .then(async () => {
    console.log('MongoDB에 성공적으로 연결되었습니다.');

    // 자동 이력서 데이터 삽입
    const sampleResume = new Resume({
      userId: "5f8d0c1c6d4f5b2c54f9a6e8", // 실제 회원 ID로 변경
      name: "남호성",
      phone: "01062256023",
      email: "hosung1234@naver.com",
      education: [
        {
          degree: "Bachelor of Engineering",
          institution: "ABC University",
          year: 2020
        }
      ],
      experience: [
        {
          jobTitle: "Software Engineer Intern",
          company: "XYZ Corp",
          startDate: new Date("2021-06-01"),
          endDate: new Date("2021-08-31"),
          description: "Worked on developing features for the company's web application."
        }
      ],
      skills: ["JavaScript", "Node.js", "MongoDB"]
    });

    try {
      const savedResume = await sampleResume.save();
      console.log("Sample resume data inserted: ", savedResume);
    } catch (err) {
      console.log("Error inserting sample resume data: ", err);
    }

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

// 회원 가입 API (예시)
app.post('/register', async (req, res) => {
  const { name, id, password, email, phone } = req.body;
  const newUser = new User({ name, id, password, email, phone });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 회원가입 및 로그인
app.use('/users',require('./routes/users'));
// 이력서 저장 API
app.post('/submit-resume', async (req, res) => {
  const { userId, name, phone, email, education, experience, skills } = req.body;

  try {
    const newResume = new Resume({
      userId,
      name,
      phone,
      email,
      education,
      experience,
      skills
    });

    const savedResume = await newResume.save();
    res.status(201).json({ message: '이력서가 성공적으로 저장되었습니다.', resume: savedResume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
