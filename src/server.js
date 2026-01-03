require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../public')));

// API 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// 테스트 라우트
app.get('/api/test', (req, res) => {
  res.json({ message: '서버가 정상 작동합니다' });
});

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ message: '요청한 페이지를 찾을 수 없습니다' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  res.status(500).json({ 
    message: '서버 오류가 발생했습니다',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다`);
});

module.exports = app;
