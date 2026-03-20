// ─── Admin 공통 레이아웃 ──────────────────────────────────────
export function adminLayout(title: string, content: string, activeMenu: string = ''): string {
  const menuItems = [
    { href: '/admin', icon: 'fa-tachometer-alt', label: '대시보드', key: 'dashboard' },
    { href: '/admin/activities', icon: 'fa-calendar-check', label: '활동 내역', key: 'activities' },
    { href: '/admin/posts', icon: 'fa-pen-alt', label: '블로그', key: 'posts' },
    { href: '/admin/members', icon: 'fa-users', label: '팀 소개', key: 'members' },
    { href: '/admin/gallery', icon: 'fa-images', label: '갤러리', key: 'gallery' },
    { href: '/admin/contacts', icon: 'fa-envelope', label: '문의 내역', key: 'contacts' },
  ]

  const menuHtml = menuItems.map(item => {
    const isActive = activeMenu === item.key
    return `
      <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
        ${isActive
          ? 'bg-white text-blue-900 shadow-sm font-bold'
          : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'}">
        <i class="fas ${item.icon} w-5 text-center"></i>
        <span>${item.label}</span>
        ${isActive ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400"></span>' : ''}
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
    * { font-family: 'Noto Sans KR', sans-serif; }
    .sidebar { background: linear-gradient(180deg, #001a40 0%, #003d82 100%); }
    .card-hover { transition: all 0.2s ease; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .toast { animation: slideIn 0.3s ease; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; align-items: center; justify-content: center; }
    .modal-overlay.active { display: flex; }
  </style>
</head>
<body class="bg-gray-100 flex h-screen overflow-hidden">

  <!-- Sidebar -->
  <aside class="sidebar w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto">
    <!-- Logo -->
    <div class="p-5 border-b border-white border-opacity-10">
      <a href="/admin" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <i class="fas fa-laptop-code text-white"></i>
        </div>
        <div>
          <div class="text-white font-black text-sm leading-tight">BNK CMS</div>
          <div class="text-orange-400 text-xs font-medium">콘텐츠 관리 시스템</div>
        </div>
      </a>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-4 space-y-1">
      <p class="text-blue-300 text-xs uppercase tracking-wider font-semibold px-4 pt-2 pb-3">메뉴</p>
      ${menuHtml}
    </nav>

    <!-- Bottom -->
    <div class="p-4 border-t border-white border-opacity-10 space-y-2">
      <a href="/" target="_blank" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-200 hover:text-white text-sm transition-colors">
        <i class="fas fa-external-link-alt w-5 text-center text-xs"></i>
        <span>사이트 보기</span>
      </a>
      <a href="/admin/logout" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-200 hover:text-white text-sm transition-colors">
        <i class="fas fa-sign-out-alt w-5 text-center"></i>
        <span>로그아웃</span>
      </a>
    </div>
  </aside>

  <!-- Main -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top Bar -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <h1 class="text-lg font-black text-gray-800">${title}</h1>
      <div class="flex items-center gap-3">
        <a href="/" target="_blank" class="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition-colors">
          <i class="fas fa-globe"></i> 사이트 보기
        </a>
        <div class="flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full text-sm font-medium">
          <i class="fas fa-user-shield text-blue-500"></i>
          <span>관리자</span>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 overflow-y-auto p-6">
      ${content}
    </main>
  </div>

  <!-- Toast Container -->
  <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>

  <script>
    function showToast(msg, type = 'success') {
      const el = document.createElement('div')
      el.className = \`toast flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium
        \${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}\`
      el.innerHTML = \`<i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>\${msg}\`
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

    // 폼 제출 → fetch + toast
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

// 테이블 공통 스타일 헬퍼
export function badge(text: string, color: string = 'blue'): string {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return `<span class="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${colors[color] || colors.blue}">${text}</span>`
}
