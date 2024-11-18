const express = require('express');
const router = express.Router();
const userModel = require('../models/UserModel'); // 회원 스키마 가져오기
const JobPosting = require('../models/JobPosting');  // 공고 모델 가져오기
const auth = require('../middleware/auth')
const upload = require('../upload');  // upload.js 경로 확인
const mongoose = require('mongoose'); 



// 이력서 저장 API
router.post('/submit-resume', async (req, res) => {
  const { userId, title, skill, place, work } = req.body;

  try {
    // userId로 회원 찾기
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 이력서 정보 업데이트
    user.resume = { title, skill, place, work };
    
    const updatedUser = await user.save();
    res.status(200).json({ message: '이력서가 성공적으로 저장되었습니다.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 새 공고 생성 라우트
router.post('/jobposting',auth, async (req, res) => {
  try {
    const { title, content, location, salary } = req.body;

    // 새 공고 생성
    const newJobPosting = new JobPosting({
      title,
      content,
      location,
      salary,
      postedBy: req.user._id  // req.user에 로그인된 사용자 정보가 할당됨
    });

    // 공고 저장
    const savedJobPosting = await newJobPosting.save();
    res.status(201).json({ message: '공고가 성공적으로 저장되었습니다.', jobPosting: savedJobPosting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 모든 공고를 가져오는 API
router.get('/job-postings', async (req, res) => {
  try {
    // 모든 공고를 조회하고 작성자 정보도 함께 가져옴
    const jobPostings = await JobPosting.find().populate('postedBy', 'name id');

    res.status(200).json(jobPostings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// 특정 공고의 상세 내용을 가져오는 API
  router.get('/job-postings/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
      // jobId로 특정 공고를 조회
      const jobPosting = await JobPosting.findById(jobId).populate('postedBy', 'name id');

      // 공고가 존재하지 않을 경우 처리
      if (!jobPosting) {
        return res.status(404).json({ message: '해당 공고를 찾을 수 없습니다.' });
      }

      // 공고 내용 반환
      res.status(200).json(jobPosting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// 모든 회원 이력서 조회 api 
router.get('/resumes', async (req, res) => {
  try {
    // 모든 회원을 조회
    const users = await userModel.find({}, 'name id resume'); // name, id, resume만 선택적으로 조회

    // 이력서 정보만 필터링하여 배열로 반환
    const resumes = users.map(user => ({
      userId: user.id,
      name: user.name,
      resume: user.resume
    }));

    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 특정 회원의 이력서 정보를 가져오는 API
router.get('/resume', async (req, res) => {
  const userId = req.query.userId;
  console.log("이력서",userId)
  try {
    // userId를 ObjectId로 변환
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: '유효하지 않은 userId입니다.' });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }

    if (!user.resume) {
      return res.status(404).json({ message: '이 사용자의 이력서가 존재하지 않습니다.' });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      resume: user.resume
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 사용자의 공고 목록을 가져오는 API
router.get('/job-posts', async (req, res) => {
  const userId = req.query.userId; // 사용자 ID를 쿼리 파라미터로 받음
  console.log("공고",userId)
  try {
    // postedBy 필드가 userId와 일치하는 공고를 가져옴
    const jobPosts = await JobPosting.find({ postedBy: userId });
    res.status(200).json(jobPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 모든 회원 정보를 가져오는 API
router.get('/all-users', async (req, res) => {
  try {
    // 모든 회원 정보를 조회
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//지원자 가지고오기 
router.get('/job/applicants', async (req, res) => {
  const { _id } = req.query; // jobId를 쿼리 파라미터로 받음

  // jobId가 없는 경우 에러 반환
  if (!_id) {
    return res.status(400).json({ error: 'jobId 쿼리 파라미터가 누락되었습니다.' });
  }

  try {
    // 해당 공고와 지원자 정보를 조회
    const jobPosting = await JobPosting.findById(_id).populate('applicants', 'name'); // 필요한 필드만 선택 가능

    if (!jobPosting) {
      return res.status(404).json({ error: '해당 공고를 찾을 수 없습니다.' });
    }

    // 지원자 목록 반환
    res.status(200).json({ applicants: jobPosting.applicants });
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ error: err.message });
  }
});

//지원자 지원하기 
router.post('/apply', async (req, res) => {
  const { _id, userId } = req.body; // jobId와 지원자의 userId를 요청에서 받음

  try {
    // 해당 공고를 찾고 applicants 배열에 userId 추가
    const jobPosting = await JobPosting.findByIdAndUpdate(
      _id,
      { $addToSet: { applicants: userId } }, // 중복 추가 방지를 위해 addToSet 사용
      { new: true } // 업데이트된 문서를 반환
    );

    if (!jobPosting) {
      return res.status(404).json({ error: '해당 공고를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '지원이 완료되었습니다.', jobPosting });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/user-info', auth, (req, res) => {
  try {
    // auth 미들웨어에서 설정한 req.user 사용
    const userInfo = {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      id: req.user._id
      // 필요한 사용자 정보 추가
    };

    res.status(200).json(userInfo); // 사용자 정보 응답
  } catch (error) {
    console.error('사용자 정보 반환 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
