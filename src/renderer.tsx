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
          /* ═══════════════════════════════════════════════════════
           *  BNK 공식 컬러 시스템 (BNK Financial Group CI)
           * ───────────────────────────────────────────────────────
           *  BNK Red        #D7191F  PANTONE 1797C  주 브랜드 컬러
           *  BNK Dark Red   #8B0304  PANTONE 188C   강조/다크 포인트
           *  BNK Dark Gray  #65584F  PANTONE Warm Gray 11C  본문 텍스트
           *  BNK Light Gray #B7A997  PANTONE 7530C  서브 텍스트
           *  BNK Silver     #909394  PANTONE 877C   캡션
           *  BNK Gold       #896E4A  PANTONE 873C   골드 포인트
           * ═══════════════════════════════════════════════════════ */
          :root {
            --bnk-red:        #D7191F;
            --bnk-dark-red:   #8B0304;
            --bnk-dark-gray:  #65584F;
            --bnk-light-gray: #B7A997;
            --bnk-silver:     #909394;
            --bnk-gold:       #896E4A;
          }

          * { font-family: 'Noto Sans KR', sans-serif; }

          /* ── 그라데이션 유틸 ───────────────────────────────── */
          /* Primary: Dark Red → BNK Red */
          .bnk-gradient {
            background: linear-gradient(135deg, var(--bnk-dark-red) 0%, var(--bnk-red) 65%, #E8353B 100%);
          }
          /* Gold accent gradient */
          .bnk-gold-gradient {
            background: linear-gradient(135deg, #5C3D20 0%, var(--bnk-gold) 100%);
          }
          /* Subtle warm background */
          .bnk-warm-bg {
            background: linear-gradient(135deg, #FFF5F5 0%, #FFF0EC 100%);
          }

          /* ── 텍스트 컬러 유틸 ─────────────────────────────── */
          .bnk-red        { color: var(--bnk-red); }
          .bnk-dark-red   { color: var(--bnk-dark-red); }
          .bnk-dark-gray  { color: var(--bnk-dark-gray); }
          .bnk-light-gray { color: var(--bnk-light-gray); }
          .bnk-gold       { color: var(--bnk-gold); }

          /* ── 배경 컬러 유틸 ───────────────────────────────── */
          .bg-bnk-red        { background-color: var(--bnk-red); }
          .bg-bnk-dark-red   { background-color: var(--bnk-dark-red); }
          .bg-bnk-dark-gray  { background-color: var(--bnk-dark-gray); }
          .bg-bnk-light-gray { background-color: var(--bnk-light-gray); }
          .bg-bnk-gold       { background-color: var(--bnk-gold); }

          /* ── 카드 호버 ─────────────────────────────────────── */
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px rgba(139,3,4,0.12);
          }

          /* ── 버튼 유틸 ─────────────────────────────────────── */
          .btn-bnk-red {
            background: var(--bnk-red);
            color: #fff;
            transition: all 0.25s;
          }
          .btn-bnk-red:hover { background: var(--bnk-dark-red); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(215,25,31,0.35); }

          .btn-bnk-outline {
            background: rgba(255,255,255,0.15);
            color: #fff;
            border: 1.5px solid rgba(255,255,255,0.5);
            backdrop-filter: blur(4px);
            transition: all 0.25s;
          }
          .btn-bnk-outline:hover { background: rgba(255,255,255,0.25); }

          .btn-bnk-gold {
            background: var(--bnk-gold);
            color: #fff;
            transition: all 0.25s;
          }
          .btn-bnk-gold:hover { background: #6B5236; transform: translateY(-1px); }

          /* ── 네비 언더라인 ─────────────────────────────────── */
          .nav-link { position: relative; }
          .nav-link::after {
            content: '';
            position: absolute;
            width: 0; height: 2px;
            background: var(--bnk-red);
            bottom: -2px; left: 0;
            transition: width 0.3s ease;
          }
          .nav-link:hover::after,
          .nav-link.active::after { width: 100%; }

          /* ── 히어로 텍스트 ─────────────────────────────────── */
          .hero-text { text-shadow: 0 2px 20px rgba(0,0,0,0.3); }

          /* ── 섹션 타이틀 언더라인 ──────────────────────────── */
          .section-title { position: relative; display: inline-block; }
          .section-title::after {
            content: '';
            position: absolute;
            width: 56px; height: 4px;
            background: linear-gradient(90deg, var(--bnk-dark-red), var(--bnk-gold));
            bottom: -12px; left: 0;
            border-radius: 2px;
          }

          /* ── 섹션 레이블 (상단 소제목) ─────────────────────── */
          .section-label {
            color: var(--bnk-red);
            font-weight: 700;
            font-size: 0.75rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          /* ── 푸터 배경 ─────────────────────────────────────── */
          .footer-bg {
            background: linear-gradient(150deg, #1a0000 0%, #3a0101 50%, #520101 100%);
          }

          /* ── 활동 카드 상단 바 ─────────────────────────────── */
          .activity-top-bar {
            height: 4px;
            background: linear-gradient(90deg, var(--bnk-dark-red), var(--bnk-gold));
          }

          /* ── Gold 세로줄 ───────────────────────────────────── */
          .gold-line { border-left: 3px solid var(--bnk-gold); }

          /* ── 태그 배지 ─────────────────────────────────────── */
          .tag-red    { background: #FFF0F0; color: var(--bnk-dark-red); }
          .tag-gold   { background: #FFF8EF; color: var(--bnk-gold); }
          .tag-gray   { background: #F5F2EF; color: var(--bnk-dark-gray); }

          /* ── stat card 글래스 ──────────────────────────────── */
          .stat-card {
            background: rgba(255,255,255,0.10);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.18);
          }

          /* ── 블로그 이미지 줌 ──────────────────────────────── */
          .blog-card:hover .blog-img { transform: scale(1.05); }
          .blog-img { transition: transform 0.4s ease; }

          /* ── 애니메이션 ────────────────────────────────────── */
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-in-up  { animation: fadeInUp 0.8s ease forwards; }
          .delay-1 { animation-delay: 0.2s; opacity: 0; }
          .delay-2 { animation-delay: 0.4s; opacity: 0; }
          .delay-3 { animation-delay: 0.6s; opacity: 0; }

          /* ── 인풋 포커스 ring ──────────────────────────────── */
          input:focus, select:focus, textarea:focus {
            outline: none;
            ring: 2px;
            border-color: var(--bnk-red) !important;
            box-shadow: 0 0 0 3px rgba(215,25,31,0.12);
          }

          /* ── 테이블 ────────────────────────────────────────── */
          .bnk-table thead tr {
            background: linear-gradient(90deg, var(--bnk-dark-red), #A00405);
            color: #fff;
          }
          .bnk-table tbody tr:hover { background: #FFF5F5; }
        `}</style>
      </head>
      <body class="bg-gray-50">

        {/* ─── Navigation ────────────────────────────────────── */}
        <nav class="bg-white shadow-md sticky top-0 z-50 border-t-4" style="border-top-color: var(--bnk-red);">
          <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex justify-between items-center h-16">

              {/* Logo */}
              <a href="/" class="flex items-center space-x-3">
                <div class="w-10 h-10 bnk-gradient rounded-lg flex items-center justify-center shadow-sm">
                  <i class="fas fa-laptop-code text-white text-lg"></i>
                </div>
                <div>
                  <div class="text-sm font-black leading-tight" style="color:var(--bnk-dark-red)">BNK 재능기부봉사단</div>
                  <div class="text-xs font-bold" style="color:var(--bnk-gold)">디지털 IT팀</div>
                </div>
              </a>

              {/* Desktop Menu */}
              <div class="hidden md:flex items-center space-x-7">
                <a href="/"           class="nav-link font-medium text-sm transition-colors" style="color:var(--bnk-dark-gray)">홈</a>
                <a href="/about"      class="nav-link font-medium text-sm transition-colors" style="color:var(--bnk-dark-gray)">소개</a>
                <a href="/activities" class="nav-link font-medium text-sm transition-colors" style="color:var(--bnk-dark-gray)">활동내역</a>
                <a href="/blog"       class="nav-link font-medium text-sm transition-colors" style="color:var(--bnk-dark-gray)">블로그</a>
                <a href="/gallery"    class="nav-link font-medium text-sm transition-colors" style="color:var(--bnk-dark-gray)">갤러리</a>
                <a href="/team"       class="nav-link font-medium text-sm transition-colors" style="color:var(--bnk-dark-gray)">팀 소개</a>
                <a href="/contact"
                  class="btn-bnk-red px-5 py-2 rounded-lg text-sm font-bold shadow-sm inline-flex items-center gap-1.5">
                  <i class="fas fa-envelope"></i>문의하기
                </a>
              </div>

              {/* Mobile Button */}
              <button onclick="document.getElementById('mobileMenu').classList.toggle('hidden')"
                class="md:hidden p-2 rounded-lg transition-colors" style="color:var(--bnk-red)">
                <i class="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div id="mobileMenu" class="hidden md:hidden bg-white border-t px-4 py-3 space-y-1"
            style="border-top-color: rgba(215,25,31,0.15);">
            {[
              { label: '홈', href: '/' },
              { label: '소개', href: '/about' },
              { label: '활동내역', href: '/activities' },
              { label: '블로그', href: '/blog' },
              { label: '갤러리', href: '/gallery' },
              { label: '팀 소개', href: '/team' },
              { label: '문의하기', href: '/contact' },
            ].map(item => (
              <a href={item.href}
                class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style="color:var(--bnk-dark-gray)"
                onmouseover={`this.style.background='rgba(215,25,31,0.06)';this.style.color='var(--bnk-red)'`}
                onmouseout={`this.style.background='';this.style.color='var(--bnk-dark-gray)'`}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ─── Main Content ────────────────────────────────── */}
        <main>{children}</main>

        {/* ─── Footer ──────────────────────────────────────── */}
        <footer class="footer-bg text-white mt-20">
          <div class="max-w-7xl mx-auto px-6 py-12">
            {/* Gold top line */}
            <div class="h-px mb-10 opacity-40" style="background: linear-gradient(90deg, transparent, var(--bnk-gold), transparent);"></div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div class="col-span-1 md:col-span-2">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                    style="background: rgba(215,25,31,0.3);">
                    <i class="fas fa-laptop-code text-white text-lg"></i>
                  </div>
                  <div>
                    <div class="font-black text-white text-sm">BNK 재능기부봉사단</div>
                    <div class="text-xs font-bold" style="color:var(--bnk-gold)">디지털 IT팀</div>
                  </div>
                </div>
                <p class="text-sm leading-relaxed mb-4" style="color:var(--bnk-light-gray)">
                  BNK부산은행 임직원이 디지털·IT 전문 역량으로<br />
                  지역사회 취약계층에게 실질적인 도움을 드리는<br />
                  재능기부봉사단입니다.
                </p>
                <div class="flex space-x-3">
                  {['fa-instagram','fa-youtube','fa-facebook'].map(ic => (
                    <a href="#"
                      class="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                      style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);"
                      onmouseover="this.style.background='rgba(215,25,31,0.45)'"
                      onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                      <i class={`fab ${ic} text-sm text-white`}></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 class="font-black text-white mb-4 text-xs uppercase tracking-widest"
                  style="color:var(--bnk-gold)">바로가기</h4>
                <ul class="space-y-2 text-sm" style="color:var(--bnk-light-gray)">
                  {[['소개','/about'],['활동 내역','/activities'],['블로그','/blog'],['갤러리','/gallery'],['팀 소개','/team']].map(([label,href]) => (
                    <li>
                      <a href={href}
                        class="hover:text-white transition-colors flex items-center gap-1.5"
                        onmouseover="this.style.color='#fff'"
                        onmouseout={`this.style.color='var(--bnk-light-gray)'`}>
                        <span style="color:var(--bnk-red)">›</span> {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 class="font-black mb-4 text-xs uppercase tracking-widest"
                  style="color:var(--bnk-gold)">연락처</h4>
                <ul class="space-y-2 text-sm" style="color:var(--bnk-light-gray)">
                  <li class="flex items-start gap-2">
                    <i class="fas fa-map-marker-alt mt-0.5 w-4 flex-shrink-0" style="color:var(--bnk-red)"></i>
                    부산광역시 부산진구
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-envelope w-4" style="color:var(--bnk-red)"></i>
                    digital.it@bnkfs.com
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="fas fa-globe w-4" style="color:var(--bnk-red)"></i>
                    www.bnkbusan.com
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div class="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-2"
              style="border-top-color:rgba(183,169,151,0.2)">
              <p class="text-xs" style="color:var(--bnk-silver)">
                © 2024 BNK부산은행 재능기부봉사단 디지털IT팀. All rights reserved.
              </p>
              <p class="text-xs flex items-center gap-1" style="color:var(--bnk-silver)">
                <i class="fas fa-heart" style="color:var(--bnk-red)"></i>
                함께 나누는 디지털 세상
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})
