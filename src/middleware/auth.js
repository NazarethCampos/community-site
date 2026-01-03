const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: '인증이 필요합니다' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다' });
    }
    return res.status(500).json({ message: '인증 처리 중 오류가 발생했습니다' });
  }
};

module.exports = authenticate;
