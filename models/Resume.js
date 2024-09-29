const mongoose = require('mongoose');

// 이력서 스키마 정의
const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true }, // 사용자와 연관된 ID
  name: String,
  phone: String,
  email: String,
  education: [
    {
      degree: String,
      institution: String,
      year: Number
    }
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  skills: [String],
  createdAt: { type: Date, default: Date.now } // 이력서 생성 날짜
});

// 모델 생성
const Resume = mongoose.model('Resume', ResumeSchema);


module.exports = Resume; // Resume 모델을 모듈로 내보내기
