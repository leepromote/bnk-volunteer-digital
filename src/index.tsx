import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

// ─── 홈 페이지 ───────────────────────────────────────────────
app.get('/', (c) => {
  return c.render(
    <div>
      {/* Hero Section */}
      <section class="bnk-gradient relative overflow-hidden min-h-screen flex items-center">
        {/* Background decoration */}
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
          <div class="absolute top-1/2 right-1/4 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="text-white">
              <div class="inline-flex items-center bg-white bg-opacity-15 backdrop-blur rounded-full px-4 py-2 mb-6 fade-in-up">
                <i class="fas fa-heart text-orange-400 mr-2"></i>
                <span class="text-sm font-medium">BNK부산은행 재능기부봉사단</span>
              </div>
              <h1 class="hero-text text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 fade-in-up delay-1">
                디지털로<br />
                <span class="text-orange-400">세상을 잇는</span><br />
                봉사의 마음
              </h1>
              <p class="text-blue-100 text-lg leading-relaxed mb-8 fade-in-up delay-2">
                BNK부산은행 임직원의 디지털·IT 전문 역량을 지역사회와 나눕니다.<br />
                취약계층 디지털 교육, IT 지원, 스마트 금융 서비스로<br />
                더 따뜻한 부산을 만들어 갑니다.
              </p>
              <div class="flex flex-wrap gap-4 fade-in-up delay-3">
                <a href="/activities" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-1">
                  <i class="fas fa-play-circle mr-2"></i>활동 보기
                </a>
                <a href="/about" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-40 px-8 py-3 rounded-full font-bold text-sm transition-all backdrop-blur">
                  <i class="fas fa-info-circle mr-2"></i>자세히 알아보기
                </a>
              </div>
            </div>

            {/* Stats */}
            <div class="grid grid-cols-2 gap-4">
              {[
                { icon: 'fa-users', label: '봉사단원', value: '50+', sub: '명의 전문가' },
                { icon: 'fa-calendar-check', label: '봉사 횟수', value: '120+', sub: '회 완료' },
                { icon: 'fa-user-graduate', label: '교육 수혜자', value: '1,500+', sub: '명 교육' },
                { icon: 'fa-award', label: '봉사 시간', value: '3,600+', sub: '시간 헌신' },
              ].map((stat) => (
                <div class="stat-card rounded-2xl p-6 text-center text-white fade-in-up">
                  <div class="w-12 h-12 bg-orange-400 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class={`fas ${stat.icon} text-orange-300 text-xl`}></i>
                  </div>
                  <div class="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div class="text-blue-200 text-xs font-medium">{stat.label}</div>
                  <div class="text-blue-300 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div class="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 20C480 20 600 40 720 45C840 50 960 40 1080 35C1200 30 1320 40 1380 45L1440 50V60H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* What We Do */}
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <p class="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">Our Mission</p>
            <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">우리가 하는 일</h2>
            <p class="text-gray-500 max-w-2xl mx-auto">디지털 전문 역량으로 지역사회의 디지털 격차를 해소하고, 모두가 함께하는 스마트 사회를 만들어 갑니다.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-chalkboard-teacher',
                color: 'bg-blue-100 text-blue-700',
                title: '디지털 교육',
                desc: '시니어, 장애인, 다문화가정 등 취약계층을 대상으로 스마트폰 활용법, 인터넷 뱅킹, SNS 사용법 등 맞춤형 디지털 교육을 진행합니다.',
                tags: ['스마트폰 교육', '인터넷 뱅킹', 'SNS 활용'],
              },
              {
                icon: 'fa-tools',
                color: 'bg-orange-100 text-orange-600',
                title: 'IT 장비 지원',
                desc: '노후 컴퓨터 수리·점검, 소프트웨어 설치, 네트워크 환경 개선 등 IT 기기 관련 전반적인 지원 서비스를 무료로 제공합니다.',
                tags: ['컴퓨터 수리', '소프트웨어 설치', '네트워크 설정'],
              },
              {
                icon: 'fa-shield-alt',
                color: 'bg-green-100 text-green-700',
                title: '보안·사기 예방',
                desc: '보이스피싱, 스미싱, 금융사기 등 디지털 범죄 예방 교육과 피해 예방을 위한 보안 솔루션을 지원합니다.',
                tags: ['금융사기 예방', '개인정보 보호', '보안 교육'],
              },
            ].map((item) => (
              <div class="bg-white rounded-2xl p-8 card-hover shadow-sm border border-gray-100">
                <div class={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <i class={`fas ${item.icon} text-2xl`}></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                <div class="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Activities */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-12">
            <div>
              <p class="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">Recent Activities</p>
              <h2 class="text-3xl font-black text-gray-900 section-title">최근 활동</h2>
            </div>
            <a href="/activities" class="hidden md:flex items-center text-blue-900 font-semibold text-sm hover:text-blue-700">
              전체 보기 <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                date: '2024.11.20',
                category: '디지털 교육',
                categoryColor: 'bg-blue-100 text-blue-700',
                title: '부산 노인복지관 스마트폰 활용 교육',
                desc: '어르신 30명을 대상으로 스마트폰 기본 조작부터 카카오톡, 유튜브 활용까지 3시간 교육을 진행하였습니다.',
                participants: 8,
                hours: 3,
              },
              {
                date: '2024.11.15',
                category: 'IT 지원',
                categoryColor: 'bg-orange-100 text-orange-600',
                title: '지역아동센터 컴퓨터 정비 봉사',
                desc: '취약계층 아동들이 이용하는 지역아동센터의 노후 PC 15대를 점검하고 업그레이드하였습니다.',
                participants: 12,
                hours: 6,
              },
              {
                date: '2024.11.05',
                category: '보안 교육',
                categoryColor: 'bg-green-100 text-green-700',
                title: '다문화가정 금융사기 예방 캠페인',
                desc: '외국인 근로자 및 다문화가정을 대상으로 보이스피싱, 스미싱 예방 교육을 다국어로 진행했습니다.',
                participants: 6,
                hours: 4,
              },
            ].map((act) => (
              <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm">
                <div class="h-3 bnk-gradient"></div>
                <div class="p-6">
                  <div class="flex justify-between items-center mb-3">
                    <span class={`${act.categoryColor} text-xs font-bold px-3 py-1 rounded-full`}>{act.category}</span>
                    <span class="text-gray-400 text-xs">{act.date}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 mb-2 leading-snug">{act.title}</h3>
                  <p class="text-gray-500 text-sm leading-relaxed mb-4">{act.desc}</p>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center text-blue-700 text-xs font-medium">
                      <i class="fas fa-users mr-1"></i> 참여 {act.participants}명
                    </div>
                    <div class="flex items-center text-orange-500 text-xs font-medium">
                      <i class="fas fa-clock mr-1"></i> {act.hours}시간
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-12">
            <div>
              <p class="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">Blog & News</p>
              <h2 class="text-3xl font-black text-gray-900 section-title">최신 포스트</h2>
            </div>
            <a href="/blog" class="hidden md:flex items-center text-blue-900 font-semibold text-sm hover:text-blue-700">
              더 보기 <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                tag: '활동 후기',
                tagColor: 'bg-purple-100 text-purple-700',
                emoji: '📱',
                title: '어르신들의 첫 카카오톡, 감동의 순간들',
                desc: '지난 주 노인복지관에서 진행한 스마트폰 교육 현장을 생생하게 전합니다. 처음으로 손주에게 사진을 보내신 할머니의 미소...',
                author: '김봉사',
                date: '2024.11.21',
                readTime: '3분',
              },
              {
                tag: 'IT 팁',
                tagColor: 'bg-cyan-100 text-cyan-700',
                emoji: '🛡️',
                title: '보이스피싱 100% 차단하는 실전 가이드',
                desc: '최근 급증하는 AI 보이스피싱 수법과 대처 방법을 알기 쉽게 정리했습니다. 가족들에게 꼭 공유해 주세요.',
                author: '이IT',
                date: '2024.11.18',
                readTime: '5분',
              },
              {
                tag: '소식',
                tagColor: 'bg-yellow-100 text-yellow-700',
                emoji: '🏆',
                title: '2024 부산시 우수 봉사단체 표창 수상!',
                desc: 'BNK 재능기부봉사단 디지털IT팀이 부산시로부터 우수 봉사단체로 선정되어 표창을 받았습니다. 모든 단원 여러분 감사합니다!',
                author: '박팀장',
                date: '2024.11.10',
                readTime: '2분',
              },
            ].map((post) => (
              <a href="/blog" class="blog-card bg-white rounded-2xl overflow-hidden card-hover shadow-sm border border-gray-100 block">
                <div class="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  <span class="text-7xl">{post.emoji}</span>
                </div>
                <div class="p-6">
                  <span class={`${post.tagColor} text-xs font-bold px-3 py-1 rounded-full`}>{post.tag}</span>
                  <h3 class="font-bold text-gray-900 mt-3 mb-2 leading-snug">{post.title}</h3>
                  <p class="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.desc}</p>
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div class="flex items-center text-gray-500 text-xs">
                      <div class="w-6 h-6 rounded-full bnk-gradient flex items-center justify-center mr-2">
                        <i class="fas fa-user text-white text-xs"></i>
                      </div>
                      {post.author}
                    </div>
                    <div class="text-gray-400 text-xs">
                      {post.date} · {post.readTime} 읽기
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 bnk-gradient relative overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 opacity-10 rounded-full translate-y-1/2"></div>
        </div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <i class="fas fa-hands-helping text-orange-400 text-4xl mb-6"></i>
          <h2 class="text-3xl md:text-4xl font-black text-white mb-4">함께 만드는 디지털 세상</h2>
          <p class="text-blue-100 text-lg mb-8">우리의 전문성이 누군가에게 희망이 됩니다.<br />BNK 재능기부봉사단 디지털IT팀과 함께해 주세요.</p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="/contact" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <i class="fas fa-envelope mr-2"></i>봉사 신청하기
            </a>
            <a href="/about" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-40 px-8 py-4 rounded-full font-bold text-sm transition-all">
              <i class="fas fa-book-open mr-2"></i>더 알아보기
            </a>
          </div>
        </div>
      </section>
    </div>,
    { title: '홈' }
  )
})

// ─── 소개 페이지 ──────────────────────────────────────────────
app.get('/about', (c) => {
  return c.render(
    <div>
      {/* Page Hero */}
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="text-orange-400 font-semibold text-sm mb-2">About Us</p>
          <h1 class="text-4xl font-black mb-4">봉사단 소개</h1>
          <p class="text-blue-100 text-lg">BNK부산은행 재능기부봉사단 디지털IT팀을 소개합니다</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Mission & Vision */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="w-14 h-14 bnk-gradient rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-bullseye text-white text-2xl"></i>
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-4">미션</h2>
            <p class="text-gray-600 leading-relaxed">
              BNK부산은행 임직원의 디지털·IT 전문 역량을 활용하여 디지털 소외계층에게 실질적이고 지속적인 도움을 제공합니다. 디지털 기술로 지역사회의 격차를 해소하고, 모두가 균등한 기회를 누릴 수 있는 따뜻한 세상을 만들어 갑니다.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-eye text-white text-2xl"></i>
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-4">비전</h2>
            <p class="text-gray-600 leading-relaxed">
              "디지털로 하나되는 부산" — 지역 내 모든 시민이 디지털 기술의 혜택을 누릴 수 있도록, 2030년까지 10,000명 이상을 교육하고 지원하는 부산 최고의 디지털 재능기부 봉사단이 되겠습니다.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div class="mb-20">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-black text-gray-900 mb-3">핵심 가치</h2>
            <p class="text-gray-500">우리가 봉사하는 이유와 방식</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'fa-heart', color: 'text-red-500', bg: 'bg-red-50', title: '진심', desc: '진심을 담은 봉사로 수혜자에게 실질적인 변화를' },
              { icon: 'fa-lightbulb', color: 'text-yellow-500', bg: 'bg-yellow-50', title: '전문성', desc: 'IT 전문 지식으로 최고 수준의 서비스를' },
              { icon: 'fa-hands-helping', color: 'text-blue-500', bg: 'bg-blue-50', title: '협력', desc: '단원 간 협력과 지역사회와의 연대로' },
              { icon: 'fa-sync', color: 'text-green-500', bg: 'bg-green-50', title: '지속성', desc: '일회성이 아닌 지속적인 관계와 지원을' },
            ].map(v => (
              <div class="bg-white rounded-2xl p-6 text-center card-hover shadow-sm border border-gray-100">
                <div class={`w-16 h-16 ${v.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i class={`fas ${v.icon} ${v.color} text-2xl`}></i>
                </div>
                <h3 class="font-black text-gray-900 mb-2">{v.title}</h3>
                <p class="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        <div class="mb-20">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-black text-gray-900 mb-3">연혁</h2>
            <p class="text-gray-500">걸어온 발자취</p>
          </div>
          <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block"></div>
            {[
              { year: '2024', items: ['우수봉사단체 표창 수상 (부산시)', '디지털 교육 수혜자 1,500명 달성', '찾아가는 IT 지원 서비스 확대 운영'] },
              { year: '2023', items: ['봉사단 공식 홈페이지 개설', '봉사 단원 50명 규모로 확대', '다문화가정 특화 교육 프로그램 도입'] },
              { year: '2022', items: ['디지털IT 전담팀 출범', '첫 디지털 교육 봉사 활동 시작', '지역아동센터 컴퓨터 지원 사업 시작'] },
              { year: '2021', items: ['BNK부산은행 재능기부봉사단 창설', '봉사 영역 기획 및 준비', '초기 멤버 20명 구성'] },
            ].map((h, i) => (
              <div class={`flex flex-col md:flex-row gap-8 mb-10 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div class="md:w-1/2 flex justify-end">
                  <div class={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-sm w-full ${i % 2 === 1 ? 'text-right' : ''}`}>
                    <div class="inline-block bg-blue-900 text-white text-sm font-bold px-4 py-1 rounded-full mb-3">{h.year}</div>
                    <ul class="space-y-1">
                      {h.items.map(it => (
                        <li class="text-gray-600 text-sm flex items-start gap-2">
                          <i class="fas fa-check-circle text-orange-500 mt-0.5 flex-shrink-0"></i> {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div class="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Organizations */}
        <div>
          <div class="text-center mb-12">
            <h2 class="text-3xl font-black text-gray-900 mb-3">협력 기관</h2>
            <p class="text-gray-500">함께 봉사하는 파트너들</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['부산시 사회복지관', '부산 노인복지관', '지역아동센터', '다문화가족지원센터', '부산 장애인복지관', '청소년문화센터', '부산 소셜벤처', '부산교육청'].map(org => (
              <div class="bg-white border border-gray-100 rounded-xl p-4 text-center text-sm text-gray-600 font-medium hover:border-blue-300 hover:text-blue-800 transition-all card-hover shadow-sm">
                <i class="fas fa-building text-blue-400 mb-2 block"></i>
                {org}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    { title: '소개' }
  )
})

// ─── 활동 내역 페이지 ─────────────────────────────────────────
app.get('/activities', (c) => {
  const activities = [
    { id: 1, date: '2024.11.20', category: '디지털 교육', icon: 'fa-chalkboard-teacher', color: 'blue', title: '부산 노인복지관 스마트폰 활용 교육', location: '부산 동구 노인복지관', participants: 8, beneficiaries: 30, hours: 3, desc: '어르신 30명을 대상으로 스마트폰 기본 조작, 카카오톡, 유튜브 활용 교육을 3시간 동안 진행했습니다. 참가자들의 만족도가 매우 높았습니다.' },
    { id: 2, date: '2024.11.15', category: 'IT 장비 지원', icon: 'fa-tools', color: 'orange', title: '지역아동센터 컴퓨터 정비 봉사', location: '부산 사하구 지역아동센터', participants: 12, beneficiaries: 80, hours: 6, desc: '취약계층 아동 80명이 이용하는 센터의 노후 PC 15대를 점검, 수리, 업그레이드하고 보안 소프트웨어를 설치했습니다.' },
    { id: 3, date: '2024.11.05', category: '보안 교육', icon: 'fa-shield-alt', color: 'green', title: '다문화가정 금융사기 예방 캠페인', location: '부산 남구 다문화가족지원센터', participants: 6, beneficiaries: 45, hours: 4, desc: '외국인 근로자 및 다문화가정 45명을 대상으로 보이스피싱, 스미싱, 금융사기 예방 교육을 5개 언어로 진행했습니다.' },
    { id: 4, date: '2024.10.28', category: '디지털 교육', icon: 'fa-chalkboard-teacher', color: 'blue', title: '청소년 코딩 기초 교육', location: '부산 금정구 청소년문화센터', participants: 10, beneficiaries: 25, hours: 8, desc: '중학생 25명을 대상으로 스크래치를 활용한 기초 코딩 교육을 진행하고, IT 직업 진로 상담을 함께 제공했습니다.' },
    { id: 5, date: '2024.10.15', category: 'IT 장비 지원', icon: 'fa-tools', color: 'orange', title: '장애인복지관 네트워크 환경 개선', location: '부산 해운대구 장애인복지관', participants: 15, beneficiaries: 120, hours: 8, desc: '장애인복지관의 무선 네트워크 환경을 개선하고, 접근성 강화를 위한 보조 기기 소프트웨어를 설치했습니다.' },
    { id: 6, date: '2024.10.05', category: '디지털 교육', icon: 'fa-chalkboard-teacher', color: 'blue', title: '소상공인 SNS 마케팅 교육', location: '부산 중구 상공회의소', participants: 5, beneficiaries: 35, hours: 5, desc: '지역 소상공인 35명을 대상으로 인스타그램, 카카오 채널 운영법 및 스마트 결제 시스템 활용 교육을 제공했습니다.' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-700',
  }

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="text-orange-400 font-semibold text-sm mb-2">Activities</p>
          <h1 class="text-4xl font-black mb-4">활동 내역</h1>
          <p class="text-blue-100 text-lg">우리가 만들어 온 따뜻한 순간들</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div class="bg-white border-b border-gray-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: 'fa-calendar-check', value: '120+', label: '총 봉사 횟수', color: 'text-blue-700' },
              { icon: 'fa-users', value: '1,500+', label: '수혜자 인원', color: 'text-orange-500' },
              { icon: 'fa-clock', value: '3,600+', label: '총 봉사 시간', color: 'text-green-600' },
              { icon: 'fa-map-marker-alt', value: '25+', label: '활동 기관 수', color: 'text-purple-600' },
            ].map(s => (
              <div>
                <i class={`fas ${s.icon} ${s.color} text-2xl mb-2`}></i>
                <div class={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div class="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Filter Tabs */}
        <div class="flex flex-wrap gap-3 mb-10">
          {['전체', '디지털 교육', 'IT 장비 지원', '보안 교육'].map((f, i) => (
            <button class={`px-6 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bnk-gradient text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Activity Cards */}
        <div class="space-y-6">
          {activities.map(act => (
            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 card-hover">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-shrink-0">
                  <div class={`w-16 h-16 ${colorMap[act.color] || 'bg-gray-100 text-gray-500'} rounded-2xl flex items-center justify-center`}>
                    <i class={`fas ${act.icon} text-2xl`}></i>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-3 mb-2">
                    <span class={`${colorMap[act.color] || 'bg-gray-100 text-gray-500'} text-xs font-bold px-3 py-1 rounded-full`}>{act.category}</span>
                    <span class="text-gray-400 text-sm"><i class="fas fa-calendar mr-1"></i>{act.date}</span>
                    <span class="text-gray-400 text-sm"><i class="fas fa-map-marker-alt mr-1"></i>{act.location}</span>
                  </div>
                  <h3 class="text-xl font-black text-gray-900 mb-2">{act.title}</h3>
                  <p class="text-gray-500 text-sm leading-relaxed mb-4">{act.desc}</p>
                  <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      <i class="fas fa-user-tie"></i> 봉사단원 {act.participants}명
                    </div>
                    <div class="flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full">
                      <i class="fas fa-heart"></i> 수혜자 {act.beneficiaries}명
                    </div>
                    <div class="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      <i class="fas fa-clock"></i> {act.hours}시간
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { title: '활동 내역' }
  )
})

// ─── 블로그 페이지 ────────────────────────────────────────────
app.get('/blog', (c) => {
  const posts = [
    { id: 1, tag: '활동 후기', tagColor: 'bg-purple-100 text-purple-700', emoji: '📱', title: '어르신들의 첫 카카오톡, 감동의 순간들', desc: '지난 주 노인복지관에서 진행한 스마트폰 교육 현장을 생생하게 전합니다. 처음으로 손주에게 사진을 보내신 할머니의 미소가 잊혀지지 않습니다.', author: '김봉사', date: '2024.11.21', readTime: '3분' },
    { id: 2, tag: 'IT 팁', tagColor: 'bg-cyan-100 text-cyan-700', emoji: '🛡️', title: '보이스피싱 100% 차단하는 실전 가이드', desc: '최근 급증하는 AI 보이스피싱 수법과 대처 방법을 알기 쉽게 정리했습니다. 가족들에게 꼭 공유해 주세요.', author: '이IT', date: '2024.11.18', readTime: '5분' },
    { id: 3, tag: '소식', tagColor: 'bg-yellow-100 text-yellow-700', emoji: '🏆', title: '2024 부산시 우수 봉사단체 표창 수상!', desc: 'BNK 재능기부봉사단 디지털IT팀이 부산시로부터 우수 봉사단체로 선정되어 표창을 받았습니다.', author: '박팀장', date: '2024.11.10', readTime: '2분' },
    { id: 4, tag: '디지털 교육', tagColor: 'bg-blue-100 text-blue-700', emoji: '💻', title: '코딩 교육, 왜 어린이부터 시작해야 할까?', desc: '미래 사회의 필수 역량인 컴퓨팅 사고력. 어린 시절부터 시작하면 어떤 점이 좋은지 전문가 관점에서 설명합니다.', author: '최개발', date: '2024.11.05', readTime: '7분' },
    { id: 5, tag: '활동 후기', tagColor: 'bg-purple-100 text-purple-700', emoji: '🤝', title: '장애인복지관 네트워크 개선 프로젝트 후기', desc: '3일간 진행된 장애인복지관 IT 환경 개선 프로젝트. 단순한 기술 지원을 넘어 깊은 인연을 맺은 특별한 경험을 나눕니다.', author: '정봉사', date: '2024.10.30', readTime: '6분' },
    { id: 6, tag: 'IT 팁', tagColor: 'bg-cyan-100 text-cyan-700', emoji: '📧', title: '스마트 금융 앱 안전하게 사용하는 법', desc: '인터넷뱅킹과 금융 앱을 더 안전하게 사용하기 위한 실전 팁을 공유합니다. 인증서 관리부터 2단계 인증까지.', author: '오보안', date: '2024.10.20', readTime: '4분' },
  ]

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="text-orange-400 font-semibold text-sm mb-2">Blog & Stories</p>
          <h1 class="text-4xl font-black mb-4">블로그</h1>
          <p class="text-blue-100 text-lg">활동 이야기, IT 팁, 봉사 소식을 전합니다</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Featured Post */}
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 md:p-12 mb-12 text-white overflow-hidden relative">
          <div class="absolute right-8 top-1/2 -translate-y-1/2 text-9xl opacity-30">📱</div>
          <div class="relative z-10 max-w-xl">
            <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">✨ 추천 포스트</span>
            <h2 class="text-2xl md:text-3xl font-black mt-4 mb-3">어르신들의 첫 카카오톡, 감동의 순간들</h2>
            <p class="text-blue-200 text-sm mb-5">지난 주 노인복지관에서 진행한 스마트폰 교육 현장을 생생하게 전합니다. 처음으로 손주에게 사진을 보내신 할머니의 미소가 잊혀지지 않습니다.</p>
            <div class="flex items-center gap-4 text-blue-300 text-sm">
              <span><i class="fas fa-user mr-1"></i> 김봉사</span>
              <span><i class="fas fa-calendar mr-1"></i> 2024.11.21</span>
              <span><i class="fas fa-clock mr-1"></i> 3분 읽기</span>
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div class="flex flex-wrap gap-3 mb-10">
          {['전체', '활동 후기', 'IT 팁', '소식', '디지털 교육'].map((t, i) => (
            <button class={`px-5 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bnk-gradient text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div class="blog-card bg-white rounded-2xl overflow-hidden card-hover shadow-sm border border-gray-100">
              <div class="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                <span class="text-7xl">{post.emoji}</span>
              </div>
              <div class="p-6">
                <span class={`${post.tagColor} text-xs font-bold px-3 py-1 rounded-full`}>{post.tag}</span>
                <h3 class="font-bold text-gray-900 mt-3 mb-2 leading-snug">{post.title}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-4">{post.desc}</p>
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div class="flex items-center text-gray-500 text-xs gap-2">
                    <div class="w-6 h-6 rounded-full bnk-gradient flex items-center justify-center">
                      <i class="fas fa-user text-white text-xs"></i>
                    </div>
                    {post.author}
                  </div>
                  <div class="text-gray-400 text-xs">{post.date} · {post.readTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { title: '블로그' }
  )
})

// ─── 갤러리 페이지 ────────────────────────────────────────────
app.get('/gallery', (c) => {
  const photos = [
    { emoji: '👩‍💻', title: '스마트폰 교육 현장', date: '2024.11', category: '교육' },
    { emoji: '🖥️', title: 'PC 수리 봉사', date: '2024.11', category: 'IT 지원' },
    { emoji: '🤝', title: '복지관 협약식', date: '2024.10', category: '협약' },
    { emoji: '📚', title: '코딩 교육 현장', date: '2024.10', category: '교육' },
    { emoji: '🏆', title: '부산시 표창 수상', date: '2024.10', category: '수상' },
    { emoji: '👨‍🏫', title: '금융사기 예방 교육', date: '2024.09', category: '교육' },
    { emoji: '🌐', title: '네트워크 설치 봉사', date: '2024.09', category: 'IT 지원' },
    { emoji: '🎓', title: '청소년 IT 진로 특강', date: '2024.08', category: '교육' },
    { emoji: '📱', title: '인터넷뱅킹 실습 교육', date: '2024.08', category: '교육' },
    { emoji: '🔧', title: '노트북 수리 봉사', date: '2024.07', category: 'IT 지원' },
    { emoji: '🎉', title: '봉사단 창립 3주년', date: '2024.06', category: '행사' },
    { emoji: '🏫', title: '복지관 방문 봉사', date: '2024.06', category: '방문' },
  ]

  const bgGradients = [
    'from-blue-100 to-blue-200',
    'from-orange-100 to-orange-200',
    'from-green-100 to-green-200',
    'from-purple-100 to-purple-200',
    'from-pink-100 to-pink-200',
    'from-cyan-100 to-cyan-200',
    'from-yellow-100 to-yellow-200',
    'from-indigo-100 to-indigo-200',
    'from-teal-100 to-teal-200',
    'from-rose-100 to-rose-200',
    'from-violet-100 to-violet-200',
    'from-emerald-100 to-emerald-200',
  ]

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="text-orange-400 font-semibold text-sm mb-2">Gallery</p>
          <h1 class="text-4xl font-black mb-4">갤러리</h1>
          <p class="text-blue-100 text-lg">봉사 현장의 소중한 순간들을 담았습니다</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Filter */}
        <div class="flex flex-wrap gap-3 mb-10">
          {['전체', '교육', 'IT 지원', '수상', '행사', '협약'].map((f, i) => (
            <button class={`px-5 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bnk-gradient text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div class="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer aspect-square flex flex-col items-center justify-center">
              <div class={`absolute inset-0 bg-gradient-to-br ${bgGradients[i % bgGradients.length]}`}></div>
              <div class="relative z-10 text-center p-4">
                <span class="text-5xl block mb-2">{photo.emoji}</span>
                <div class="text-gray-700 font-semibold text-xs leading-tight">{photo.title}</div>
                <div class="text-gray-400 text-xs mt-1">{photo.date}</div>
              </div>
              <div class="absolute inset-0 bg-blue-900 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                  <i class="fas fa-expand text-2xl mb-2 block"></i>
                  <div class="text-sm font-medium">{photo.title}</div>
                  <div class="text-blue-200 text-xs mt-1 bg-white bg-opacity-20 px-2 py-0.5 rounded-full inline-block">{photo.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { title: '갤러리' }
  )
})

// ─── 팀 소개 페이지 ────────────────────────────────────────────
app.get('/team', (c) => {
  const members = [
    { name: '김철수', role: '팀장 · 네트워크 전문가', years: 5, icon: 'fa-network-wired', color: 'from-blue-600 to-blue-800', skills: ['네트워크 설계', '클라우드', '보안'], desc: 'BNK부산은행 IT본부 수석. 지역사회 네트워크 인프라 개선을 위해 앞장서고 있습니다.' },
    { name: '이미영', role: '부팀장 · 디지털 교육 전문가', years: 4, icon: 'fa-chalkboard-teacher', color: 'from-purple-600 to-purple-800', skills: ['교육 설계', '강의', '시니어 IT'], desc: '15년 경력의 IT 교육 전문가. 누구나 쉽게 이해할 수 있는 교육 프로그램을 개발합니다.' },
    { name: '박준혁', role: '개발팀장 · 풀스택 개발자', years: 3, icon: 'fa-code', color: 'from-green-600 to-green-800', skills: ['웹 개발', '앱 개발', 'AI'], desc: '비영리기관을 위한 무료 디지털 도구 개발에 열정을 쏟고 있습니다.' },
    { name: '최수진', role: '보안 전문가', years: 4, icon: 'fa-shield-alt', color: 'from-red-600 to-red-800', skills: ['사이버보안', '금융보안', '취약점 분석'], desc: '금융 사기 및 개인정보 침해 예방 교육의 핵심 강사. 누구보다 열정적으로 활동 중입니다.' },
    { name: '정태호', role: 'IT 지원 전문가', years: 3, icon: 'fa-tools', color: 'from-orange-600 to-orange-800', skills: ['하드웨어', '소프트웨어', 'IT 자산관리'], desc: '노후 장비 수리부터 최신 환경 구축까지, IT 지원 분야의 만능 해결사입니다.' },
    { name: '한지은', role: '디지털 마케팅·홍보 담당', years: 2, icon: 'fa-bullhorn', color: 'from-pink-600 to-pink-800', skills: ['SNS 마케팅', '콘텐츠 제작', '영상편집'], desc: '봉사단의 소식을 세상에 알리는 콘텐츠 크리에이터. 홈페이지 운영도 담당합니다.' },
    { name: '오상민', role: '데이터 분석 전문가', years: 2, icon: 'fa-chart-bar', color: 'from-cyan-600 to-cyan-800', skills: ['데이터 분석', 'Excel 교육', '통계'], desc: '데이터로 봉사 효과를 측정하고, 더 나은 방향을 제시하는 역할을 맡고 있습니다.' },
    { name: '윤성희', role: '접근성·보조기술 전문가', years: 3, icon: 'fa-universal-access', color: 'from-teal-600 to-teal-800', skills: ['접근성 기술', '화면낭독기', '장애인 IT'], desc: '장애인을 위한 IT 접근성 개선 전문가. 모든 사람이 디지털 세상에 참여할 수 있도록 노력합니다.' },
  ]

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="text-orange-400 font-semibold text-sm mb-2">Our Team</p>
          <h1 class="text-4xl font-black mb-4">팀 소개</h1>
          <p class="text-blue-100 text-lg">전문성과 열정을 가진 디지털 봉사단원들을 소개합니다</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Team Stats */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: 'fa-users', value: '50+', label: '전체 단원', color: 'text-blue-700 bg-blue-50' },
            { icon: 'fa-graduation-cap', value: '8개', label: '전문 분야', color: 'text-purple-700 bg-purple-50' },
            { icon: 'fa-medal', value: '15+', label: '평균 IT 경력', color: 'text-orange-600 bg-orange-50' },
            { icon: 'fa-certificate', value: '120+', label: '보유 자격증', color: 'text-green-700 bg-green-50' },
          ].map(s => (
            <div class="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div class={`w-12 h-12 ${s.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <i class={`fas ${s.icon} text-xl`}></i>
              </div>
              <div class="text-2xl font-black text-gray-900">{s.value}</div>
              <div class="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Members Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {members.map(m => (
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
              <div class={`bg-gradient-to-br ${m.color} p-8 text-center`}>
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i class={`fas ${m.icon} text-white text-2xl`}></i>
                </div>
                <h3 class="font-black text-white text-lg">{m.name}</h3>
                <p class="text-white text-opacity-80 text-xs mt-1">{m.role}</p>
              </div>
              <div class="p-5">
                <p class="text-gray-500 text-xs leading-relaxed mb-3">{m.desc}</p>
                <div class="flex flex-wrap gap-1 mb-3">
                  {m.skills.map(sk => (
                    <span class="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{sk}</span>
                  ))}
                </div>
                <div class="flex items-center text-gray-400 text-xs">
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  봉사 {m.years}년째
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white">
          <i class="fas fa-user-plus text-orange-400 text-4xl mb-4"></i>
          <h2 class="text-2xl md:text-3xl font-black mb-3">함께하고 싶으신가요?</h2>
          <p class="text-blue-200 mb-6">BNK부산은행 임직원이라면 누구든지 참여 가능합니다.<br />당신의 IT 전문성이 누군가에게 큰 희망이 됩니다.</p>
          <a href="/contact" class="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all">
            <i class="fas fa-envelope mr-2"></i>봉사단 참여 신청
          </a>
        </div>
      </div>
    </div>,
    { title: '팀 소개' }
  )
})

// ─── 문의하기 페이지 ──────────────────────────────────────────
app.get('/contact', (c) => {
  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="text-orange-400 font-semibold text-sm mb-2">Contact Us</p>
          <h1 class="text-4xl font-black mb-4">문의하기</h1>
          <p class="text-blue-100 text-lg">봉사 신청, 협력 제안, 기타 문의를 남겨주세요</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div class="space-y-6">
            <div>
              <h2 class="text-xl font-black text-gray-900 mb-6">연락처 정보</h2>
              {[
                { icon: 'fa-map-marker-alt', title: '주소', value: '부산광역시 부산진구 중앙대로\nBNK부산은행 본점', color: 'bg-blue-100 text-blue-700' },
                { icon: 'fa-envelope', title: '이메일', value: 'digital.it@bnkfs.com', color: 'bg-orange-100 text-orange-600' },
                { icon: 'fa-phone', title: '전화', value: '051-XXX-XXXX', color: 'bg-green-100 text-green-700' },
                { icon: 'fa-clock', title: '운영 시간', value: '평일 09:00 - 18:00\n(봉사 신청은 상시 가능)', color: 'bg-purple-100 text-purple-700' },
              ].map(info => (
                <div class="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div class={`w-10 h-10 ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i class={`fas ${info.icon}`}></i>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-800 text-sm">{info.title}</div>
                    <div class="text-gray-500 text-sm whitespace-pre-line">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* SNS */}
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 class="font-bold text-gray-800 mb-4 text-sm">소셜 미디어</h3>
              <div class="flex gap-3">
                {[
                  { icon: 'fab fa-instagram', color: 'bg-pink-500', label: 'Instagram' },
                  { icon: 'fab fa-youtube', color: 'bg-red-500', label: 'YouTube' },
                  { icon: 'fab fa-facebook', color: 'bg-blue-600', label: 'Facebook' },
                  { icon: 'fab fa-kakao', color: 'bg-yellow-400', label: 'KakaoTalk' },
                ].map(s => (
                  <a href="#" class={`${s.color} w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity text-sm`}>
                    <i class={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 class="text-xl font-black text-gray-900 mb-6">문의 및 봉사 신청</h2>
              <form class="space-y-5" action="/api/contact" method="POST">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                    <input type="text" name="name" placeholder="홍길동" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">연락처 *</label>
                    <input type="tel" name="phone" placeholder="010-0000-0000" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
                  <input type="email" name="email" placeholder="example@email.com" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">문의 유형 *</label>
                  <select name="type" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">선택해주세요</option>
                    <option value="edu">디지털 교육 신청</option>
                    <option value="it">IT 장비 지원 신청</option>
                    <option value="security">보안 교육 신청</option>
                    <option value="partner">기관 협력 제안</option>
                    <option value="volunteer">봉사단 참여 문의</option>
                    <option value="etc">기타 문의</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">소속 기관명 (해당 시)</label>
                  <input type="text" name="org" placeholder="예: ○○ 노인복지관" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">문의 내용 *</label>
                  <textarea name="message" rows={5} placeholder="봉사 신청 내용, 일정, 대상 인원 등을 자세히 작성해 주시면 빠른 답변에 도움이 됩니다." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" required></textarea>
                </div>
                <div class="flex items-start gap-2">
                  <input type="checkbox" id="privacy" name="privacy" class="mt-0.5" required />
                  <label for="privacy" class="text-xs text-gray-500">
                    개인정보 수집 및 이용에 동의합니다. 수집된 정보는 봉사 신청 처리 목적으로만 활용됩니다.
                  </label>
                </div>
                <button type="submit" class="w-full bnk-gradient text-white py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                  <i class="fas fa-paper-plane mr-2"></i>문의 보내기
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>,
    { title: '문의하기' }
  )
})

// ─── API: 문의 접수 ────────────────────────────────────────────
app.post('/api/contact', async (c) => {
  const body = await c.req.parseBody()
  // 실제 환경에서는 이메일 전송 또는 DB 저장 처리
  return c.html(`
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f9fafb; font-family:'Noto Sans KR', sans-serif;">
      <div style="background:white; padding:3rem; border-radius:1.5rem; text-align:center; max-width:480px; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="font-size:4rem; margin-bottom:1rem;">✅</div>
        <h2 style="color:#003d82; font-size:1.5rem; font-weight:900; margin-bottom:0.5rem;">문의가 접수되었습니다!</h2>
        <p style="color:#6b7280; font-size:0.9rem; line-height:1.6; margin-bottom:1.5rem;">
          <strong>${body.name}</strong>님의 문의를 잘 받았습니다.<br/>
          담당자 확인 후 빠른 시일 내에 연락드리겠습니다.
        </p>
        <a href="/" style="display:inline-block; background:linear-gradient(135deg,#003d82,#0066cc); color:white; padding:0.75rem 2rem; border-radius:9999px; font-weight:700; text-decoration:none; font-size:0.875rem;">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  `)
})

export default app
