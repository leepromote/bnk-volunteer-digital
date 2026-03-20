import { Hono } from 'hono'
import { renderer } from './renderer'
import { admin } from './routes/admin'
import { api } from './routes/api'
import { sha256, createToken } from './utils/auth'

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

// ─── 관리자 / API 라우터 마운트 ───────────────────────────────
app.use('/admin/*', async (c, next) => {
  await next()
})
app.use('/api/admin/*', async (c, next) => {
  await next()
})

// 로그인 POST (메인 앱에서 처리해야 DB env 접근 가능)
app.post('/admin/login', async (c) => {
  const { username, password } = await c.req.parseBody() as { username: string; password: string }
  const hash = await sha256(password)
  const db = c.env.DB
  const user = await db.prepare('SELECT * FROM admins WHERE username = ? AND password_hash = ?').bind(username, hash).first() as any
  if (!user) return c.redirect('/admin/login?error=1')
  const token = await createToken(user.id, user.username)
  c.header('Set-Cookie', `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`)
  return c.redirect('/admin')
})

app.route('/admin', admin)
app.route('/api/admin', api)

// ─── 공개 페이지 렌더러 ──────────────────────────────────────
app.use(renderer)

// ══════════════════════════════════════════════════════════════
// ─── 홈 ──────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/', async (c) => {
  const db = c.env.DB
  const [acts, posts] = await Promise.all([
    db.prepare('SELECT * FROM activities WHERE published=1 ORDER BY date DESC LIMIT 3').all(),
    db.prepare('SELECT * FROM posts WHERE published=1 ORDER BY created_at DESC LIMIT 3').all(),
  ])
  const [actCount, benefCount, hoursCount] = await Promise.all([
    db.prepare('SELECT COUNT(*) as c FROM activities WHERE published=1').first<{c:number}>(),
    db.prepare('SELECT SUM(beneficiaries) as s FROM activities').first<{s:number}>(),
    db.prepare('SELECT SUM(hours) as s FROM activities').first<{s:number}>(),
  ])
  const memberCount = await db.prepare('SELECT COUNT(*) as c FROM members WHERE published=1').first<{c:number}>()

  // BNK 공식 컬러 카테고리 맵
  const categoryColorMap: Record<string, string> = {
    '디지털 교육': 'tag-red',
    'IT 장비 지원': 'tag-gold',
    '보안 교육': 'tag-gray',
    '기타': 'tag-gray',
  }

  return c.render(
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section class="bnk-gradient relative overflow-hidden min-h-screen flex items-center">
        {/* 배경 장식 원 */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
          <div class="absolute top-1/2 right-1/4 w-64 h-64 opacity-10 rounded-full blur-3xl" style="background:var(--bnk-gold)"></div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* 왼쪽: 텍스트 */}
            <div class="text-white">
              <div class="inline-flex items-center bg-white bg-opacity-15 backdrop-blur rounded-full px-4 py-2 mb-6 fade-in-up">
                <i class="fas fa-heart mr-2" style="color:var(--bnk-gold)"></i>
                <span class="text-sm font-medium">BNK부산은행 재능기부봉사단</span>
              </div>
              <h1 class="hero-text text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 fade-in-up delay-1">
                디지털로<br/><span style="color:var(--bnk-gold)">세상을 잇는</span><br/>봉사의 마음
              </h1>
              <p class="text-red-100 text-lg leading-relaxed mb-8 fade-in-up delay-2">
                BNK부산은행 임직원의 디지털·IT 전문 역량을 지역사회와 나눕니다.<br/>
                취약계층 디지털 교육, IT 지원, 스마트 금융 서비스로 더 따뜻한 부산을 만들어 갑니다.
              </p>
              <div class="flex flex-wrap gap-4 fade-in-up delay-3">
                <a href="/activities" class="btn-bnk-gold px-8 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2">
                  <i class="fas fa-play-circle"></i>활동 보기
                </a>
                <a href="/about" class="btn-bnk-outline px-8 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2">
                  <i class="fas fa-info-circle"></i>자세히 알아보기
                </a>
              </div>
            </div>

            {/* 오른쪽: 통계 카드 */}
            <div class="grid grid-cols-2 gap-4">
              {[
                { icon: 'fa-users',         label: '봉사단원',  value: `${memberCount?.c ?? 0}+`,                        sub: '명의 전문가' },
                { icon: 'fa-calendar-check',label: '봉사 횟수', value: `${actCount?.c ?? 0}+`,                          sub: '회 완료' },
                { icon: 'fa-user-graduate', label: '교육 수혜자',value: `${(benefCount?.s ?? 0).toLocaleString()}+`,    sub: '명 교육' },
                { icon: 'fa-award',         label: '봉사 시간', value: `${(hoursCount?.s ?? 0).toLocaleString()}+`,     sub: '시간 헌신' },
              ].map((stat) => (
                <div class="stat-card rounded-2xl p-6 text-center text-white fade-in-up">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style="background:rgba(137,110,74,0.35)">
                    <i class={`fas ${stat.icon} text-xl`} style="color:var(--bnk-gold)"></i>
                  </div>
                  <div class="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div class="text-xs font-medium" style="color:rgba(255,220,200,0.85)">{stat.label}</div>
                  <div class="text-xs" style="color:rgba(255,200,180,0.6)">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 웨이브 */}
        <div class="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 20C480 20 600 40 720 45C840 50 960 40 1080 35C1200 30 1320 40 1380 45L1440 50V60H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* ── What We Do ────────────────────────────────────── */}
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <p class="section-label mb-3">Our Mission</p>
            <h2 class="text-3xl md:text-4xl font-black mb-4" style="color:var(--bnk-dark-gray)">우리가 하는 일</h2>
            <p class="max-w-2xl mx-auto" style="color:var(--bnk-silver)">
              디지털 전문 역량으로 지역사회의 디지털 격차를 해소하고, 모두가 함께하는 스마트 사회를 만들어 갑니다.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-chalkboard-teacher',
                iconBg: 'tag-red',
                iconColor: 'var(--bnk-dark-red)',
                title: '디지털 교육',
                desc: '시니어, 장애인, 다문화가정 등 취약계층을 대상으로 스마트폰 활용법, 인터넷뱅킹, SNS 사용법 등 맞춤형 디지털 교육을 진행합니다.',
                tags: ['스마트폰 교육', '인터넷뱅킹', 'SNS 활용'],
              },
              {
                icon: 'fa-tools',
                iconBg: 'tag-gold',
                iconColor: 'var(--bnk-gold)',
                title: 'IT 장비 지원',
                desc: '노후 컴퓨터 수리·점검, 소프트웨어 설치, 네트워크 환경 개선 등 IT 기기 관련 전반적인 지원 서비스를 무료로 제공합니다.',
                tags: ['컴퓨터 수리', '소프트웨어 설치', '네트워크 설정'],
              },
              {
                icon: 'fa-shield-alt',
                iconBg: 'tag-gray',
                iconColor: 'var(--bnk-dark-gray)',
                title: '보안·사기 예방',
                desc: '보이스피싱, 스미싱, 금융사기 등 디지털 범죄 예방 교육과 피해 예방을 위한 보안 솔루션을 지원합니다.',
                tags: ['금융사기 예방', '개인정보 보호', '보안 교육'],
              },
            ].map((item) => (
              <div class="bg-white rounded-2xl p-8 card-hover shadow-sm border border-gray-100">
                <div class={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                  <i class={`fas ${item.icon} text-2xl`} style={`color:${item.iconColor}`}></i>
                </div>
                <h3 class="text-xl font-bold mb-3" style="color:var(--bnk-dark-gray)">{item.title}</h3>
                <p class="text-sm leading-relaxed mb-4" style="color:var(--bnk-silver)">{item.desc}</p>
                <div class="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span class="tag-gray text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 최근 활동 (DB) ────────────────────────────────── */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-12">
            <div>
              <p class="section-label mb-2">Recent Activities</p>
              <h2 class="text-3xl font-black section-title" style="color:var(--bnk-dark-gray)">최근 활동</h2>
            </div>
            <a href="/activities" class="hidden md:flex items-center font-semibold text-sm gap-1 transition-colors"
              style="color:var(--bnk-dark-red)"
              onmouseover="this.style.color='var(--bnk-red)'"
              onmouseout="this.style.color='var(--bnk-dark-red)'">
              전체 보기 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(acts.results as any[]).map((act) => (
              <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm">
                <div class="activity-top-bar"></div>
                <div class="p-6">
                  <div class="flex justify-between items-center mb-3">
                    <span class={`${categoryColorMap[act.category] || 'tag-gray'} text-xs font-bold px-3 py-1 rounded-full`}>{act.category}</span>
                    <span class="text-xs" style="color:var(--bnk-silver)">{act.date}</span>
                  </div>
                  <h3 class="font-bold mb-2 leading-snug" style="color:var(--bnk-dark-gray)">{act.title}</h3>
                  <p class="text-sm leading-relaxed mb-4" style="color:var(--bnk-silver)">{act.description}</p>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center text-xs font-medium gap-1" style="color:var(--bnk-dark-red)">
                      <i class="fas fa-users"></i> 참여 {act.participants}명
                    </div>
                    <div class="flex items-center text-xs font-medium gap-1" style="color:var(--bnk-gold)">
                      <i class="fas fa-clock"></i> {act.hours}시간
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(acts.results as any[]).length === 0 && (
            <div class="text-center py-20" style="color:var(--bnk-silver)">
              <i class="fas fa-calendar-times text-4xl mb-4 block"></i>
              아직 등록된 활동이 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* ── 최신 블로그 (DB) ──────────────────────────────── */}
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-12">
            <div>
              <p class="section-label mb-2">Blog & News</p>
              <h2 class="text-3xl font-black section-title" style="color:var(--bnk-dark-gray)">최신 포스트</h2>
            </div>
            <a href="/blog" class="hidden md:flex items-center font-semibold text-sm gap-1 transition-colors"
              style="color:var(--bnk-dark-red)"
              onmouseover="this.style.color='var(--bnk-red)'"
              onmouseout="this.style.color='var(--bnk-dark-red)'">
              더 보기 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(posts.results as any[]).map((post) => (
              <a href="/blog" class="blog-card bg-white rounded-2xl overflow-hidden card-hover shadow-sm border border-gray-100 block">
                <div class="h-48 flex items-center justify-center overflow-hidden"
                  style="background:linear-gradient(135deg,#FFF5F5,#FFEDEA)">
                  <span class="text-7xl">{post.emoji}</span>
                </div>
                <div class="p-6">
                  <span class="tag-red text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
                  <h3 class="font-bold mt-3 mb-2 leading-snug" style="color:var(--bnk-dark-gray)">{post.title}</h3>
                  <p class="text-sm leading-relaxed mb-4" style="color:var(--bnk-silver)">
                    {post.excerpt || post.content?.slice(0, 80) + '...'}
                  </p>
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div class="flex items-center text-xs gap-2" style="color:var(--bnk-silver)">
                      <div class="w-6 h-6 rounded-full bnk-gradient flex items-center justify-center">
                        <i class="fas fa-user text-white text-xs"></i>
                      </div>
                      {post.author}
                    </div>
                    <div class="text-xs" style="color:var(--bnk-light-gray)">{post.created_at?.slice(0,10)} · {post.read_time}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {(posts.results as any[]).length === 0 && (
            <div class="text-center py-20" style="color:var(--bnk-silver)">
              <i class="fas fa-pen-alt text-4xl mb-4 block"></i>
              아직 등록된 포스트가 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section class="py-20 bnk-gradient relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 opacity-15" style="background:var(--bnk-gold)"></div>
        </div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <i class="fas fa-hands-helping text-4xl mb-6" style="color:var(--bnk-gold)"></i>
          <h2 class="text-3xl md:text-4xl font-black text-white mb-4">함께 만드는 디지털 세상</h2>
          <p class="text-red-100 text-lg mb-8">
            우리의 전문성이 누군가에게 희망이 됩니다.<br/>BNK 재능기부봉사단 디지털IT팀과 함께해 주세요.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="/contact" class="btn-bnk-gold px-8 py-4 rounded-full font-bold text-sm inline-flex items-center gap-2">
              <i class="fas fa-envelope"></i>봉사 신청하기
            </a>
            <a href="/about" class="btn-bnk-outline px-8 py-4 rounded-full font-bold text-sm inline-flex items-center gap-2">
              <i class="fas fa-book-open"></i>더 알아보기
            </a>
          </div>
        </div>
      </section>
    </div>,
    { title: '홈' }
  )
})

// ══════════════════════════════════════════════════════════════
// ─── 소개 페이지 ─────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/about', (c) => {
  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="font-semibold text-sm mb-2" style="color:var(--bnk-gold)">About Us</p>
          <h1 class="text-4xl font-black mb-4">봉사단 소개</h1>
          <p class="text-red-100 text-lg">BNK부산은행 재능기부봉사단 디지털IT팀을 소개합니다</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* 미션 & 비전 */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="w-14 h-14 bnk-gradient rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-bullseye text-white text-2xl"></i>
            </div>
            <h2 class="text-2xl font-black mb-4" style="color:var(--bnk-dark-gray)">미션</h2>
            <p class="leading-relaxed" style="color:var(--bnk-dark-gray)">
              BNK부산은행 임직원의 디지털·IT 전문 역량을 활용하여 디지털 소외계층에게 실질적이고 지속적인 도움을 제공합니다.
              디지털 기술로 지역사회의 격차를 해소하고, 모두가 균등한 기회를 누릴 수 있는 따뜻한 세상을 만들어 갑니다.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="w-14 h-14 bnk-gold-gradient rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-eye text-white text-2xl"></i>
            </div>
            <h2 class="text-2xl font-black mb-4" style="color:var(--bnk-dark-gray)">비전</h2>
            <p class="leading-relaxed" style="color:var(--bnk-dark-gray)">
              "디지털로 하나되는 부산" — 지역 내 모든 시민이 디지털 기술의 혜택을 누릴 수 있도록,
              2030년까지 10,000명 이상을 교육하고 지원하는 부산 최고의 디지털 재능기부 봉사단이 되겠습니다.
            </p>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div class="mb-20">
          <div class="text-center mb-12">
            <p class="section-label mb-2">Core Values</p>
            <h2 class="text-3xl font-black mb-3" style="color:var(--bnk-dark-gray)">핵심 가치</h2>
            <p style="color:var(--bnk-silver)">우리가 봉사하는 이유와 방식</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'fa-heart',         bg: '#FFF0F0', iconColor: 'var(--bnk-red)',      title: '진심',  desc: '진심을 담은 봉사로 수혜자에게 실질적인 변화를' },
              { icon: 'fa-lightbulb',     bg: '#FFF8EF', iconColor: 'var(--bnk-gold)',     title: '전문성', desc: 'IT 전문 지식으로 최고 수준의 서비스를' },
              { icon: 'fa-hands-helping', bg: '#F5F2EF', iconColor: 'var(--bnk-dark-gray)',title: '협력',  desc: '단원 간 협력과 지역사회와의 연대로' },
              { icon: 'fa-sync',          bg: '#F9F5F2', iconColor: 'var(--bnk-dark-red)', title: '지속성', desc: '일회성이 아닌 지속적인 관계와 지원을' },
            ].map(v => (
              <div class="bg-white rounded-2xl p-6 text-center card-hover shadow-sm border border-gray-100">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={`background:${v.bg}`}>
                  <i class={`fas ${v.icon} text-2xl`} style={`color:${v.iconColor}`}></i>
                </div>
                <h3 class="font-black mb-2" style="color:var(--bnk-dark-gray)">{v.title}</h3>
                <p class="text-xs leading-relaxed" style="color:var(--bnk-silver)">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 협력 기관 */}
        <div>
          <div class="text-center mb-12">
            <p class="section-label mb-2">Partners</p>
            <h2 class="text-3xl font-black mb-3" style="color:var(--bnk-dark-gray)">협력 기관</h2>
            <p style="color:var(--bnk-silver)">함께 봉사하는 파트너들</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['부산시 사회복지관', '부산 노인복지관', '지역아동센터', '다문화가족지원센터', '부산 장애인복지관', '청소년문화센터', '부산 소셜벤처', '부산교육청'].map(org => (
              <div class="bg-white border border-gray-100 rounded-xl p-4 text-center text-sm font-medium card-hover shadow-sm transition-all"
                style="color:var(--bnk-dark-gray)"
                onmouseover={`this.style.borderColor='var(--bnk-red)';this.style.color='var(--bnk-dark-red)'`}
                onmouseout={`this.style.borderColor='#f3f4f6';this.style.color='var(--bnk-dark-gray)'`}>
                <i class="fas fa-building mb-2 block" style="color:var(--bnk-red)"></i>{org}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    { title: '소개' }
  )
})

// ══════════════════════════════════════════════════════════════
// ─── 활동 내역 (DB 연동) ──────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/activities', async (c) => {
  const db = c.env.DB
  const rows = await db.prepare('SELECT * FROM activities WHERE published=1 ORDER BY date DESC').all()
  const [actCount, benefCount, hoursCount] = await Promise.all([
    db.prepare('SELECT COUNT(*) as c FROM activities WHERE published=1').first<{c:number}>(),
    db.prepare('SELECT SUM(beneficiaries) as s FROM activities WHERE published=1').first<{s:number}>(),
    db.prepare('SELECT SUM(hours) as s FROM activities WHERE published=1').first<{s:number}>(),
  ])
  const locCount = await db.prepare('SELECT COUNT(DISTINCT location) as c FROM activities WHERE published=1').first<{c:number}>()

  const colorMap: Record<string, string> = {
    '디지털 교육': 'tag-red',
    'IT 장비 지원': 'tag-gold',
    '보안 교육': 'tag-gray',
    '기타': 'tag-gray',
  }
  const iconMap: Record<string, string> = {
    '디지털 교육': 'fa-chalkboard-teacher',
    'IT 장비 지원': 'fa-tools',
    '보안 교육': 'fa-shield-alt',
    '기타': 'fa-star',
  }
  const iconColorMap: Record<string, string> = {
    '디지털 교육': 'var(--bnk-dark-red)',
    'IT 장비 지원': 'var(--bnk-gold)',
    '보안 교육': 'var(--bnk-dark-gray)',
    '기타': 'var(--bnk-silver)',
  }

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="font-semibold text-sm mb-2" style="color:var(--bnk-gold)">Activities</p>
          <h1 class="text-4xl font-black mb-4">활동 내역</h1>
          <p class="text-red-100 text-lg">우리가 만들어 온 따뜻한 순간들</p>
        </div>
      </div>

      {/* 통계 바 */}
      <div class="bg-white border-b border-gray-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: 'fa-calendar-check', value: `${actCount?.c ?? 0}+`,                          label: '총 봉사 횟수', color: 'var(--bnk-dark-red)' },
              { icon: 'fa-users',          value: `${(benefCount?.s ?? 0).toLocaleString()}+`,     label: '수혜자 인원',  color: 'var(--bnk-red)' },
              { icon: 'fa-clock',          value: `${(hoursCount?.s ?? 0).toLocaleString()}+`,     label: '총 봉사 시간', color: 'var(--bnk-gold)' },
              { icon: 'fa-map-marker-alt', value: `${locCount?.c ?? 0}+`,                          label: '활동 기관 수', color: 'var(--bnk-dark-gray)' },
            ].map(s => (
              <div>
                <i class={`fas ${s.icon} text-2xl mb-2`} style={`color:${s.color}`}></i>
                <div class="text-2xl font-black" style={`color:${s.color}`}>{s.value}</div>
                <div class="text-xs" style="color:var(--bnk-silver)">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="space-y-6">
          {(rows.results as any[]).map(act => (
            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 card-hover">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-shrink-0">
                  <div class={`w-16 h-16 ${colorMap[act.category] || 'tag-gray'} rounded-2xl flex items-center justify-center`}>
                    <i class={`fas ${iconMap[act.category] || 'fa-star'} text-2xl`}
                      style={`color:${iconColorMap[act.category] || 'var(--bnk-silver)'}`}></i>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-3 mb-2">
                    <span class={`${colorMap[act.category] || 'tag-gray'} text-xs font-bold px-3 py-1 rounded-full`}>{act.category}</span>
                    <span class="text-sm" style="color:var(--bnk-silver)"><i class="fas fa-calendar mr-1"></i>{act.date}</span>
                    <span class="text-sm" style="color:var(--bnk-silver)"><i class="fas fa-map-marker-alt mr-1"></i>{act.location}</span>
                  </div>
                  <h3 class="text-xl font-black mb-2" style="color:var(--bnk-dark-gray)">{act.title}</h3>
                  <p class="text-sm leading-relaxed mb-4" style="color:var(--bnk-silver)">{act.description}</p>
                  <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-1 tag-red text-xs font-medium px-3 py-1.5 rounded-full">
                      <i class="fas fa-user-tie"></i> 봉사단원 {act.participants}명
                    </div>
                    <div class="flex items-center gap-1 tag-gold text-xs font-medium px-3 py-1.5 rounded-full">
                      <i class="fas fa-heart"></i> 수혜자 {act.beneficiaries}명
                    </div>
                    <div class="flex items-center gap-1 tag-gray text-xs font-medium px-3 py-1.5 rounded-full">
                      <i class="fas fa-clock"></i> {act.hours}시간
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(rows.results as any[]).length === 0 && (
            <div class="text-center py-20" style="color:var(--bnk-silver)">
              <i class="fas fa-calendar-times text-4xl mb-4 block"></i>
              아직 등록된 활동이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>,
    { title: '활동 내역' }
  )
})

// ══════════════════════════════════════════════════════════════
// ─── 블로그 (DB 연동) ─────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/blog', async (c) => {
  const posts = await c.env.DB.prepare('SELECT * FROM posts WHERE published=1 ORDER BY created_at DESC').all()
  const featured = (posts.results as any[])[0]
  const rest = (posts.results as any[]).slice(1)

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="font-semibold text-sm mb-2" style="color:var(--bnk-gold)">Blog & Stories</p>
          <h1 class="text-4xl font-black mb-4">블로그</h1>
          <p class="text-red-100 text-lg">활동 이야기, IT 팁, 봉사 소식을 전합니다</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-16">
        {/* Featured Post */}
        {featured && (
          <div class="bnk-gradient rounded-3xl p-8 md:p-12 mb-12 text-white overflow-hidden relative">
            <div class="absolute right-8 top-1/2 -translate-y-1/2 text-9xl opacity-25">{featured.emoji}</div>
            <div class="relative z-10 max-w-xl">
              <span class="text-xs font-bold px-3 py-1 rounded-full" style="background:var(--bnk-gold);color:#fff">✨ 최신 포스트</span>
              <h2 class="text-2xl md:text-3xl font-black mt-4 mb-3">{featured.title}</h2>
              <p class="text-sm mb-5" style="color:rgba(255,220,200,0.9)">{featured.excerpt || featured.content?.slice(0, 120) + '...'}</p>
              <div class="flex items-center gap-4 text-sm" style="color:rgba(255,200,180,0.8)">
                <span><i class="fas fa-user mr-1"></i>{featured.author}</span>
                <span><i class="fas fa-calendar mr-1"></i>{featured.created_at?.slice(0,10)}</span>
                <span><i class="fas fa-clock mr-1"></i>{featured.read_time}</span>
              </div>
            </div>
          </div>
        )}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post: any) => (
            <div class="blog-card bg-white rounded-2xl overflow-hidden card-hover shadow-sm border border-gray-100">
              <div class="h-48 flex items-center justify-center"
                style="background:linear-gradient(135deg,#FFF5F5,#FFEDEA)">
                <span class="text-7xl">{post.emoji}</span>
              </div>
              <div class="p-6">
                <span class="tag-red text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
                <h3 class="font-bold mt-3 mb-2 leading-snug" style="color:var(--bnk-dark-gray)">{post.title}</h3>
                <p class="text-sm leading-relaxed mb-4" style="color:var(--bnk-silver)">
                  {post.excerpt || post.content?.slice(0, 100) + '...'}
                </p>
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div class="flex items-center text-xs gap-2" style="color:var(--bnk-silver)">
                    <div class="w-6 h-6 rounded-full bnk-gradient flex items-center justify-center">
                      <i class="fas fa-user text-white text-xs"></i>
                    </div>
                    {post.author}
                  </div>
                  <div class="text-xs" style="color:var(--bnk-light-gray)">{post.created_at?.slice(0,10)} · {post.read_time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(posts.results as any[]).length === 0 && (
          <div class="text-center py-20" style="color:var(--bnk-silver)">
            <i class="fas fa-pen-alt text-4xl mb-4 block"></i>
            아직 등록된 포스트가 없습니다.
          </div>
        )}
      </div>
    </div>,
    { title: '블로그' }
  )
})

// ══════════════════════════════════════════════════════════════
// ─── 갤러리 (DB 연동) ─────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/gallery', async (c) => {
  const photos = await c.env.DB.prepare('SELECT * FROM gallery WHERE published=1 ORDER BY sort_order ASC').all()
  // BNK 계열 웜톤 그라데이션
  const bgGradients = [
    'from-red-50 to-red-100',
    'from-amber-50 to-yellow-100',
    'from-orange-50 to-amber-100',
    'from-rose-50 to-rose-100',
    'from-stone-50 to-stone-100',
    'from-red-100 to-orange-100',
    'from-amber-100 to-yellow-50',
    'from-rose-100 to-red-50',
  ]

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="font-semibold text-sm mb-2" style="color:var(--bnk-gold)">Gallery</p>
          <h1 class="text-4xl font-black mb-4">갤러리</h1>
          <p class="text-red-100 text-lg">봉사 현장의 소중한 순간들을 담았습니다</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(photos.results as any[]).map((photo, i) => (
            <div class="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer aspect-square flex flex-col items-center justify-center">
              <div class={`absolute inset-0 bg-gradient-to-br ${bgGradients[i % bgGradients.length]}`}></div>
              <div class="relative z-10 text-center p-4">
                <span class="text-5xl block mb-2">{photo.emoji}</span>
                <div class="text-xs font-semibold leading-tight" style="color:var(--bnk-dark-gray)">{photo.title}</div>
                <div class="text-xs mt-1" style="color:var(--bnk-silver)">{photo.date}</div>
              </div>
              <div class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center"
                style="background-color:rgba(139,3,4,0);"
                onmouseover="this.style.backgroundColor='rgba(139,3,4,0.72)'"
                onmouseout="this.style.backgroundColor='rgba(139,3,4,0)'">
                <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                  <i class="fas fa-expand text-2xl mb-2 block"></i>
                  <div class="text-sm font-medium">{photo.title}</div>
                  <div class="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                    style="background:var(--bnk-gold);color:#fff">{photo.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(photos.results as any[]).length === 0 && (
          <div class="text-center py-20" style="color:var(--bnk-silver)">
            <i class="fas fa-images text-4xl mb-4 block"></i>
            아직 등록된 갤러리가 없습니다.
          </div>
        )}
      </div>
    </div>,
    { title: '갤러리' }
  )
})

// ══════════════════════════════════════════════════════════════
// ─── 팀 소개 (DB 연동) ────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/team', async (c) => {
  const members = await c.env.DB.prepare('SELECT * FROM members WHERE published=1 ORDER BY sort_order ASC').all()

  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="font-semibold text-sm mb-2" style="color:var(--bnk-gold)">Our Team</p>
          <h1 class="text-4xl font-black mb-4">팀 소개</h1>
          <p class="text-red-100 text-lg">전문성과 열정을 가진 디지털 봉사단원들을 소개합니다</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {(members.results as any[]).map(m => {
            const skills: string[] = (() => { try { return JSON.parse(m.skills || '[]') } catch { return [] } })()
            return (
              <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                <div class={`bg-gradient-to-br ${m.color} p-8 text-center`}>
                  <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class={`fas ${m.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 class="font-black text-white text-lg">{m.name}</h3>
                  <p class="text-white text-xs mt-1" style="opacity:0.85">{m.role}</p>
                </div>
                <div class="p-5">
                  <p class="text-xs leading-relaxed mb-3" style="color:var(--bnk-silver)">{m.description}</p>
                  <div class="flex flex-wrap gap-1 mb-3">
                    {skills.map((sk: string) => (
                      <span class="tag-red text-xs px-2 py-0.5 rounded-full font-medium">{sk}</span>
                    ))}
                  </div>
                  <div class="flex items-center text-xs" style="color:var(--bnk-light-gray)">
                    <i class="fas fa-star mr-1" style="color:var(--bnk-gold)"></i> 봉사 {m.years}년째
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {(members.results as any[]).length === 0 && (
          <div class="text-center py-12" style="color:var(--bnk-silver)">
            <i class="fas fa-users text-4xl mb-4 block"></i>
            아직 등록된 팀원이 없습니다.
          </div>
        )}

        {/* Join CTA */}
        <div class="bnk-gradient rounded-3xl p-8 md:p-12 text-center text-white">
          <i class="fas fa-user-plus text-4xl mb-4" style="color:var(--bnk-gold)"></i>
          <h2 class="text-2xl md:text-3xl font-black mb-3">함께하고 싶으신가요?</h2>
          <p class="mb-6" style="color:rgba(255,220,200,0.9)">BNK부산은행 임직원이라면 누구든지 참여 가능합니다.</p>
          <a href="/contact" class="btn-bnk-gold inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm">
            <i class="fas fa-envelope"></i>봉사단 참여 신청
          </a>
        </div>
      </div>
    </div>,
    { title: '팀 소개' }
  )
})

// ══════════════════════════════════════════════════════════════
// ─── 문의하기 ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
app.get('/contact', (c) => {
  return c.render(
    <div>
      <div class="bnk-gradient py-20">
        <div class="max-w-7xl mx-auto px-6 text-white">
          <p class="font-semibold text-sm mb-2" style="color:var(--bnk-gold)">Contact Us</p>
          <h1 class="text-4xl font-black mb-4">문의하기</h1>
          <p class="text-red-100 text-lg">봉사 신청, 협력 제안, 기타 문의를 남겨주세요</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 연락처 정보 */}
          <div class="space-y-4">
            <h2 class="text-xl font-black mb-6" style="color:var(--bnk-dark-gray)">연락처 정보</h2>
            {[
              { icon: 'fa-map-marker-alt', title: '주소',    value: '부산광역시 부산진구 중앙대로\nBNK부산은행 본점',  bg: '#FFF0F0', color: 'var(--bnk-dark-red)' },
              { icon: 'fa-envelope',       title: '이메일',  value: 'digital.it@bnkfs.com',                           bg: '#FFF8EF', color: 'var(--bnk-gold)' },
              { icon: 'fa-phone',          title: '전화',    value: '051-XXX-XXXX',                                   bg: '#F5F2EF', color: 'var(--bnk-dark-gray)' },
              { icon: 'fa-clock',          title: '운영 시간',value: '평일 09:00 - 18:00',                            bg: '#F9F5F2', color: 'var(--bnk-dark-gray)' },
            ].map(info => (
              <div class="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={`background:${info.bg}`}>
                  <i class={`fas ${info.icon}`} style={`color:${info.color}`}></i>
                </div>
                <div>
                  <div class="font-semibold text-sm" style="color:var(--bnk-dark-gray)">{info.title}</div>
                  <div class="text-sm whitespace-pre-line" style="color:var(--bnk-silver)">{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 문의 폼 */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 class="text-xl font-black mb-6" style="color:var(--bnk-dark-gray)">문의 및 봉사 신청</h2>
              <form class="space-y-5" action="/api/contact" method="POST">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-semibold mb-2" style="color:var(--bnk-dark-gray)">이름 *</label>
                    <input type="text" name="name" placeholder="홍길동" required
                      class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"/>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold mb-2" style="color:var(--bnk-dark-gray)">연락처 *</label>
                    <input type="tel" name="phone" placeholder="010-0000-0000" required
                      class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"/>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2" style="color:var(--bnk-dark-gray)">이메일</label>
                  <input type="email" name="email" placeholder="example@email.com"
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"/>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2" style="color:var(--bnk-dark-gray)">문의 유형 *</label>
                  <select name="type" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
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
                  <label class="block text-sm font-semibold mb-2" style="color:var(--bnk-dark-gray)">소속 기관명</label>
                  <input type="text" name="org" placeholder="예: ○○ 노인복지관"
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"/>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2" style="color:var(--bnk-dark-gray)">문의 내용 *</label>
                  <textarea name="message" rows={5} required placeholder="문의 내용을 작성해 주세요"
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none"></textarea>
                </div>
                <button type="submit" class="w-full bnk-gradient text-white py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
                  <i class="fas fa-paper-plane"></i>문의 보내기
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

// ─── 문의 접수 API (공개) ─────────────────────────────────────
app.post('/api/contact', async (c) => {
  const body = await c.req.parseBody() as any
  await c.env.DB.prepare(`
    INSERT INTO contacts (name, phone, email, type, org, message, status)
    VALUES (?, ?, ?, ?, ?, ?, 'new')
  `).bind(body.name, body.phone, body.email || '', body.type, body.org || '', body.message).run()

  return c.html(`
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-family:'Noto Sans KR',sans-serif;">
      <div style="background:white;padding:3rem;border-radius:1.5rem;text-align:center;max-width:480px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="font-size:4rem;margin-bottom:1rem;">✅</div>
        <h2 style="color:var(--bnk-dark-red,#8B0304);font-size:1.5rem;font-weight:900;margin-bottom:0.5rem;">문의가 접수되었습니다!</h2>
        <p style="color:#6b7280;font-size:0.9rem;line-height:1.6;margin-bottom:1.5rem;">
          <strong>${body.name}</strong>님의 문의를 잘 받았습니다.<br/>담당자 확인 후 빠른 시일 내에 연락드리겠습니다.
        </p>
        <a href="/" style="display:inline-block;background:linear-gradient(135deg,#8B0304,#D7191F);color:white;padding:0.75rem 2rem;border-radius:9999px;font-weight:700;text-decoration:none;font-size:0.875rem;">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  `)
})

export default app
