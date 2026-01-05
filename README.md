# Christian Guitar Community | 기독교 기타 커뮤니티

React + Node.js + Firebase 기반의 기독교 기타 애호가들을 위한 특화 커뮤니티 플랫폼입니다.

## 🎸 프로젝트 소개

찬양과 연주로 하나님을 예배하는 기타 애호가들이 모여 서로의 재능을 나누고 격려하는 커뮤니티입니다.

### 주요 특화 기능

- **🎬 연주 영상 갤러리**: YouTube 영상 임베드 지원, 찬양곡/커버/레슨 카테고리
- **🎸 장비 갤러리**: 기타, 앰프, 이펙터, 악세서리 등 장비 자랑 및 정보 공유
- **💬 커뮤니티**: 신앙나눔, 자유게시판, 연주 팁 등 다양한 주제의 게시판

## 🚀 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **TailwindCSS** - 스타일링
- **Firebase SDK** - 인증 및 데이터베이스 클라이언트

### Backend
- **Node.js + Express** - REST API 서버
- **Firebase Admin SDK** - 서버사이드 Firebase 연동

### Database & Storage
- **Firebase Authentication** - 사용자 인증 (이메일/Google)
- **Cloud Firestore** - NoSQL 데이터베이스
- **Firebase Storage** - 이미지 저장소

## 📋 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Firebase 프로젝트 설정

## 🔧 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/NazarethCampos/community-site.git
cd community-site
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호, Google)
3. Cloud Firestore 데이터베이스 생성 (프로덕션 모드)
4. Firebase Storage 활성화
5. 웹 앱 추가 및 설정 정보 복사

### 4. 환경 변수 설정

`.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 파일에 Firebase 설정 입력:
```env
# Firebase Configuration (클라이언트)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (서버)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### 5. Firebase Admin SDK 설정

1. Firebase Console > 프로젝트 설정 > 서비스 계정
2. "새 비공개 키 생성" 클릭
3. 다운로드한 JSON 파일을 프로젝트 루트에 `serviceAccountKey.json`으로 저장

### 6. Firestore 보안 규칙 설정

Firebase Console > Firestore Database > 규칙:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null && 
          request.auth.uid == resource.data.userId;
      }
    }
  }
}
```

### 7. Storage 보안 규칙 설정

Firebase Console > Storage > 규칙:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024  // 5MB limit
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 8. 개발 서버 실행

```bash
# 클라이언트와 서버 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:client  # 클라이언트만 (http://localhost:5173)
npm run dev:server  # 서버만 (http://localhost:5000)
```

## 📁 프로젝트 구조

```
christian-guitar-community/
├── client/                 # React 프론트엔드
│   └── src/
│       ├── components/     # 재사용 컴포넌트
│       ├── pages/         # 페이지 컴포넌트
│       ├── contexts/      # React Context (Auth)
│       ├── services/      # Firebase 설정
│       ├── hooks/         # Custom Hooks
│       └── utils/         # 유틸리티 함수
├── server/                # Express 백엔드
│   ├── config/           # Firebase Admin 설정
│   ├── middleware/       # 인증 미들웨어
│   └── routes/           # API 라우트
├── index.html            # HTML 템플릿
├── vite.config.js        # Vite 설정
├── tailwind.config.js    # Tailwind 설정
└── package.json
```

## 🗄️ 데이터 구조

### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null,
  bio: string,
  favoriteGuitar: string,
  createdAt: timestamp,
  role: string
}
```

### Posts Collection
```javascript
{
  id: string,
  title: string,
  description: string,
  category: 'video' | 'equipment' | 'community',
  subcategory: string,
  
  // Video posts
  videoUrl?: string,
  
  // Equipment posts
  imageUrl?: string,
  brand?: string,
  model?: string,
  
  authorId: string,
  authorName: string,
  authorPhoto: string | null,
  
  likes: number,
  commentsCount: number,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Comments Subcollection (posts/{postId}/comments)
```javascript
{
  id: string,
  postId: string,
  userId: string,
  userName: string,
  userPhoto: string | null,
  content: string,
  createdAt: timestamp
}
```

## 🔌 API 엔드포인트

### Posts
- `GET /api/posts` - 게시글 목록 조회
- `GET /api/posts/:id` - 게시글 상세 조회
- `POST /api/posts` - 게시글 생성 (인증 필요)
- `PUT /api/posts/:id` - 게시글 수정 (인증 필요)
- `DELETE /api/posts/:id` - 게시글 삭제 (인증 필요)
- `POST /api/posts/:id/like` - 좋아요 토글 (인증 필요)
- `POST /api/posts/:id/comments` - 댓글 작성 (인증 필요)

### Users
- `GET /api/users/:uid` - 사용자 프로필 조회
- `PUT /api/users/:uid` - 사용자 프로필 수정 (인증 필요)
- `GET /api/users/:uid/posts` - 사용자 게시글 목록

## 🚀 배포

### Vercel 배포 (권장)

1. Vercel CLI 설치:
```bash
npm install -g vercel
```

2. 프로젝트 빌드:
```bash
npm run build
```

3. Vercel 배포:
```bash
vercel
```

4. 환경 변수 설정:
   - Vercel Dashboard에서 프로젝트 설정
   - Environment Variables에 `.env` 내용 추가

### Firebase Hosting 배포

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

## 📝 주요 기능

### 완료된 기능
- ✅ 사용자 인증 (이메일, Google)
- ✅ 연주 영상 갤러리 (YouTube 임베드)
- ✅ 장비 갤러리 (이미지 업로드)
- ✅ 커뮤니티 게시판
- ✅ 반응형 디자인
- ✅ 카테고리별 필터링

### 개발 예정
- ⏳ 게시글 상세 페이지 및 댓글 시스템
- ⏳ 좋아요 기능
- ⏳ 프로필 페이지
- ⏳ 이미지 업로드 (Firebase Storage)
- ⏳ 검색 기능
- ⏳ 페이지네이션
- ⏳ 실시간 알림

## 🤝 기여

Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👤 작성자

NazarethCampos

## 🙏 감사의 말

이 프로젝트는 하나님의 영광을 위해, 그리고 기타를 통해 찬양하는 모든 크리스천들을 위해 만들어졌습니다.

> "시편, 찬송, 신령한 노래들로 서로 화답하며 너희의 마음으로 주께 노래하며 찬송하며" - 에베소서 5:19
