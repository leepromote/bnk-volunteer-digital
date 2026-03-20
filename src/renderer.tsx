import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | BNK 재능기부봉사단 디지털IT` : 'BNK 재능기부봉사단 디지털IT'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <style>{`
          * { font-family: 'Noto Sans KR', sans-serif; }
          .bnk-gradient { background: linear-gradient(135deg, #003d82 0%, #0066cc 50%, #0099ff 100%); }
          .bnk-orange { color: #ff6600; }
          .bnk-blue { color: #003d82; }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,61,130,0.15); }
          .nav-link { position: relative; }
          .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; background: #ff6600; bottom: -2px; left: 0; transition: width 0.3s ease; }
          .nav-link:hover::after { width: 100%; }
          .hero-text { text-shadow: 0 2px 20px rgba(0,0,0,0.3); }
          .section-title { position: relative; display: inline-block; }
          .section-title::after { content: ''; position: absolute; width: 60px; height: 4px; background: linear-gradient(90deg, #003d82, #ff6600); bottom: -12px; left: 0; border-radius: 2px; }
          .activity-badge { background: linear-gradient(135deg, #003d82, #0066cc); }
          .footer-bg { background: linear-gradient(135deg, #001a40 0%, #003d82 100%); }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in-up { animation: fadeInUp 0.8s ease forwards; }
          .delay-1 { animation-delay: 0.2s; opacity: 0; }
          .delay-2 { animation-delay: 0.4s; opacity: 0; }
          .delay-3 { animation-delay: 0.6s; opacity: 0; }
          .stat-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
          .blog-card:hover .blog-img { transform: scale(1.05); }
          .blog-img { transition: transform 0.4s ease; }
          .mobile-menu { display: none; }
          @media (max-width: 768px) { .desktop-menu { display: none; } .mobile-menu { display: block; } }
        `}</style>
      </head>
      <body class="bg-gray-50">
        {/* Navigation */}
        <nav class="bg-white shadow-md sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex justify-between items-center h-16">
              {/* Logo */}
              <a href="/" class="flex items-center space-x-3">
                <div class="w-10 h-10 bnk-gradient rounded-lg flex items-center justify-center">
                  <i class="fas fa-laptop-code text-white text-lg"></i>
                </div>
                <div>
                  <div class="text-sm font-bold text-blue-900 leading-tight">BNK 재능기부봉사단</div>
                  <div class="text-xs text-orange-500 font-semibold">디지털 IT팀</div>
                </div>
              </a>

              {/* Desktop Menu */}
              <div class="desktop-menu hidden md:flex items-center space-x-8">
                <a href="/" class="nav-link text-gray-700 hover:text-blue-900 font-medium text-sm transition-colors">홈</a>
                <a href="/about" class="nav-link text-gray-700 hover:text-blue-900 font-medium text-sm transition-colors">소개</a>
                <a href="/activities" class="nav-link text-gray-700 hover:text-blue-900 font-medium text-sm transition-colors">활동내역</a>
                <a href="/blog" class="nav-link text-gray-700 hover:text-blue-900 font-medium text-sm transition-colors">블로그</a>
                <a href="/gallery" class="nav-link text-gray-700 hover:text-blue-900 font-medium text-sm transition-colors">갤러리</a>
                <a href="/team" class="nav-link text-gray-700 hover:text-blue-900 font-medium text-sm transition-colors">팀 소개</a>
                <a href="/contact" class="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                  <i class="fas fa-envelope mr-1"></i> 문의하기
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button onclick="document.getElementById('mobileMenu').classList.toggle('hidden')" class="md:hidden text-gray-600 hover:text-blue-900">
                <i class="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div id="mobileMenu" class="hidden md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3">
            <a href="/" class="block text-gray-700 hover:text-blue-900 font-medium py-1">홈</a>
            <a href="/about" class="block text-gray-700 hover:text-blue-900 font-medium py-1">소개</a>
            <a href="/activities" class="block text-gray-700 hover:text-blue-900 font-medium py-1">활동내역</a>
            <a href="/blog" class="block text-gray-700 hover:text-blue-900 font-medium py-1">블로그</a>
            <a href="/gallery" class="block text-gray-700 hover:text-blue-900 font-medium py-1">갤러리</a>
            <a href="/team" class="block text-gray-700 hover:text-blue-900 font-medium py-1">팀 소개</a>
            <a href="/contact" class="block text-blue-900 font-medium py-1">문의하기</a>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer class="footer-bg text-white mt-20">
          <div class="max-w-7xl mx-auto px-6 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div class="col-span-1 md:col-span-2">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-laptop-code text-white text-lg"></i>
                  </div>
                  <div>
                    <div class="font-bold text-white">BNK 재능기부봉사단</div>
                    <div class="text-orange-400 text-sm font-semibold">디지털 IT팀</div>
                  </div>
                </div>
                <p class="text-blue-200 text-sm leading-relaxed mb-4">
                  BNK부산은행 임직원이 디지털·IT 전문 역량으로 지역사회 취약계층에게<br />
                  실질적인 도움을 드리는 재능기부봉사단입니다.
                </p>
                <div class="flex space-x-3">
                  <a href="#" class="w-9 h-9 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all">
                    <i class="fab fa-instagram text-sm"></i>
                  </a>
                  <a href="#" class="w-9 h-9 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all">
                    <i class="fab fa-youtube text-sm"></i>
                  </a>
                  <a href="#" class="w-9 h-9 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all">
                    <i class="fab fa-facebook text-sm"></i>
                  </a>
                </div>
              </div>
              <div>
                <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">바로가기</h4>
                <ul class="space-y-2 text-blue-200 text-sm">
                  <li><a href="/about" class="hover:text-white transition-colors">봉사단 소개</a></li>
                  <li><a href="/activities" class="hover:text-white transition-colors">활동 내역</a></li>
                  <li><a href="/blog" class="hover:text-white transition-colors">블로그</a></li>
                  <li><a href="/gallery" class="hover:text-white transition-colors">갤러리</a></li>
                  <li><a href="/team" class="hover:text-white transition-colors">팀 소개</a></li>
                </ul>
              </div>
              <div>
                <h4 class="font-bold text-white mb-4 text-sm uppercase tracking-wider">연락처</h4>
                <ul class="space-y-2 text-blue-200 text-sm">
                  <li class="flex items-center"><i class="fas fa-map-marker-alt w-5 text-orange-400"></i> 부산광역시 부산진구</li>
                  <li class="flex items-center"><i class="fas fa-envelope w-5 text-orange-400"></i> digital.it@bnkfs.com</li>
                  <li class="flex items-center"><i class="fas fa-globe w-5 text-orange-400"></i> www.bnkbusan.com</li>
                </ul>
              </div>
            </div>
            <div class="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p class="text-blue-300 text-xs">© 2024 BNK부산은행 재능기부봉사단 디지털IT팀. All rights reserved.</p>
              <p class="text-blue-300 text-xs mt-2 md:mt-0">함께 나누는 디지털 세상 💙</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})
