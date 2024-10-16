const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },  // 발신자 ID
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },  // 수신자 ID
  message: { type: String, required: true },  // 메시지 내용
  timestamp: { type: Date, default: Date.now }  // 전송 시간
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
