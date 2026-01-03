const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 필수 필드 검증
    if (!username || !email || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요' });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다' });
    }

    // 중복 체크
    const existingUser = await User.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ email }, { username }] 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다' });
    }

    // 사용자 생성 (비밀번호는 모델 훅에서 자동 해싱)
    const user = await User.create({ username, email, password });

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('회원가입 에러:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다',
        errors: error.errors.map(e => e.message)
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: '이미 사용 중인 이메일 또는 사용자명입니다' });
    }
    
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요' });
    }

    // 사용자 조회
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
    }

    // 비밀번호 검증
    const isValid = await user.validatePassword(password);
    
    if (!isValid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
