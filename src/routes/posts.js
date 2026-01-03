const express = require('express');
const router = express.Router();
const { Post, Comment, PostLike, User } = require('../models');
const authenticate = require('../middleware/auth');
const { Op } = require('sequelize');

// 모든 게시글 조회
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const posts = await Post.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ]
    });

    res.json(posts);
  } catch (error) {
    console.error('게시글 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 상세 조회 (댓글 포함)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: 'comments',
          order: [['createdAt', 'ASC']],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    res.json(post);
  } catch (error) {
    console.error('게시글 상세 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 생성
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, imageUrl, category } = req.body;
    const userId = req.userId;

    // 필수 필드 검증
    if (!title || !imageUrl) {
      return res.status(400).json({ message: '제목과 이미지는 필수입니다' });
    }

    // 사용자 정보 조회
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // 게시글 생성
    const post = await Post.create({
      title,
      description: description || '',
      imageUrl,
      category: category || '갤러리',
      authorId: userId,
      authorName: user.username
    });

    res.status(201).json({
      message: '게시글이 생성되었습니다',
      post
    });
  } catch (error) {
    console.error('게시글 생성 에러:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 수정
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, category } = req.body;
    const userId = req.userId;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    // 작성자 확인
    if (post.authorId !== userId) {
      return res.status(403).json({ message: '수정 권한이 없습니다' });
    }

    // 게시글 수정
    await post.update({
      title: title || post.title,
      description: description !== undefined ? description : post.description,
      imageUrl: imageUrl || post.imageUrl,
      category: category || post.category
    });

    res.json({ 
      message: '게시글이 수정되었습니다',
      post 
    });
  } catch (error) {
    console.error('게시글 수정 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 삭제
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    // 작성자 확인
    if (post.authorId !== userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다' });
    }

    await post.destroy();

    res.json({ message: '게시글이 삭제되었습니다' });
  } catch (error) {
    console.error('게시글 삭제 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 좋아요 토글
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    // 좋아요 여부 확인
    const existingLike = await PostLike.findOne({
      where: { postId: id, userId }
    });

    if (existingLike) {
      // 좋아요 취소
      await existingLike.destroy();
      await post.decrement('likes');
      
      res.json({ 
        message: '좋아요가 취소되었습니다',
        liked: false
      });
    } else {
      // 좋아요 추가
      await PostLike.create({ postId: id, userId });
      await post.increment('likes');
      
      res.json({ 
        message: '좋아요가 추가되었습니다',
        liked: true
      });
    }
  } catch (error) {
    console.error('좋아요 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 댓글 추가
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요' });
    }

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    // 사용자 정보 조회
    const user = await User.findByPk(userId);

    // 댓글 생성
    const comment = await Comment.create({
      postId: id,
      userId,
      userName: user.username,
      content
    });

    res.status(201).json({
      message: '댓글이 추가되었습니다',
      comment
    });
  } catch (error) {
    console.error('댓글 추가 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
