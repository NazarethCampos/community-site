import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            찬양과 연주로 하나되는
            <span className="block text-primary-600 mt-2">기독교 기타 커뮤니티</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            기타를 사랑하는 크리스천들이 모여 연주 영상을 공유하고,
            장비를 소개하며, 서로의 신앙과 음악을 나누는 공간입니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {currentUser ? (
              <Link to="/create-post" className="btn-primary text-lg">
                지금 바로 시작하기
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-lg">
                  무료로 시작하기
                </Link>
                <Link to="/videos" className="btn-outline text-lg">
                  둘러보기
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          특별한 기능들
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Video Gallery */}
          <Link to="/videos" className="card p-8 hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">연주 영상</h3>
            <p className="text-gray-600 mb-4">
              찬양곡 연주, 커버 영상, 레슨 영상 등 
              다양한 기타 연주 영상을 공유하고 감상하세요.
            </p>
            <div className="text-primary-600 font-semibold flex items-center">
              더 알아보기 
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Equipment Gallery */}
          <Link to="/equipment" className="card p-8 hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🎸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">장비 갤러리</h3>
            <p className="text-gray-600 mb-4">
              소중한 기타, 이펙터, 앰프 등 
              여러분의 장비를 자랑하고 정보를 나누세요.
            </p>
            <div className="text-primary-600 font-semibold flex items-center">
              더 알아보기 
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Community */}
          <Link to="/community" className="card p-8 hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">커뮤니티</h3>
            <p className="text-gray-600 mb-4">
              신앙 이야기, 연주 팁, 기타 정보 등
              자유롭게 소통하고 교제하세요.
            </p>
            <div className="text-primary-600 font-semibold flex items-center">
              더 알아보기 
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">회원</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-primary-100">연주 영상</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">800+</div>
              <div className="text-primary-100">장비 리뷰</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-primary-100">커뮤니티 글</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            무료 회원가입하고 크리스천 기타리스트들과 함께하세요
          </p>
          {!currentUser && (
            <Link to="/signup" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              무료 회원가입
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
