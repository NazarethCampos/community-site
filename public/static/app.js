// API 기본 URL
const API_BASE = '/api';

// 로컬 스토리지 키
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

// 현재 사용자 정보
let currentUser = null;
let currentPage = 'home';

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadUserFromStorage();
  initRouter();
  render();
});

// 로컬 스토리지에서 사용자 정보 로드
function loadUserFromStorage() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userInfo = localStorage.getItem(USER_KEY);
  
  if (token && userInfo) {
    currentUser = JSON.parse(userInfo);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// 라우터 초기화
function initRouter() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'home';
    const [page, id] = hash.split('/');
    currentPage = page;
    render(id);
  });
}

// 메인 렌더링 함수
async function render(id = null) {
  const app = document.getElementById('app');
  
  switch (currentPage) {
    case 'login':
      app.innerHTML = renderLogin();
      break;
    case 'signup':
      app.innerHTML = renderSignup();
      break;
    case 'post':
      if (id) {
        await renderPostDetail(id);
      } else {
        app.innerHTML = '<div class="text-center p-8">게시글을 찾을 수 없습니다</div>';
      }
      break;
    case 'create':
      if (!currentUser) {
        window.location.hash = 'login';
        return;
      }
      app.innerHTML = renderCreatePost();
      break;
    case 'home':
    default:
      await renderHome();
      break;
  }
}

// 네비게이션 바
function renderNav() {
  return `
    <nav class="bg-white shadow-md mb-6">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <a href="#home" class="text-2xl font-bold text-blue-600">
            <i class="fas fa-users"></i> 커뮤니티
          </a>
          <div class="flex space-x-4">
            <a href="#home" class="text-gray-700 hover:text-blue-600">전체</a>
            <a href="#home?category=갤러리" class="text-gray-700 hover:text-blue-600">갤러리</a>
            <a href="#home?category=영상" class="text-gray-700 hover:text-blue-600">영상</a>
            <a href="#home?category=신앙나눔" class="text-gray-700 hover:text-blue-600">신앙나눔</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          ${currentUser ? `
            <button onclick="navigateToCreate()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <i class="fas fa-plus"></i> 글쓰기
            </button>
            <span class="text-gray-700">${currentUser.username}님</span>
            <button onclick="logout()" class="text-gray-600 hover:text-red-600">
              <i class="fas fa-sign-out-alt"></i> 로그아웃
            </button>
          ` : `
            <a href="#login" class="text-gray-700 hover:text-blue-600">로그인</a>
            <a href="#signup" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">회원가입</a>
          `}
        </div>
      </div>
    </nav>
  `;
}

// 홈 페이지 렌더링
async function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = renderNav() + '<div class="max-w-7xl mx-auto px-4"><div class="text-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div></div>';
  
  try {
    const category = new URLSearchParams(window.location.hash.split('?')[1]).get('category');
    const url = category ? `${API_BASE}/posts?category=${category}` : `${API_BASE}/posts`;
    const response = await axios.get(url);
    const posts = response.data;
    
    const categoryTitle = category || '전체 게시글';
    
    app.innerHTML = renderNav() + `
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">${categoryTitle}</h1>
        ${posts.length === 0 ? '<p class="text-center text-gray-500 py-12">게시글이 없습니다</p>' : ''}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${posts.map(post => `
            <div class="card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onclick="navigateToPost(${post.id})">
              <img src="${post.image_url}" alt="${post.title}" class="w-full h-48 object-cover">
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${post.category}</span>
                  <span class="text-xs text-gray-500">${formatDate(post.created_at)}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${escapeHtml(post.title)}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${escapeHtml(post.description || '')}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span><i class="fas fa-user"></i> ${escapeHtml(post.author_name)}</span>
                  <span><i class="fas fa-heart text-red-500"></i> ${post.likes}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    console.error('게시글 로드 실패:', err);
    app.innerHTML = renderNav() + '<div class="max-w-7xl mx-auto px-4"><div class="text-center text-red-600 py-8">게시글을 불러오는데 실패했습니다</div></div>';
  }
}

// 게시글 상세 페이지
async function renderPostDetail(id) {
  const app = document.getElementById('app');
  app.innerHTML = renderNav() + '<div class="max-w-4xl mx-auto px-4"><div class="text-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div></div>';
  
  try {
    const response = await axios.get(`${API_BASE}/posts/${id}`);
    const post = response.data;
    
    app.innerHTML = renderNav() + `
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <img src="${post.image_url}" alt="${post.title}" class="w-full max-h-96 object-cover">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">${post.category}</span>
              <span class="text-sm text-gray-500">${formatDate(post.created_at)}</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-4">${escapeHtml(post.title)}</h1>
            <p class="text-gray-600 mb-6 whitespace-pre-wrap">${escapeHtml(post.description || '')}</p>
            <div class="flex items-center justify-between border-t pt-4">
              <span class="text-gray-700"><i class="fas fa-user"></i> ${escapeHtml(post.author_name)}</span>
              <button onclick="toggleLike(${post.id})" class="flex items-center space-x-2 px-4 py-2 rounded ${currentUser ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}">
                <i class="fas fa-heart text-red-500"></i>
                <span id="like-count-${post.id}">${post.likes}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">댓글 ${post.comments ? post.comments.length : 0}개</h2>
          
          ${currentUser ? `
            <div class="mb-6">
              <textarea id="comment-input" class="w-full border rounded p-3 mb-2" rows="3" placeholder="댓글을 입력하세요..."></textarea>
              <button onclick="addComment(${post.id})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">댓글 작성</button>
            </div>
          ` : '<p class="text-gray-500 mb-6">댓글을 작성하려면 로그인하세요</p>'}
          
          <div id="comments-list" class="space-y-4">
            ${post.comments && post.comments.length > 0 ? post.comments.map(comment => `
              <div class="border-l-4 border-blue-500 pl-4 py-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold text-gray-800">${escapeHtml(comment.user_name)}</span>
                  <span class="text-xs text-gray-500">${formatDate(comment.created_at)}</span>
                </div>
                <p class="text-gray-600">${escapeHtml(comment.content)}</p>
              </div>
            `).join('') : '<p class="text-gray-500">첫 댓글을 작성해보세요!</p>'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('게시글 로드 실패:', err);
    app.innerHTML = renderNav() + '<div class="max-w-4xl mx-auto px-4"><div class="text-center text-red-600 py-8">게시글을 불러오는데 실패했습니다</div></div>';
  }
}

// 로그인 페이지
function renderLogin() {
  return renderNav() + `
    <div class="max-w-md mx-auto px-4 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">로그인</h2>
        <form onsubmit="handleLogin(event)">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">이메일</label>
            <input type="email" id="login-email" class="w-full border rounded px-3 py-2" required>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">비밀번호</label>
            <input type="password" id="login-password" class="w-full border rounded px-3 py-2" required>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">로그인</button>
        </form>
        <p class="text-center text-gray-600 mt-4">
          계정이 없으신가요? <a href="#signup" class="text-blue-600 hover:underline">회원가입</a>
        </p>
        <div id="login-error" class="mt-4 text-red-600 text-center"></div>
      </div>
    </div>
  `;
}

// 회원가입 페이지
function renderSignup() {
  return renderNav() + `
    <div class="max-w-md mx-auto px-4 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">회원가입</h2>
        <form onsubmit="handleSignup(event)">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">사용자명</label>
            <input type="text" id="signup-username" class="w-full border rounded px-3 py-2" required minlength="3">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">이메일</label>
            <input type="email" id="signup-email" class="w-full border rounded px-3 py-2" required>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">비밀번호 (최소 6자)</label>
            <input type="password" id="signup-password" class="w-full border rounded px-3 py-2" required minlength="6">
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">가입하기</button>
        </form>
        <p class="text-center text-gray-600 mt-4">
          이미 계정이 있으신가요? <a href="#login" class="text-blue-600 hover:underline">로그인</a>
        </p>
        <div id="signup-error" class="mt-4 text-red-600 text-center"></div>
      </div>
    </div>
  `;
}

// 게시글 작성 페이지
function renderCreatePost() {
  return renderNav() + `
    <div class="max-w-2xl mx-auto px-4 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">새 게시글 작성</h2>
        <form onsubmit="handleCreatePost(event)">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">카테고리</label>
            <select id="post-category" class="w-full border rounded px-3 py-2">
              <option value="갤러리">갤러리</option>
              <option value="영상">영상</option>
              <option value="신앙나눔">신앙나눔</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">제목</label>
            <input type="text" id="post-title" class="w-full border rounded px-3 py-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">내용</label>
            <textarea id="post-description" class="w-full border rounded px-3 py-2" rows="5"></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">이미지 URL</label>
            <input type="url" id="post-image" class="w-full border rounded px-3 py-2" required placeholder="https://example.com/image.jpg">
          </div>
          <div class="flex space-x-4">
            <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">작성하기</button>
            <button type="button" onclick="window.location.hash='home'" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">취소</button>
          </div>
        </form>
        <div id="create-error" class="mt-4 text-red-600 text-center"></div>
      </div>
    </div>
  `;
}

// 로그인 처리
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentUser = user;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    window.location.hash = 'home';
  } catch (err) {
    errorDiv.textContent = err.response?.data?.message || '로그인 실패';
  }
}

// 회원가입 처리
async function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const errorDiv = document.getElementById('signup-error');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/signup`, { username, email, password });
    const { token, user } = response.data;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentUser = user;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    window.location.hash = 'home';
  } catch (err) {
    errorDiv.textContent = err.response?.data?.message || '회원가입 실패';
  }
}

// 게시글 작성 처리
async function handleCreatePost(e) {
  e.preventDefault();
  const title = document.getElementById('post-title').value;
  const description = document.getElementById('post-description').value;
  const imageUrl = document.getElementById('post-image').value;
  const category = document.getElementById('post-category').value;
  const errorDiv = document.getElementById('create-error');
  
  try {
    await axios.post(`${API_BASE}/posts`, { title, description, imageUrl, category });
    window.location.hash = 'home';
  } catch (err) {
    errorDiv.textContent = err.response?.data?.message || '게시글 작성 실패';
  }
}

// 좋아요 토글
async function toggleLike(postId) {
  if (!currentUser) {
    alert('로그인이 필요합니다');
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/like`);
    const countElement = document.getElementById(`like-count-${postId}`);
    if (countElement) {
      const currentCount = parseInt(countElement.textContent);
      countElement.textContent = response.data.liked ? currentCount + 1 : currentCount - 1;
    }
  } catch (err) {
    console.error('좋아요 실패:', err);
  }
}

// 댓글 추가
async function addComment(postId) {
  const input = document.getElementById('comment-input');
  const content = input.value.trim();
  
  if (!content) {
    alert('댓글 내용을 입력해주세요');
    return;
  }
  
  try {
    await axios.post(`${API_BASE}/posts/${postId}/comments`, { content });
    window.location.reload();
  } catch (err) {
    alert(err.response?.data?.message || '댓글 작성 실패');
  }
}

// 로그아웃
function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  currentUser = null;
  delete axios.defaults.headers.common['Authorization'];
  window.location.hash = 'home';
}

// 네비게이션 함수들
function navigateToPost(id) {
  window.location.hash = `post/${id}`;
}

function navigateToCreate() {
  window.location.hash = 'create';
}

// 유틸리티 함수들
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  return date.toLocaleDateString('ko-KR');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
