const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
router.post('/register',async (req,res,next)=> {

  try{
    const user = new User(req.body)
    await user.save()
    return res.sendStatus(200);
  } catch (error) {
      next(error)
  }
})

router.post("/login",async (req,res,next)=> {
    //req.body password email
    try {
      //존재하는 유저인지 체크
      const user = await User.findOne({email : req.body.email});
      if(!user){
        return res.status(400).send("auth failed,email not found");
      }
      // 비밀번호가 올바른 것인치 체크
      const isMatch = await user.comparePassword(req.body.password);
      if(!isMatch) {
        return res.status(400).send('wrong password');
      }
      const payload = {
        //몽고디비에 아이디는 objectid로 되어있기 때문
        userId : user._id.toHexString()
      }
      //jwt 토큰 생성
      const accessToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '1h'})
      return res.json({user,accessToken})
    } catch(error){
      next();  
    }
}) 
//auth를 써서 미들웨어 등록
router.get('/auth', auth, async(req,res,next)=> {    
  return res.json({
        id: req.user._id,
        email:req.user.email,
        name: req.user.name,
        role : req.user.role,
    })

})

router.post('/logout', auth, async(req,res,next) => {
  try {
      return res.sendStatus(200);
  }catch(error){
      next(error)
  }
})

module.exports = router;