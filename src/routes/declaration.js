const express = require('express');
const router = express.Router();
const Declaration = require('../models/Declaration');
const auth = require('../middleware/auth')
const multer = require('multer')
const User = require('../models/UserModel');
const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null,'uploads/')
  },
  filename : function(req,file,cb){
    cb(null,'${Date.now()}_${file.originalname}')
  }
})
// const uploads = multer({storage : storage}).single(파일이름)
// router.post('/image',async (req,res,next)=> {
//     uploads(req,res,err => {
//       if(err){
//         return req.status(500).send(err)
//       }
//       return res.json({ fileName : res.req.file.filename })
//     })
// })

router.get('/declared/detail', async (req, res, next) => {
  try {
    // 쿼리 파라미터에서 writer의 ObjectId를 가져옴
    const writerId = req.query.writer;

    // writerId가 없으면 에러 응답
    if (!writerId) {
      return res.status(400).json({ message: "writer ObjectId is required." });
    }

    // writer 필드가 writerId인 Declaration 문서를 찾음
    const declarations = await Declaration.find({ writer: writerId });

    // 데이터가 없을 경우
    if (declarations.length === 0) {
      return res.status(404).json({ message: "No declarations found for this writer." });
    }

    return res.status(200).json({
      declarations
    });
  } catch (error) {
    next(error);
  }
});

// 전체 신고 내역 가져오기 (특정 필드만)
router.get('/declared', async (req, res, next) => {
  try {
    // 특정 필드만 조회 (writer, title, continents, count, detail)
    const declarations = await Declaration.find({}, 'writer title continents count detail');

    // 조회된 신고 내역을 클라이언트에 반환
    return res.status(200).json({
      declarations,
    });
  } catch (error) {
    next(error); // 에러가 발생하면 다음 미들웨어로 넘김
  }
});

module.exports = router; // 라우터 내보내기




router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body; // req.body에서 이름 가져오기

    // 이름으로 유저 찾기
    const user = await User.findOne({ name });

    if (user) {
      // 유저가 존재하면, 해당 유저의 신고 수를 1 증가시킴
      await User.updateOne({ _id: user._id }, { $inc: { reportCount: 1 } }); // reportCount가 유저의 신고 수를 나타낸다고 가정
    } else {
      // 유저가 존재하지 않으면 새 유저 생성 또는 적절한 처리
      return res.status(404).json({ message: 'User not found' });
    }

    // 새로운 신고 내역 생성
    const declare = new Declaration({
      ...req.body,
      count: await getNextCount() // 새로운 count 값 설정 (아래에 정의)
    });

    // 새로운 신고 내역 저장
    await declare.save();

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
async function getNextCount() {
  const latestDeclaration = await Declaration.findOne().sort({ count: -1 });
  return latestDeclaration ? latestDeclaration.count + 1 : 1; // 새로운 count 설정
}

module.exports = router