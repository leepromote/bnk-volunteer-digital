// ─── Admin 공통 레이아웃 ─────────────────────────────────────────
// 디자인 시스템: 딥 슬레이트/네이비 베이스 + BNK Red/Gold 포인트
export function adminLayout(title: string, content: string, activeMenu: string = ''): string {
  const menuItems = [
    { href: '/admin',           icon: 'fa-tachometer-alt', label: '대시보드',  key: 'dashboard' },
    { href: '/admin/activities',icon: 'fa-calendar-check', label: '활동 내역', key: 'activities' },
    { href: '/admin/posts',     icon: 'fa-pen-alt',        label: '블로그',    key: 'posts' },
    { href: '/admin/members',   icon: 'fa-users',          label: '팀 소개',   key: 'members' },
    { href: '/admin/gallery',   icon: 'fa-images',         label: '갤러리',    key: 'gallery' },
    { href: '/admin/contacts',  icon: 'fa-envelope',       label: '문의 내역', key: 'contacts' },
  ]

  const menuHtml = menuItems.map(item => {
    const isActive = activeMenu === item.key
    return `
      <a href="${item.href}" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
        ${isActive
          ? 'font-bold text-white'
          : 'text-slate-400 hover:text-white hover:bg-white hover:bg-opacity-8'}"
        style="${isActive ? 'background:rgba(215,25,31,0.18); border-left: 3px solid #D7191F; padding-left: 13px;' : ''}">
        <i class="fas ${item.icon} w-5 text-center ${isActive ? 'text-bnk-red' : ''}"
          style="${isActive ? 'color:#D7191F' : ''}"></i>
        <span>${item.label}</span>
        ${isActive ? '<span class="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:#896E4A"></span>' : ''}
      </a>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | BNK CMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
  <style>
    /* ════════════════════════════════════════
       어드민 디자인 시스템
       베이스: 딥 슬레이트 (#0F172A / #1E293B)
       포인트: BNK Red #D7191F / BNK Gold #896E4A
    ════════════════════════════════════════ */
    :root {
      --bnk-red:        #D7191F;
      --bnk-dark-red:   #8B0304;
      --bnk-gold:       #896E4A;
      --bnk-gold-light: #B8975A;
      --bnk-dark-gray:  #65584F;
      --bnk-light-gray: #B7A997;
      --bnk-silver:     #909394;

      /* 슬레이트 팔레트 */
      --sl-900: #0F172A;
      --sl-800: #1E293B;
      --sl-700: #334155;
      --sl-600: #475569;
      --sl-400: #94A3B8;
      --sl-200: #E2E8F0;
    }
    * { font-family: 'Noto Sans KR', sans-serif; }
    body { background: #F1F5F9; }

    /* ── 사이드바: 딥 슬레이트 네이비 */
    .sidebar {
      background: linear-gradient(180deg, #0F172A 0%, #1E293B 60%, #0F2744 100%);
    }

    /* ── 카드 호버 */
    .card-hover { transition: all 0.2s ease; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.12); }

    /* ── 토스트 */
    .toast { animation: slideIn 0.3s ease; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* ── 모달 */
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; align-items: center; justify-content: center; }
    .modal-overlay.active { display: flex; }

    /* ── 인풋 포커스 */
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--bnk-red) !important;
      box-shadow: 0 0 0 3px rgba(215,25,31,0.10);
    }

    /* ── 버튼 */
    .btn-admin-primary {
      background: var(--bnk-red);
      color: #fff;
      transition: all 0.2s;
    }
    .btn-admin-primary:hover { background: var(--bnk-dark-red); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(215,25,31,0.3); }

    .btn-admin-secondary {
      background: #fff;
      color: var(--sl-700);
      border: 1.5px solid var(--sl-200);
      transition: all 0.2s;
    }
    .btn-admin-secondary:hover { border-color: var(--bnk-red); color: var(--bnk-red); }

    .btn-admin-gold {
      background: var(--bnk-gold);
      color: #fff;
      transition: all 0.2s;
    }
    .btn-admin-gold:hover { background: #6B5236; }

    .btn-admin-slate {
      background: var(--sl-700);
      color: #fff;
      transition: all 0.2s;
    }
    .btn-admin-slate:hover { background: var(--sl-800); }

    /* ── 배지 */
    .tag-red   { background: #FEF2F2; color: #8B0304; }
    .tag-gold  { background: #FDF8F0; color: #896E4A; }
    .tag-gray  { background: #F1F5F9; color: #475569; }
    .tag-green { background: #ECFDF5; color: #065F46; }

    /* ── 상태 배지 */
    .status-new  { background: #FEF2F2; color: var(--bnk-dark-red); font-weight: 700; }
    .status-done { background: #F1F5F9; color: #64748B; }

    /* ── 테이블 */
    .admin-table th {
      background: var(--sl-800);
      color: rgba(255,255,255,0.85);
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .admin-table td {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border-bottom: 1px solid #f1f5f9;
      color: var(--sl-700);
    }
    .admin-table tbody tr:hover { background: #F8FAFC; }
    .admin-table { border-radius: 12px; overflow: hidden; }

    /* ── 호버 메뉴 opacity 조정 */
    .sidebar a:not(.active-menu):hover {
      background: rgba(255,255,255,0.07) !important;
    }
  </style>
</head>
<body class="flex h-screen overflow-hidden">

  <!-- ── 사이드바 (딥 슬레이트 네이비) ── -->
  <aside class="sidebar w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto">

    <!-- 로고 -->
    <div class="p-5" style="border-bottom:1px solid rgba(255,255,255,0.08)">
      <a href="/admin" class="flex items-center gap-3">
        <!-- BNK Red 포인트 아이콘 -->
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style="background:linear-gradient(135deg,#8B0304,#D7191F)">
          <i class="fas fa-laptop-code text-white text-sm"></i>
        </div>
        <div>
          <div class="text-white font-black text-sm leading-tight">BNK CMS</div>
          <div class="text-xs font-medium" style="color:#896E4A">콘텐츠 관리 시스템</div>
        </div>
      </a>
    </div>

    <!-- 메뉴 -->
    <nav class="flex-1 p-4 space-y-0.5">
      <p class="text-xs uppercase tracking-widest font-semibold px-4 pt-3 pb-2" style="color:rgba(148,163,184,0.5)">메뉴</p>
      ${menuHtml}
    </nav>

    <!-- 하단 -->
    <div class="p-4" style="border-top:1px solid rgba(255,255,255,0.08)">
      <div class="space-y-0.5">
        <a href="/" target="_blank"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors"
          style="color:#94A3B8"
          onmouseover="this.style.background='rgba(255,255,255,0.07)';this.style.color='#fff'"
          onmouseout="this.style.background='';this.style.color='#94A3B8'">
          <i class="fas fa-external-link-alt w-5 text-center text-xs"></i>
          <span>사이트 보기</span>
        </a>
        <a href="/admin/logout"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors"
          style="color:#94A3B8"
          onmouseover="this.style.background='rgba(215,25,31,0.12)';this.style.color='#FCA5A5'"
          onmouseout="this.style.background='';this.style.color='#94A3B8'">
          <i class="fas fa-sign-out-alt w-5 text-center"></i>
          <span>로그아웃</span>
        </a>
      </div>
    </div>
  </aside>

  <!-- ── 메인 영역 ── -->
  <div class="flex-1 flex flex-col overflow-hidden">

    <!-- 탑바 -->
    <header class="bg-white flex items-center justify-between px-6 py-4 flex-shrink-0"
      style="border-bottom:1px solid #E2E8F0; border-top:3px solid var(--bnk-red);">
      <h1 class="text-lg font-black" style="color:#1E293B">${title}</h1>
      <div class="flex items-center gap-3">
        <!-- 사이트 링크 -->
        <a href="/" target="_blank"
          class="hidden md:flex items-center gap-1.5 text-sm transition-colors"
          style="color:#94A3B8"
          onmouseover="this.style.color='var(--bnk-red)'"
          onmouseout="this.style.color='#94A3B8'">
          <i class="fas fa-globe text-xs"></i>사이트 보기
        </a>
        <!-- 관리자 배지 -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style="background:#F1F5F9; color:#334155">
          <i class="fas fa-user-shield text-xs" style="color:var(--bnk-red)"></i>
          <span>관리자</span>
        </div>
      </div>
    </header>

    <!-- 컨텐츠 -->
    <main class="flex-1 overflow-y-auto p-6">
      ${content}
    </main>
  </div>

  <!-- 토스트 컨테이너 -->
  <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>

  <script>
    function showToast(msg, type = 'success') {
      const el = document.createElement('div')
      el.className = 'toast flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium text-white'
      el.style.background = type === 'success'
        ? 'linear-gradient(135deg,#1E293B,#334155)'
        : 'linear-gradient(135deg,#8B0304,#D7191F)'
      el.innerHTML = \`<i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="color:\${type === 'success' ? '#896E4A' : '#FCA5A5'}"></i>\${msg}\`
      document.getElementById('toastContainer').appendChild(el)
      setTimeout(() => el.remove(), 3500)
    }

    function confirmDelete(url, name) {
      if (confirm(\`"\${name}" 을(를) 삭제하시겠습니까?\\n이 작업은 되돌릴 수 없습니다.\`)) {
        fetch(url, { method: 'DELETE' })
          .then(r => r.json())
          .then(d => { showToast(d.message || '삭제되었습니다.'); setTimeout(() => location.reload(), 800) })
          .catch(() => showToast('오류가 발생했습니다.', 'error'))
      }
    }

    function togglePublish(url, published) {
      fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: published ? 0 : 1 })
      }).then(() => location.reload())
    }

    // 폼 AJAX 제출
    document.querySelectorAll('form[data-ajax]').forEach(form => {
      form.addEventListener('submit', async e => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(form))
        const method = form.dataset.method || form.method.toUpperCase()
        const action = form.action
        try {
          const res = await fetch(action, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          const json = await res.json()
          if (res.ok) {
            showToast(json.message || '저장되었습니다.')
            if (json.redirect) setTimeout(() => location.href = json.redirect, 800)
            else setTimeout(() => location.reload(), 800)
          } else {
            showToast(json.error || '오류가 발생했습니다.', 'error')
          }
        } catch {
          showToast('서버 오류가 발생했습니다.', 'error')
        }
      })
    })
  </script>
</body>
</html>`
}

// ── 배지 헬퍼 ──────────────────────────────────────────────────
export function badge(text: string, color: string = 'slate'): string {
  const colors: Record<string, string> = {
    red:    'background:#FEF2F2;color:#8B0304',
    gold:   'background:#FDF8F0;color:#896E4A',
    gray:   'background:#F1F5F9;color:#475569',
    slate:  'background:#F1F5F9;color:#475569',
    green:  'background:#ECFDF5;color:#065F46',
    blue:   'background:#EFF6FF;color:#1D4ED8',
    orange: 'background:#FFF7ED;color:#9A3412',
    yellow: 'background:#FEFCE8;color:#854D0E',
    purple: 'background:#FAF5FF;color:#6B21A8',
  }
  const style = colors[color] || colors.slate
  return `<span class="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full" style="${style}">${text}</span>`
}
