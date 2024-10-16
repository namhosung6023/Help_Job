const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');  // 채팅 모델 가져오기
const mongoose = require('mongoose'); // mongoose 가져오기

// 채팅 메시지 보내기
router.post('/send-message', async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    // 채팅 메시지 저장
    const newMessage = new Chat({
      sender: new mongoose.Types.ObjectId(senderId), // ObjectId로 변환
      receiver: new mongoose.Types.ObjectId(receiverId), // ObjectId로 변환
      message
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({ message: '메시지가 성공적으로 전송되었습니다.', chat: savedMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 특정 사용자의 채팅 내역 가져오기
router.get('/messages/:userId/:chatPartnerId', async (req, res) => {
  const { userId, chatPartnerId } = req.params;

  try {
    // 두 사용자 사이의 채팅 내역 가져오기
    const messages = await Chat.find({
      $or: [
        { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(chatPartnerId) },
        { sender: new mongoose.Types.ObjectId(chatPartnerId), receiver: new mongoose.Types.ObjectId(userId) }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
