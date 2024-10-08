const mongoose = require('mongoose'); // Mongoose 가져오기
const bcrypt = require("bcryptjs");

// 스키마 형태 구성
const PostSchema = new mongoose.Schema({
  name: String,
  id: String,
  password: String,
  email: String,
  phone: Number,
  role : {
    type : Number,
    default :0
  },
  resume: {
    title: String,
    main: String,
    state: String
  }
});

// 비밀번호 암호화 과정
PostSchema.pre('save',async function(next) {
  let user = this;
  if(user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password,salt);
      user.password = hash
  }
  next();
})

PostSchema.methods.comparePassword = async function (plainPassword) {
let user = this;
const match = await bcrypt.compare(plainPassword,user.password);
// true 혹은 false 반환 isMatch에
return match;
}
// 모델 생성 (posts 컬렉션에 저장)
const Post = mongoose.model('userModel', PostSchema);

const newPost = new Post({
  name: 'John Doe',
  id: 'john123',
  password: 'securePassword123',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  role: 1,  // 관리자
  resume: {
    title: 'Senior Developer',
    main: 'Experienced in Node.js and MongoDB.',
    state: 'Submitted'
  }
});

// 데이터 저장
newPost.save()
  .then(() => {
    console.log('User data saved successfully!');
  })
  .catch((err) => {
    console.error('Error saving user data:', err);
  });



module.exports = Post; // Post 모델을 모듈로 내보내기
