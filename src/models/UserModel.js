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

// 데이터 삽입 예시 (앱 실행 시 자동으로 데이터가 삽입됨)
Post.create({
  name: "남호성",
  id: "abcd",
  password: "1234",
  email: "hosung1234@naver.com",
  phone: "01062256023",
})
  .then(data => {
    console.log("Data inserted: ", data);
  })
  .catch(err => {
    console.log("Error inserting data: ", err);
  });

module.exports = Post; // Post 모델을 모듈로 내보내기
