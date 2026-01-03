# 커뮤니티 사이트 (Community Site)

Express.js + PostgreSQL + Railway를 사용한 커뮤니티 웹 애플리케이션

## 🌐 URLs

- **GitHub**: https://github.com/NazarethCampos/community-site
- **프로덕션** (배포 예정): `https://your-app.up.railway.app`

## ✨ 주요 기능

### 완료된 기능
- ✅ 사용자 인증 (회원가입, 로그인) - JWT 기반
- ✅ 게시글 CRUD (생성, 조회, 수정, 삭제)
- ✅ 카테고리별 게시판 (갤러리, 영상, 신앙나눔)
- ✅ 좋아요 기능 (토글)
- ✅ 댓글 시스템
- ✅ 반응형 UI (TailwindCSS)
- ✅ 보안 강화 (bcrypt 비밀번호 해싱, JWT 인증)
- ✅ PostgreSQL 관계형 데이터베이스
- ✅ Sequelize ORM

### 아직 구현되지 않은 기능
- ⏳ 이미지 직접 업로드
- ⏳ 게시글 검색 기능
- ⏳ 페이지네이션
- ⏳ 사용자 프로필 페이지
- ⏳ 댓글 수정/삭제
- ⏳ 게시글 조회수

## 🏗️ 기술 스택

### 백엔드
- **Node.js** (v20+)
- **Express.js** (v5) - 웹 프레임워크
- **PostgreSQL** (v16) - 관계형 데이터베이스
- **Sequelize** (v6) - ORM
- **JWT** - 인증
- **bcryptjs** - 비밀번호 해싱

### 프론트엔드
- **Vanilla JavaScript** - ES6+
- **TailwindCSS** - 스타일링
- **Axios** - HTTP 클라이언트
- **Font Awesome** - 아이콘

### 배포
- **Railway** - 호스팅 및 PostgreSQL
- **PM2** - 프로세스 관리 (로컬)

## 📊 데이터베이스 스키마

### Users (사용자)
- `id` - PRIMARY KEY
- `username` - UNIQUE, NOT NULL
- `email` - UNIQUE, NOT NULL
- `password` - NOT NULL (bcrypt 해싱)
- `createdAt`, `updatedAt`

### Posts (게시글)
- `id` - PRIMARY KEY
- `title` - NOT NULL
- `description` - TEXT
- `imageUrl` - NOT NULL
- `category` - NOT NULL (갤러리/영상/신앙나눔)
- `authorId` - FOREIGN KEY → Users
- `authorName` - NOT NULL
- `likes` - INTEGER, DEFAULT 0
- `createdAt`, `updatedAt`

### Comments (댓글)
- `id` - PRIMARY KEY
- `postId` - FOREIGN KEY → Posts
- `userId` - FOREIGN KEY → Users
- `userName` - NOT NULL
- `content` - TEXT, NOT NULL
- `createdAt`, `updatedAt`

### PostLikes (좋아요)
- `id` - PRIMARY KEY
- `postId` - FOREIGN KEY → Posts
- `userId` - FOREIGN KEY → Users
- `createdAt`, `updatedAt`
- UNIQUE(postId, userId) - 중복 좋아요 방지

## 🔌 API 엔드포인트

### 인증 (Authentication)
```
POST /api/auth/signup
Body: { username, email, password }
Response: { token, user }

POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### 게시글 (Posts)
```
GET /api/posts
Query: ?category=갤러리|영상|신앙나눔
Response: [posts]

GET /api/posts/:id
Response: { post with comments }

POST /api/posts (인증 필요)
Headers: Authorization: Bearer <token>
Body: { title, description, imageUrl, category }
Response: { post }

PUT /api/posts/:id (작성자만)
Headers: Authorization: Bearer <token>
Body: { title, description, imageUrl, category }
Response: { post }

DELETE /api/posts/:id (작성자만)
Headers: Authorization: Bearer <token>
Response: { message }

POST /api/posts/:id/like (인증 필요)
Headers: Authorization: Bearer <token>
Response: { liked: boolean }

POST /api/posts/:id/comments (인증 필요)
Headers: Authorization: Bearer <token>
Body: { content }
Response: { comment }
```

## 🚀 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/NazarethCampos/community-site.git
cd community-site
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env` 파일 생성:
```env
NODE_ENV=development
PORT=5000

JWT_SECRET=your-super-secret-jwt-key

# PostgreSQL (로컬)
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=community_dev
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. PostgreSQL 설정
```bash
# PostgreSQL 설치 또는 Docker 사용
docker run --name postgres-community \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=community_dev \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 5. 데이터베이스 마이그레이션
```bash
npm run db:migrate
```

### 6. 서버 시작
```bash
# 개발 모드 (nodemon)
npm run dev

# 프로덕션 모드
npm start

# PM2 사용
pm2 start ecosystem.config.cjs
```

## 📦 Railway 배포 가이드

### 1. Railway CLI 설치
```bash
npm install -g @railway/cli
```

### 2. Railway 로그인
```bash
railway login
```

### 3. 프로젝트 초기화
```bash
railway init
```

### 4. PostgreSQL 추가
Railway 대시보드에서:
1. "New" → "Database" → "PostgreSQL" 선택
2. 자동으로 `DATABASE_URL` 환경변수 생성됨

### 5. 환경변수 설정
Railway 대시보드에서:
- `JWT_SECRET`: 랜덤 문자열 (보안 키)
- `NODE_ENV`: `production`
- `DATABASE_URL`: (자동 설정됨)

### 6. 배포
```bash
# GitHub 연동 자동 배포 (권장)
railway up

# 또는 Git push
git push railway main
```

### 7. 데이터베이스 마이그레이션 (최초 1회)
```bash
railway run npm run db:migrate
```

## 📱 사용자 가이드

### 1. 회원가입 및 로그인
- 우측 상단 "회원가입" 버튼 클릭
- 사용자명, 이메일, 비밀번호(6자 이상) 입력
- 로그인 후 모든 기능 사용 가능

### 2. 게시글 작성
- 로그인 후 "글쓰기" 버튼 클릭
- 카테고리, 제목, 내용, 이미지 URL 입력
- 작성 완료 후 자동으로 게시판에 표시

### 3. 게시글 보기
- 메인 화면에서 카테고리 선택
- 게시글 카드 클릭하여 상세 페이지 이동
- 좋아요 및 댓글 작성 가능

### 4. 상호작용
- ❤️ 좋아요: 하트 아이콘 클릭 (토글)
- 💬 댓글: 댓글 입력창에 내용 작성 후 "댓글 작성" 클릭

## 📂 프로젝트 구조

```
community-site/
├── src/
│   ├── server.js           # Express 서버 엔트리포인트
│   ├── config/
│   │   └── database.json   # Sequelize 데이터베이스 설정
│   ├── models/             # Sequelize 모델
│   │   ├── user.js
│   │   ├── post.js
│   │   ├── comment.js
│   │   └── postlike.js
│   ├── routes/             # API 라우트
│   │   ├── auth.js         # 인증 API
│   │   └── posts.js        # 게시글 API
│   ├── middleware/
│   │   └── auth.js         # JWT 인증 미들웨어
│   ├── migrations/         # 데이터베이스 마이그레이션
│   └── seeders/            # 시드 데이터
├── public/
│   ├── index.html          # 메인 HTML
│   └── static/
│       └── app.js          # 프론트엔드 JavaScript
├── .env                    # 환경변수 (gitignore)
├── .sequelizerc            # Sequelize CLI 설정
├── ecosystem.config.cjs    # PM2 설정
├── railway.json            # Railway 배포 설정
├── Procfile                # Railway 프로세스 정의
└── package.json
```

## 🔧 다음 개발 단계

### 우선순위 높음
1. ✅ Railway 프로덕션 배포
2. 이미지 업로드 기능 (Cloudinary/AWS S3)
3. 검색 기능 (제목/내용/작성자)
4. 페이지네이션 (무한 스크롤)

### 우선순위 중간
5. 사용자 프로필 페이지
6. 댓글 수정/삭제 기능
7. 게시글 조회수 트래킹
8. 알림 시스템

### 우선순위 낮음
9. 다크 모드
10. 소셜 공유 기능
11. 관리자 대시보드

## 📝 최근 업데이트

- **2026-01-03**: Express + PostgreSQL 마이그레이션 완료
  - Hono + D1 → Express + PostgreSQL
  - Sequelize ORM 도입
  - bcrypt 비밀번호 해싱
  - Railway 배포 준비 완료
  - 모든 API 기능 구현

## 🐛 문제 해결

### PostgreSQL 연결 오류
```bash
# PostgreSQL 서비스 확인
service postgresql status

# 포트 확인
netstat -an | grep 5432
```

### 마이그레이션 오류
```bash
# 마이그레이션 롤백 후 재실행
npm run db:reset
```

### Railway 배포 오류
```bash
# 로그 확인
railway logs

# 환경변수 확인
railway variables
```

## 📄 라이선스

MIT License

## 👤 작성자

NazarethCampos

## 🤝 기여

Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
