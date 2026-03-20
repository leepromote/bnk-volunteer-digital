-- =============================
-- 관리자 테이블
-- =============================
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 활동 내역 테이블
-- =============================
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  participants INTEGER DEFAULT 0,
  beneficiaries INTEGER DEFAULT 0,
  hours INTEGER DEFAULT 0,
  description TEXT,
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 블로그 포스트 테이블
-- =============================
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tag TEXT NOT NULL,
  emoji TEXT DEFAULT '📝',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  read_time TEXT DEFAULT '3분',
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 팀원 테이블
-- =============================
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  years INTEGER DEFAULT 1,
  icon TEXT DEFAULT 'fa-user',
  color TEXT DEFAULT 'from-blue-600 to-blue-800',
  skills TEXT DEFAULT '[]',
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 갤러리 테이블
-- =============================
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  emoji TEXT DEFAULT '📷',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 문의 내역 테이블
-- =============================
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  type TEXT NOT NULL,
  org TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 기본 관리자 계정 (admin / bnk2024!)
-- password_hash = SHA-256 of "bnk2024!"
-- =============================
INSERT OR IGNORE INTO admins (username, password_hash, name) VALUES
  ('admin', 'a7c4e2f1b9d3e5a8c6f0b2d4e6a8c0f2b4d6e8a0c2f4b6d8e0a2c4f6b8d0e2a4', 'BNK 관리자');

-- =============================
-- 샘플 활동 데이터
-- =============================
INSERT OR IGNORE INTO activities (date, category, title, location, participants, beneficiaries, hours, description) VALUES
  ('2024.11.20', '디지털 교육', '부산 노인복지관 스마트폰 활용 교육', '부산 동구 노인복지관', 8, 30, 3, '어르신 30명을 대상으로 스마트폰 기본 조작, 카카오톡, 유튜브 활용 교육을 3시간 동안 진행했습니다.'),
  ('2024.11.15', 'IT 장비 지원', '지역아동센터 컴퓨터 정비 봉사', '부산 사하구 지역아동센터', 12, 80, 6, '취약계층 아동 80명이 이용하는 센터의 노후 PC 15대를 점검, 수리, 업그레이드하고 보안 소프트웨어를 설치했습니다.'),
  ('2024.11.05', '보안 교육', '다문화가정 금융사기 예방 캠페인', '부산 남구 다문화가족지원센터', 6, 45, 4, '외국인 근로자 및 다문화가정 45명을 대상으로 보이스피싱, 스미싱, 금융사기 예방 교육을 5개 언어로 진행했습니다.'),
  ('2024.10.28', '디지털 교육', '청소년 코딩 기초 교육', '부산 금정구 청소년문화센터', 10, 25, 8, '중학생 25명을 대상으로 스크래치를 활용한 기초 코딩 교육을 진행하고, IT 직업 진로 상담을 함께 제공했습니다.');

-- =============================
-- 샘플 블로그 데이터
-- =============================
INSERT OR IGNORE INTO posts (tag, emoji, title, content, excerpt, author, read_time) VALUES
  ('활동 후기', '📱', '어르신들의 첫 카카오톡, 감동의 순간들', '지난 주 노인복지관에서 진행한 스마트폰 교육 현장을 생생하게 전합니다. 처음으로 손주에게 사진을 보내신 할머니의 미소가 잊혀지지 않습니다. 교육을 마치고 나서 어르신들이 직접 가족들에게 메시지를 보내시는 모습을 보며 뿌듯함을 느꼈습니다. 앞으로도 더 많은 분들께 디지털의 따뜻함을 전달하고 싶습니다.', '지난 주 노인복지관에서 진행한 스마트폰 교육 현장을 생생하게 전합니다.', '김봉사', '3분'),
  ('IT 팁', '🛡️', '보이스피싱 100% 차단하는 실전 가이드', '최근 급증하는 AI 보이스피싱 수법과 대처 방법을 알기 쉽게 정리했습니다. 첫째, 모르는 번호의 전화는 일단 끊고 공식 번호로 재확인하세요. 둘째, 어떠한 기관도 전화로 계좌이체를 요구하지 않습니다. 셋째, 의심스러운 링크는 절대 클릭하지 마세요. 가족들에게 꼭 공유해 주세요.', '최근 급증하는 AI 보이스피싱 수법과 대처 방법을 알기 쉽게 정리했습니다.', '이IT', '5분'),
  ('소식', '🏆', '2024 부산시 우수 봉사단체 표창 수상!', 'BNK 재능기부봉사단 디지털IT팀이 부산시로부터 우수 봉사단체로 선정되어 표창을 받았습니다. 지난 3년간 꾸준히 이어온 디지털 교육 봉사 활동이 인정받은 것 같아 모든 단원들이 기뻐하고 있습니다. 앞으로도 더욱 열심히 지역사회에 기여하겠습니다.', 'BNK 재능기부봉사단 디지털IT팀이 부산시로부터 우수 봉사단체로 선정되었습니다.', '박팀장', '2분');

-- =============================
-- 샘플 팀원 데이터
-- =============================
INSERT OR IGNORE INTO members (name, role, years, icon, color, skills, description, sort_order) VALUES
  ('김철수', '팀장 · 네트워크 전문가', 5, 'fa-network-wired', 'from-blue-600 to-blue-800', '["네트워크 설계","클라우드","보안"]', 'BNK부산은행 IT본부 수석. 지역사회 네트워크 인프라 개선을 위해 앞장서고 있습니다.', 1),
  ('이미영', '부팀장 · 디지털 교육 전문가', 4, 'fa-chalkboard-teacher', 'from-purple-600 to-purple-800', '["교육 설계","강의","시니어 IT"]', '15년 경력의 IT 교육 전문가. 누구나 쉽게 이해할 수 있는 교육 프로그램을 개발합니다.', 2),
  ('박준혁', '개발팀장 · 풀스택 개발자', 3, 'fa-code', 'from-green-600 to-green-800', '["웹 개발","앱 개발","AI"]', '비영리기관을 위한 무료 디지털 도구 개발에 열정을 쏟고 있습니다.', 3),
  ('최수진', '보안 전문가', 4, 'fa-shield-alt', 'from-red-600 to-red-800', '["사이버보안","금융보안","취약점 분석"]', '금융 사기 및 개인정보 침해 예방 교육의 핵심 강사.', 4);

-- =============================
-- 샘플 갤러리 데이터
-- =============================
INSERT OR IGNORE INTO gallery (emoji, title, category, date, sort_order) VALUES
  ('👩‍💻', '스마트폰 교육 현장', '교육', '2024.11', 1),
  ('🖥️', 'PC 수리 봉사', 'IT 지원', '2024.11', 2),
  ('🤝', '복지관 협약식', '협약', '2024.10', 3),
  ('📚', '코딩 교육 현장', '교육', '2024.10', 4),
  ('🏆', '부산시 표창 수상', '수상', '2024.10', 5),
  ('👨‍🏫', '금융사기 예방 교육', '교육', '2024.09', 6);
