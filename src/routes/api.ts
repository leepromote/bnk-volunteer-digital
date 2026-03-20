import { Hono } from 'hono'
import { requireAuth } from '../utils/auth'

const api = new Hono<{ Bindings: any }>()

// 모든 API에 인증 적용
api.use('/*', requireAuth)

// ─── 유틸 ─────────────────────────────────────────────────────
function parsePublished(body: any): number {
  if (body.published === undefined) return 1
  if (typeof body.published === 'string') return body.published === '1' || body.published === 'true' || body.published === 'on' ? 1 : 0
  return body.published ? 1 : 0
}

// ══════════════════════════════════════════════════════════════
// ─── 활동 내역 API ────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
api.post('/activities', async (c) => {
  const body = await c.req.json() as any
  const db = c.env.DB
  await db.prepare(`
    INSERT INTO activities (date, category, title, location, participants, beneficiaries, hours, description, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.date, body.category, body.title, body.location,
    Number(body.participants) || 0, Number(body.beneficiaries) || 0, Number(body.hours) || 0,
    body.description || '', parsePublished(body)
  ).run()
  return c.json({ message: '활동이 추가되었습니다.', redirect: '/admin/activities' })
})

api.put('/activities/:id', async (c) => {
  const body = await c.req.json() as any
  await c.env.DB.prepare(`
    UPDATE activities SET date=?, category=?, title=?, location=?, participants=?, beneficiaries=?,
    hours=?, description=?, published=?, updated_at=datetime('now') WHERE id=?
  `).bind(
    body.date, body.category, body.title, body.location,
    Number(body.participants) || 0, Number(body.beneficiaries) || 0, Number(body.hours) || 0,
    body.description || '', parsePublished(body), c.req.param('id')
  ).run()
  return c.json({ message: '활동이 수정되었습니다.', redirect: '/admin/activities' })
})

api.delete('/activities/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM activities WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ message: '삭제되었습니다.' })
})

api.patch('/activities/:id/publish', async (c) => {
  const { published } = await c.req.json() as any
  await c.env.DB.prepare("UPDATE activities SET published=?, updated_at=datetime('now') WHERE id=?")
    .bind(published, c.req.param('id')).run()
  return c.json({ message: '상태가 변경되었습니다.' })
})

// ══════════════════════════════════════════════════════════════
// ─── 블로그 API ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
api.post('/posts', async (c) => {
  const body = await c.req.json() as any
  await c.env.DB.prepare(`
    INSERT INTO posts (tag, emoji, title, content, excerpt, author, read_time, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.tag, body.emoji || '📝', body.title, body.content,
    body.excerpt || '', body.author, body.read_time || '3분', parsePublished(body)
  ).run()
  return c.json({ message: '포스트가 등록되었습니다.', redirect: '/admin/posts' })
})

api.put('/posts/:id', async (c) => {
  const body = await c.req.json() as any
  await c.env.DB.prepare(`
    UPDATE posts SET tag=?, emoji=?, title=?, content=?, excerpt=?, author=?, read_time=?,
    published=?, updated_at=datetime('now') WHERE id=?
  `).bind(
    body.tag, body.emoji || '📝', body.title, body.content,
    body.excerpt || '', body.author, body.read_time || '3분',
    parsePublished(body), c.req.param('id')
  ).run()
  return c.json({ message: '포스트가 수정되었습니다.', redirect: '/admin/posts' })
})

api.delete('/posts/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM posts WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ message: '삭제되었습니다.' })
})

api.patch('/posts/:id/publish', async (c) => {
  const { published } = await c.req.json() as any
  await c.env.DB.prepare("UPDATE posts SET published=?, updated_at=datetime('now') WHERE id=?")
    .bind(published, c.req.param('id')).run()
  return c.json({ message: '상태가 변경되었습니다.' })
})

// ══════════════════════════════════════════════════════════════
// ─── 팀원 API ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
api.post('/members', async (c) => {
  const body = await c.req.json() as any
  const skills = JSON.stringify((body.skills_text || '').split(',').map((s: string) => s.trim()).filter(Boolean))
  await c.env.DB.prepare(`
    INSERT INTO members (name, role, years, icon, color, skills, description, sort_order, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.name, body.role, Number(body.years) || 1,
    body.icon || 'fa-user', body.color || 'from-blue-600 to-blue-800',
    skills, body.description || '', Number(body.sort_order) || 0, parsePublished(body)
  ).run()
  return c.json({ message: '팀원이 추가되었습니다.', redirect: '/admin/members' })
})

api.put('/members/:id', async (c) => {
  const body = await c.req.json() as any
  const skills = JSON.stringify((body.skills_text || '').split(',').map((s: string) => s.trim()).filter(Boolean))
  await c.env.DB.prepare(`
    UPDATE members SET name=?, role=?, years=?, icon=?, color=?, skills=?, description=?,
    sort_order=?, published=?, updated_at=datetime('now') WHERE id=?
  `).bind(
    body.name, body.role, Number(body.years) || 1,
    body.icon || 'fa-user', body.color || 'from-blue-600 to-blue-800',
    skills, body.description || '', Number(body.sort_order) || 0, parsePublished(body), c.req.param('id')
  ).run()
  return c.json({ message: '팀원 정보가 수정되었습니다.', redirect: '/admin/members' })
})

api.delete('/members/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM members WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ message: '삭제되었습니다.' })
})

api.patch('/members/:id/publish', async (c) => {
  const { published } = await c.req.json() as any
  await c.env.DB.prepare("UPDATE members SET published=?, updated_at=datetime('now') WHERE id=?")
    .bind(published, c.req.param('id')).run()
  return c.json({ message: '상태가 변경되었습니다.' })
})

// ══════════════════════════════════════════════════════════════
// ─── 갤러리 API ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
api.post('/gallery', async (c) => {
  const body = await c.req.json() as any
  await c.env.DB.prepare(`
    INSERT INTO gallery (emoji, title, category, date, image_url, sort_order, published)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.emoji || '📷', body.title, body.category,
    body.date || '', body.image_url || '',
    Number(body.sort_order) || 0, parsePublished(body)
  ).run()
  return c.json({ message: '갤러리 항목이 추가되었습니다.', redirect: '/admin/gallery' })
})

api.put('/gallery/:id', async (c) => {
  const body = await c.req.json() as any
  await c.env.DB.prepare(`
    UPDATE gallery SET emoji=?, title=?, category=?, date=?, image_url=?, sort_order=?,
    published=?, updated_at=datetime('now') WHERE id=?
  `).bind(
    body.emoji || '📷', body.title, body.category,
    body.date || '', body.image_url || '',
    Number(body.sort_order) || 0, parsePublished(body), c.req.param('id')
  ).run()
  return c.json({ message: '갤러리가 수정되었습니다.', redirect: '/admin/gallery' })
})

api.delete('/gallery/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM gallery WHERE id=?').bind(c.req.param('id')).run()
  return c.json({ message: '삭제되었습니다.' })
})

api.patch('/gallery/:id/publish', async (c) => {
  const { published } = await c.req.json() as any
  await c.env.DB.prepare("UPDATE gallery SET published=?, updated_at=datetime('now') WHERE id=?")
    .bind(published, c.req.param('id')).run()
  return c.json({ message: '상태가 변경되었습니다.' })
})

// ══════════════════════════════════════════════════════════════
// ─── 문의 API ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
api.patch('/contacts/:id/status', async (c) => {
  const { status } = await c.req.json() as any
  await c.env.DB.prepare("UPDATE contacts SET status=?, updated_at=datetime('now') WHERE id=?")
    .bind(status, c.req.param('id')).run()
  return c.json({ message: '상태가 변경되었습니다.' })
})

api.patch('/contacts/:id/memo', async (c) => {
  const { memo } = await c.req.json() as any
  await c.env.DB.prepare("UPDATE contacts SET memo=?, updated_at=datetime('now') WHERE id=?")
    .bind(memo, c.req.param('id')).run()
  return c.json({ message: '메모가 저장되었습니다.' })
})

export { api }
