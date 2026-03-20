import { Hono } from 'hono'
import { sha256, createToken, verifyToken, getTokenFromCookie, requireAuth } from '../utils/auth'
import { adminLayout, badge } from '../utils/adminLayout'

const admin = new Hono<{ Bindings: any; Variables: any }>()

// ─── 로그인 페이지 (공개 - 인증 불필요) ──────────────────────
admin.get('/login', (c) => {
  const error = c.req.query('error')
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>관리자 로그인 | BNK CMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet"/>
  <style>* { font-family: 'Noto Sans KR', sans-serif; }</style>
</head>
<body class="min-h-screen flex items-center justify-center" style="background:linear-gradient(135deg,#001a40 0%,#003d82 60%,#0066cc 100%)">
  <div class="w-full max-w-md mx-4">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-laptop-code text-white text-2xl"></i>
      </div>
      <h1 class="text-white font-black text-2xl">BNK CMS</h1>
      <p class="text-blue-200 text-sm mt-1">콘텐츠 관리 시스템</p>
    </div>
    <div class="bg-white rounded-3xl shadow-2xl p-8">
      <h2 class="text-xl font-black text-gray-800 mb-6 text-center">관리자 로그인</h2>
      ${error ? `<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
        <i class="fas fa-exclamation-circle"></i> 아이디 또는 비밀번호가 올바르지 않습니다.
      </div>` : ''}
      <form action="/admin/login" method="POST" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">아이디</label>
          <div class="relative">
            <i class="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" name="username" placeholder="admin" required
              class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="password" name="password" placeholder="••••••••" required
              class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <button type="submit"
          class="w-full py-3.5 rounded-xl font-bold text-white text-sm mt-2 transition-all hover:opacity-90"
          style="background:linear-gradient(135deg,#003d82,#0066cc)">
          <i class="fas fa-sign-in-alt mr-2"></i>로그인
        </button>
      </form>
      <div class="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-blue-600">
        <i class="fas fa-info-circle mr-1"></i>
        기본 계정: <strong>admin</strong> / <strong>bnk2024!</strong>
      </div>
    </div>
    <p class="text-center text-blue-300 text-xs mt-6">© 2024 BNK부산은행 재능기부봉사단 디지털IT팀</p>
  </div>
</body>
</html>`)
})

admin.get('/logout', (c) => {
  c.header('Set-Cookie', 'admin_token=; Path=/; Max-Age=0')
  return c.redirect('/admin/login')
})

// ─── 인증 미들웨어 적용 ──────────────────────────────────────
admin.use('/*', requireAuth)

// ─── 대시보드 ─────────────────────────────────────────────────
admin.get('/', async (c) => {
  const db = c.env.DB
  const [actCount, postCount, memberCount, galleryCount, newContacts, totalBenef, totalHours] = await Promise.all([
    db.prepare('SELECT COUNT(*) as c FROM activities WHERE published=1').first<{c:number}>(),
    db.prepare('SELECT COUNT(*) as c FROM posts WHERE published=1').first<{c:number}>(),
    db.prepare('SELECT COUNT(*) as c FROM members WHERE published=1').first<{c:number}>(),
    db.prepare('SELECT COUNT(*) as c FROM gallery WHERE published=1').first<{c:number}>(),
    db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status='new'").first<{c:number}>(),
    db.prepare('SELECT SUM(beneficiaries) as s FROM activities').first<{s:number}>(),
    db.prepare('SELECT SUM(hours) as s FROM activities').first<{s:number}>(),
  ])
  const recentContacts = await db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5').all()
  const recentActs = await db.prepare('SELECT * FROM activities ORDER BY created_at DESC LIMIT 4').all()

  const stats = [
    { icon: 'fa-calendar-check', label: '활동 내역', value: actCount?.c ?? 0, color: 'bg-blue-500', link: '/admin/activities' },
    { icon: 'fa-pen-alt', label: '블로그 포스트', value: postCount?.c ?? 0, color: 'bg-purple-500', link: '/admin/posts' },
    { icon: 'fa-users', label: '팀 멤버', value: memberCount?.c ?? 0, color: 'bg-green-500', link: '/admin/members' },
    { icon: 'fa-envelope', label: '새 문의', value: newContacts?.c ?? 0, color: 'bg-orange-500', link: '/admin/contacts' },
  ]

  const content = `
    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      ${stats.map(s => `
        <a href="${s.link}" class="bg-white rounded-2xl p-5 card-hover shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 ${s.color} bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fas ${s.icon} ${s.color.replace('bg-', 'text-')} text-xl"></i>
          </div>
          <div>
            <div class="text-2xl font-black text-gray-900">${s.value}</div>
            <div class="text-gray-500 text-xs">${s.label}</div>
          </div>
        </a>`).join('')}
    </div>

    <!-- 봉사 집계 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 text-white flex items-center gap-4">
        <div class="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <i class="fas fa-heart text-orange-300 text-2xl"></i>
        </div>
        <div>
          <div class="text-3xl font-black">${(totalBenef?.s ?? 0).toLocaleString()}명</div>
          <div class="text-blue-200 text-sm">누적 봉사 수혜자</div>
        </div>
      </div>
      <div class="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-6 text-white flex items-center gap-4">
        <div class="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <i class="fas fa-clock text-white text-2xl"></i>
        </div>
        <div>
          <div class="text-3xl font-black">${(totalHours?.s ?? 0).toLocaleString()}시간</div>
          <div class="text-orange-100 text-sm">누적 봉사 시간</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 최근 활동 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="font-black text-gray-800">최근 활동 내역</h2>
          <a href="/admin/activities" class="text-blue-600 text-xs font-medium hover:text-blue-800">전체 보기 →</a>
        </div>
        <div class="divide-y divide-gray-50">
          ${(recentActs.results as any[]).map(a => `
            <div class="px-6 py-3 flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-gray-800 truncate max-w-xs">${a.title}</div>
                <div class="text-xs text-gray-400">${a.date} · ${a.category}</div>
              </div>
              <a href="/admin/activities/${a.id}/edit" class="text-blue-500 hover:text-blue-700 text-xs">편집</a>
            </div>`).join('')}
        </div>
      </div>

      <!-- 최근 문의 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="font-black text-gray-800">최근 문의</h2>
          <a href="/admin/contacts" class="text-blue-600 text-xs font-medium hover:text-blue-800">전체 보기 →</a>
        </div>
        <div class="divide-y divide-gray-50">
          ${(recentContacts.results as any[]).length === 0
            ? '<div class="px-6 py-8 text-center text-gray-400 text-sm">문의가 없습니다.</div>'
            : (recentContacts.results as any[]).map(ct => `
              <div class="px-6 py-3 flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-gray-800">${ct.name} <span class="text-xs text-gray-400">(${ct.type})</span></div>
                  <div class="text-xs text-gray-400">${ct.created_at?.slice(0,10) ?? ''}</div>
                </div>
                ${ct.status === 'new'
                  ? '<span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>'
                  : '<span class="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">확인</span>'}
              </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- 빠른 바로가기 -->
    <div class="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 class="font-black text-gray-800 mb-4">빠른 추가</h2>
      <div class="flex flex-wrap gap-3">
        <a href="/admin/activities/new" class="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          <i class="fas fa-plus"></i> 활동 추가
        </a>
        <a href="/admin/posts/new" class="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <i class="fas fa-plus"></i> 블로그 작성
        </a>
        <a href="/admin/members/new" class="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
          <i class="fas fa-plus"></i> 팀원 추가
        </a>
        <a href="/admin/gallery/new" class="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
          <i class="fas fa-plus"></i> 갤러리 추가
        </a>
      </div>
    </div>`

  return c.html(adminLayout('대시보드', content, 'dashboard'))
})

// ══════════════════════════════════════════════════════════════
// ─── 활동 내역 관리 ───────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const categoryColors: Record<string, string> = {
  '디지털 교육': 'blue', 'IT 장비 지원': 'orange', '보안 교육': 'green', '기타': 'gray'
}

admin.get('/activities', async (c) => {
  const db = c.env.DB
  const rows = await db.prepare('SELECT * FROM activities ORDER BY date DESC').all()

  const content = `
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">${rows.results.length}개의 활동 내역</p>
      <a href="/admin/activities/new"
        class="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
        <i class="fas fa-plus"></i> 새 활동 추가
      </a>
    </div>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">날짜</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">카테고리</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">제목</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase hidden md:table-cell">참여/수혜</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">공개</th>
            <th class="text-right px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${(rows.results as any[]).map(a => `
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">${a.date}</td>
              <td class="px-5 py-3.5">${badge(a.category, categoryColors[a.category] || 'gray')}</td>
              <td class="px-5 py-3.5 font-medium text-gray-800 max-w-xs truncate">${a.title}</td>
              <td class="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">
                단원 ${a.participants}명 / 수혜 ${a.beneficiaries}명 / ${a.hours}h
              </td>
              <td class="px-5 py-3.5">
                <button onclick="togglePublish('/api/admin/activities/${a.id}/publish', ${a.published})"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${a.published ? 'bg-green-500' : 'bg-gray-300'}">
                  <span class="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${a.published ? 'translate-x-4' : 'translate-x-1'}"></span>
                </button>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <a href="/admin/activities/${a.id}/edit"
                    class="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    <i class="fas fa-edit mr-1"></i>편집
                  </a>
                  <button onclick="confirmDelete('/api/admin/activities/${a.id}', '${a.title.replace(/'/g, "\\'")}')"
                    class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
  return c.html(adminLayout('활동 내역 관리', content, 'activities'))
})

function activityForm(action: string, method: string = 'POST', values: any = {}): string {
  const categories = ['디지털 교육', 'IT 장비 지원', '보안 교육', '기타']
  return `
    <div class="max-w-3xl">
      <a href="/admin/activities" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
        <i class="fas fa-arrow-left"></i> 목록으로
      </a>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form action="${action}" method="POST" data-ajax data-method="${method}" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">날짜 *</label>
              <input type="text" name="date" value="${values.date || ''}" placeholder="예: 2024.11.20" required
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">카테고리 *</label>
              <select name="category" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${categories.map(cat => `<option value="${cat}" ${values.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">제목 *</label>
            <input type="text" name="title" value="${values.title || ''}" required placeholder="활동 제목"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">장소 *</label>
            <input type="text" name="location" value="${values.location || ''}" required placeholder="예: 부산 동구 노인복지관"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">봉사단원 (명)</label>
              <input type="number" name="participants" value="${values.participants || 0}" min="0"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">수혜자 (명)</label>
              <input type="number" name="beneficiaries" value="${values.beneficiaries || 0}" min="0"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">봉사 시간</label>
              <input type="number" name="hours" value="${values.hours || 0}" min="0"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">내용 설명</label>
            <textarea name="description" rows="5" placeholder="활동 내용을 자세히 적어주세요"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none">${values.description || ''}</textarea>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="published" id="pub" value="1" ${values.published !== 0 ? 'checked' : ''} class="w-4 h-4 rounded"/>
            <label for="pub" class="text-sm text-gray-700 font-medium">공개 여부</label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <i class="fas fa-save mr-2"></i>저장
            </button>
            <a href="/admin/activities" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">취소</a>
          </div>
        </form>
      </div>
    </div>`
}

admin.get('/activities/new', (c) => c.html(adminLayout('활동 추가', activityForm('/api/admin/activities', 'POST'), 'activities')))
admin.get('/activities/:id/edit', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM activities WHERE id=?').bind(c.req.param('id')).first()
  if (!row) return c.redirect('/admin/activities')
  return c.html(adminLayout('활동 편집', activityForm(`/api/admin/activities/${c.req.param('id')}`, 'PUT', row), 'activities'))
})

// ══════════════════════════════════════════════════════════════
// ─── 블로그 관리 ──────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
admin.get('/posts', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all()
  const content = `
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">${rows.results.length}개의 포스트</p>
      <a href="/admin/posts/new"
        class="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">
        <i class="fas fa-plus"></i> 새 포스트 작성
      </a>
    </div>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">이모지</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">태그</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">제목</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase hidden md:table-cell">작성자</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase hidden md:table-cell">날짜</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">공개</th>
            <th class="text-right px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${(rows.results as any[]).map(p => `
            <tr class="hover:bg-gray-50">
              <td class="px-5 py-3.5 text-2xl">${p.emoji}</td>
              <td class="px-5 py-3.5">${badge(p.tag, 'purple')}</td>
              <td class="px-5 py-3.5 font-medium text-gray-800 max-w-xs truncate">${p.title}</td>
              <td class="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">${p.author}</td>
              <td class="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">${p.created_at?.slice(0,10) ?? ''}</td>
              <td class="px-5 py-3.5">
                <button onclick="togglePublish('/api/admin/posts/${p.id}/publish', ${p.published})"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.published ? 'bg-green-500' : 'bg-gray-300'}">
                  <span class="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${p.published ? 'translate-x-4' : 'translate-x-1'}"></span>
                </button>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <a href="/admin/posts/${p.id}/edit" class="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-lg text-xs font-medium"><i class="fas fa-edit mr-1"></i>편집</a>
                  <button onclick="confirmDelete('/api/admin/posts/${p.id}', '${p.title.replace(/'/g, "\\'")}')"
                    class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
  return c.html(adminLayout('블로그 관리', content, 'posts'))
})

function postForm(action: string, method: string, values: any = {}): string {
  const tags = ['활동 후기', 'IT 팁', '소식', '디지털 교육', '안내']
  return `
    <div class="max-w-4xl">
      <a href="/admin/posts" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
        <i class="fas fa-arrow-left"></i> 목록으로
      </a>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form action="${action}" method="POST" data-ajax data-method="${method}" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">이모지</label>
              <input type="text" name="emoji" value="${values.emoji || '📝'}" placeholder="📝"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">태그 *</label>
              <select name="tag" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                ${tags.map(t => `<option value="${t}" ${values.tag === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">읽기 시간</label>
              <input type="text" name="read_time" value="${values.read_time || '3분'}" placeholder="3분"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">제목 *</label>
            <input type="text" name="title" value="${values.title || ''}" required placeholder="포스트 제목"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">작성자 *</label>
            <input type="text" name="author" value="${values.author || ''}" required placeholder="홍길동"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">요약문</label>
            <input type="text" name="excerpt" value="${values.excerpt || ''}" placeholder="목록에 표시될 짧은 요약"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">본문 *</label>
            <textarea name="content" rows="10" required placeholder="포스트 내용을 입력하세요"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none">${values.content || ''}</textarea>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="published" id="pub" value="1" ${values.published !== 0 ? 'checked' : ''} class="w-4 h-4 rounded"/>
            <label for="pub" class="text-sm text-gray-700 font-medium">공개 여부</label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <i class="fas fa-save mr-2"></i>저장
            </button>
            <a href="/admin/posts" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">취소</a>
          </div>
        </form>
      </div>
    </div>`
}

admin.get('/posts/new', (c) => c.html(adminLayout('포스트 작성', postForm('/api/admin/posts', 'POST'), 'posts')))
admin.get('/posts/:id/edit', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM posts WHERE id=?').bind(c.req.param('id')).first()
  if (!row) return c.redirect('/admin/posts')
  return c.html(adminLayout('포스트 편집', postForm(`/api/admin/posts/${c.req.param('id')}`, 'PUT', row), 'posts'))
})

// ══════════════════════════════════════════════════════════════
// ─── 팀원 관리 ────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
admin.get('/members', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM members ORDER BY sort_order ASC').all()
  const content = `
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">${rows.results.length}명의 팀원</p>
      <a href="/admin/members/new"
        class="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors">
        <i class="fas fa-plus"></i> 팀원 추가
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      ${(rows.results as any[]).map(m => {
        const skills = (() => { try { return JSON.parse(m.skills) } catch { return [] } })()
        return `
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
            <div class="bg-gradient-to-r ${m.color} px-5 py-4 flex items-center gap-3">
              <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i class="fas ${m.icon} text-white"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white font-bold truncate">${m.name}</div>
                <div class="text-white text-opacity-80 text-xs truncate">${m.role}</div>
              </div>
              <div class="flex gap-2">
                <button onclick="togglePublish('/api/admin/members/${m.id}/publish', ${m.published})"
                  class="w-7 h-7 rounded-full flex items-center justify-center ${m.published ? 'bg-green-400' : 'bg-white bg-opacity-30'}">
                  <i class="fas ${m.published ? 'fa-eye' : 'fa-eye-slash'} text-white text-xs"></i>
                </button>
              </div>
            </div>
            <div class="p-4">
              <p class="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">${m.description || ''}</p>
              <div class="flex flex-wrap gap-1 mb-3">
                ${skills.map((s: string) => `<span class="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">${s}</span>`).join('')}
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <span class="text-gray-400 text-xs">봉사 ${m.years}년</span>
                <div class="flex gap-2">
                  <a href="/admin/members/${m.id}/edit" class="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-lg text-xs font-medium">
                    <i class="fas fa-edit mr-1"></i>편집
                  </a>
                  <button onclick="confirmDelete('/api/admin/members/${m.id}', '${m.name}')"
                    class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg text-xs font-medium">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`
      }).join('')}
    </div>`
  return c.html(adminLayout('팀원 관리', content, 'members'))
})

function memberForm(action: string, method: string, values: any = {}): string {
  const colorOptions = [
    { value: 'from-blue-600 to-blue-800', label: '파랑' },
    { value: 'from-purple-600 to-purple-800', label: '보라' },
    { value: 'from-green-600 to-green-800', label: '초록' },
    { value: 'from-red-600 to-red-800', label: '빨강' },
    { value: 'from-orange-600 to-orange-800', label: '주황' },
    { value: 'from-pink-600 to-pink-800', label: '핑크' },
    { value: 'from-cyan-600 to-cyan-800', label: '하늘' },
    { value: 'from-teal-600 to-teal-800', label: '청록' },
  ]
  const skillsStr = (() => { try { return JSON.parse(values.skills || '[]').join(', ') } catch { return '' } })()
  return `
    <div class="max-w-2xl">
      <a href="/admin/members" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
        <i class="fas fa-arrow-left"></i> 목록으로
      </a>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form action="${action}" method="POST" data-ajax data-method="${method}" class="space-y-5">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">이름 *</label>
              <input type="text" name="name" value="${values.name || ''}" required
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">봉사 연수</label>
              <input type="number" name="years" value="${values.years || 1}" min="1"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">역할/직책 *</label>
            <input type="text" name="role" value="${values.role || ''}" required placeholder="예: 팀장 · 네트워크 전문가"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">아이콘 (FontAwesome)</label>
              <input type="text" name="icon" value="${values.icon || 'fa-user'}" placeholder="fa-user"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">카드 색상</label>
              <select name="color" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                ${colorOptions.map(co => `<option value="${co.value}" ${values.color === co.value ? 'selected' : ''}>${co.label}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">전문 기술 (쉼표로 구분)</label>
            <input type="text" name="skills_text" value="${skillsStr}" placeholder="네트워크, 보안, 클라우드"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">소개글</label>
            <textarea name="description" rows="4" placeholder="팀원 소개글"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none">${values.description || ''}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">정렬 순서</label>
              <input type="number" name="sort_order" value="${values.sort_order || 0}" min="0"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div class="flex items-end pb-2.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" value="1" ${values.published !== 0 ? 'checked' : ''} class="w-4 h-4 rounded"/>
                <span class="text-sm text-gray-700 font-medium">공개 여부</span>
              </label>
            </div>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <i class="fas fa-save mr-2"></i>저장
            </button>
            <a href="/admin/members" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">취소</a>
          </div>
        </form>
      </div>
    </div>`
}

admin.get('/members/new', (c) => c.html(adminLayout('팀원 추가', memberForm('/api/admin/members', 'POST'), 'members')))
admin.get('/members/:id/edit', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM members WHERE id=?').bind(c.req.param('id')).first()
  if (!row) return c.redirect('/admin/members')
  return c.html(adminLayout('팀원 편집', memberForm(`/api/admin/members/${c.req.param('id')}`, 'PUT', row), 'members'))
})

// ══════════════════════════════════════════════════════════════
// ─── 갤러리 관리 ──────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
admin.get('/gallery', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM gallery ORDER BY sort_order ASC').all()
  const content = `
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">${rows.results.length}개의 갤러리 항목</p>
      <a href="/admin/gallery/new"
        class="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
        <i class="fas fa-plus"></i> 항목 추가
      </a>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      ${(rows.results as any[]).map(g => `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
          <div class="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-5xl">
            ${g.emoji}
          </div>
          <div class="p-3">
            <div class="font-semibold text-gray-800 text-sm truncate mb-1">${g.title}</div>
            <div class="flex items-center justify-between mb-2">
              ${badge(g.category, 'orange')}
              <span class="text-gray-400 text-xs">${g.date}</span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-100">
              <button onclick="togglePublish('/api/admin/gallery/${g.id}/publish', ${g.published})"
                class="text-xs ${g.published ? 'text-green-600' : 'text-gray-400'}">
                <i class="fas ${g.published ? 'fa-eye' : 'fa-eye-slash'} mr-1"></i>${g.published ? '공개' : '비공개'}
              </button>
              <div class="flex gap-1.5">
                <a href="/admin/gallery/${g.id}/edit" class="text-orange-600 hover:text-orange-800 text-xs"><i class="fas fa-edit"></i></a>
                <button onclick="confirmDelete('/api/admin/gallery/${g.id}', '${g.title.replace(/'/g, "\\'")}')"
                  class="text-red-500 hover:text-red-700 text-xs"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>`).join('')}
    </div>`
  return c.html(adminLayout('갤러리 관리', content, 'gallery'))
})

function galleryForm(action: string, method: string, values: any = {}): string {
  const categories = ['교육', 'IT 지원', '수상', '행사', '협약', '방문', '기타']
  return `
    <div class="max-w-xl">
      <a href="/admin/gallery" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
        <i class="fas fa-arrow-left"></i> 목록으로
      </a>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form action="${action}" method="POST" data-ajax data-method="${method}" class="space-y-5">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">이모지</label>
              <input type="text" name="emoji" value="${values.emoji || '📷'}"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">카테고리 *</label>
              <select name="category" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                ${categories.map(cat => `<option value="${cat}" ${values.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">제목 *</label>
            <input type="text" name="title" value="${values.title || ''}" required placeholder="사진 제목"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">날짜</label>
              <input type="text" name="date" value="${values.date || ''}" placeholder="예: 2024.11"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">정렬 순서</label>
              <input type="number" name="sort_order" value="${values.sort_order || 0}" min="0"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">이미지 URL (선택)</label>
            <input type="url" name="image_url" value="${values.image_url || ''}" placeholder="https://..."
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="published" id="pub" value="1" ${values.published !== 0 ? 'checked' : ''} class="w-4 h-4 rounded"/>
            <label for="pub" class="text-sm text-gray-700 font-medium">공개 여부</label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <i class="fas fa-save mr-2"></i>저장
            </button>
            <a href="/admin/gallery" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">취소</a>
          </div>
        </form>
      </div>
    </div>`
}

admin.get('/gallery/new', (c) => c.html(adminLayout('갤러리 추가', galleryForm('/api/admin/gallery', 'POST'), 'gallery')))
admin.get('/gallery/:id/edit', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM gallery WHERE id=?').bind(c.req.param('id')).first()
  if (!row) return c.redirect('/admin/gallery')
  return c.html(adminLayout('갤러리 편집', galleryForm(`/api/admin/gallery/${c.req.param('id')}`, 'PUT', row), 'gallery'))
})

// ══════════════════════════════════════════════════════════════
// ─── 문의 관리 ────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
admin.get('/contacts', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all()
  const statusMap: Record<string, string> = { new: '신규', confirmed: '확인', replied: '답변완료', closed: '종료' }
  const statusColor: Record<string, string> = { new: 'red', confirmed: 'yellow', replied: 'green', closed: 'gray' }
  const typeMap: Record<string, string> = {
    edu: '디지털 교육', it: 'IT 장비 지원', security: '보안 교육',
    partner: '기관 협력', volunteer: '봉사단 참여', etc: '기타'
  }

  const content = `
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 text-sm">${rows.results.length}개의 문의 · 신규 ${(rows.results as any[]).filter((r: any) => r.status === 'new').length}건</p>
    </div>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">이름</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">유형</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase hidden md:table-cell">연락처</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase hidden lg:table-cell">소속</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">상태</th>
            <th class="text-left px-5 py-3.5 font-bold text-gray-600 text-xs uppercase hidden md:table-cell">접수일</th>
            <th class="text-right px-5 py-3.5 font-bold text-gray-600 text-xs uppercase">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          ${(rows.results as any[]).map(ct => `
            <tr class="hover:bg-gray-50 ${ct.status === 'new' ? 'bg-red-50 bg-opacity-30' : ''}">
              <td class="px-5 py-3.5 font-semibold text-gray-800">${ct.name}</td>
              <td class="px-5 py-3.5">${badge(typeMap[ct.type] || ct.type, 'blue')}</td>
              <td class="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">${ct.phone}</td>
              <td class="px-5 py-3.5 hidden lg:table-cell text-gray-500 text-xs">${ct.org || '-'}</td>
              <td class="px-5 py-3.5">${badge(statusMap[ct.status] || ct.status, statusColor[ct.status] || 'gray')}</td>
              <td class="px-5 py-3.5 hidden md:table-cell text-gray-400 text-xs">${ct.created_at?.slice(0,10) ?? ''}</td>
              <td class="px-5 py-3.5 text-right">
                <a href="/admin/contacts/${ct.id}"
                  class="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  <i class="fas fa-eye mr-1"></i>상세
                </a>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
  return c.html(adminLayout('문의 관리', content, 'contacts'))
})

admin.get('/contacts/:id', async (c) => {
  const ct = await c.env.DB.prepare('SELECT * FROM contacts WHERE id=?').bind(c.req.param('id')).first() as any
  if (!ct) return c.redirect('/admin/contacts')
  // 자동으로 확인 상태로 변경
  if (ct.status === 'new') {
    await c.env.DB.prepare("UPDATE contacts SET status='confirmed', updated_at=datetime('now') WHERE id=?").bind(ct.id).run()
    ct.status = 'confirmed'
  }
  const typeMap: Record<string, string> = {
    edu: '디지털 교육', it: 'IT 장비 지원', security: '보안 교육',
    partner: '기관 협력', volunteer: '봉사단 참여', etc: '기타'
  }
  const statusOptions = [
    { value: 'new', label: '신규' },
    { value: 'confirmed', label: '확인' },
    { value: 'replied', label: '답변완료' },
    { value: 'closed', label: '종료' },
  ]

  const content = `
    <div class="max-w-2xl">
      <a href="/admin/contacts" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
        <i class="fas fa-arrow-left"></i> 목록으로
      </a>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-gray-400 mb-1">이름</div>
            <div class="font-bold text-gray-900">${ct.name}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">연락처</div>
            <div class="font-medium text-gray-800">${ct.phone}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">이메일</div>
            <div class="text-gray-700">${ct.email || '-'}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">소속 기관</div>
            <div class="text-gray-700">${ct.org || '-'}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">문의 유형</div>
            <div class="text-gray-700">${typeMap[ct.type] || ct.type}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">접수일시</div>
            <div class="text-gray-700">${ct.created_at}</div>
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-400 mb-1">문의 내용</div>
          <div class="bg-gray-50 rounded-xl p-4 text-gray-800 text-sm leading-relaxed">${ct.message}</div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">처리 상태</label>
          <div class="flex gap-2">
            ${statusOptions.map(s => `
              <button onclick="updateContactStatus(${ct.id}, '${s.value}')"
                class="px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all
                  ${ct.status === s.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-400'}">
                ${s.label}
              </button>`).join('')}
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">내부 메모</label>
          <textarea id="memoText" rows="3" placeholder="내부 처리 메모 (공개되지 않습니다)"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none">${ct.memo || ''}</textarea>
          <button onclick="saveMemo(${ct.id})" class="mt-2 bg-gray-700 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors">
            <i class="fas fa-save mr-1"></i>메모 저장
          </button>
        </div>
      </div>
    </div>
    <script>
      function updateContactStatus(id, status) {
        fetch('/api/admin/contacts/' + id + '/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }).then(() => { showToast('상태가 변경되었습니다.'); setTimeout(() => location.reload(), 600) })
      }
      function saveMemo(id) {
        const memo = document.getElementById('memoText').value
        fetch('/api/admin/contacts/' + id + '/memo', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memo })
        }).then(() => showToast('메모가 저장되었습니다.'))
      }
    </script>`
  return c.html(adminLayout('문의 상세', content, 'contacts'))
})

export { admin }
