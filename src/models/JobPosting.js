const mongoose = require('mongoose');

// 공고 스키마 정의
const JobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',  // 공고를 작성한 회원 정보
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel' // 지원자의 ObjectID를 참조
  }]
});

// 모델 생성
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);

module.exports = JobPosting;
