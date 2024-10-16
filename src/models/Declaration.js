const {default : mongoose, Schema }  = require('mongoose'); // Mongoose 가져오기
const User = require('../models/UserModel');

// 스키마 형태 구성
const declarationSchema = new mongoose.Schema({
  count : {
    type : Number
  },
  writer  : {
    type: Schema.Types.ObjectId,
    ref : 'UserModel'
  },
  name : {
    type : String
  },
  title : {
    type : String
  },
  detail : {
    type : String
  },
  continents : {
    type : Number,
    default : 1 
  },
  file : {
    type : Array,
    default : []
  }
});

const Declaration = mongoose.model('Declaration',declarationSchema)

module.exports = Declaration; // Post 모델을 모듈로 내보내기
