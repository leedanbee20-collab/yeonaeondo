연애온도 78℃ V19

회원가입·로그인 → 상담 → 24문항 검사 → 실제 등록 회원 추천 → 채팅 → 두 사람 동의 후 가상데이트.
20개 고정 이름 상반신 캐릭터, 8명 상담가, 9개 공간과 이미지 선택. AI API 호출 없음.

실행: Node 24 이상, npm install, npm start. 로컬 초기 키는 setup-local.mjs가 생성.
운영: NODE_ENV=production, HTTPS PUBLIC_ORIGIN, DATABASE_URL, ROOM_STATE_KEY(64 hex), COUNSEL_BOOKING_KEY(64 hex), COUNSEL_ADMIN_KEY 필수. 비밀키/DB/테스트회원은 배포 묶음에서 제외.

예약: 20분 30,000원, 5시간 이상의 연락 가능 시간대. 입금 확인은 운영자 수동. 계좌는 서버 환경변수로만 설정하며 실제 신청자에게만 반환. 현재 통화·문자 알림·자동 입금 확인은 연결되지 않음. 공개 배포에는 계좌 미설정으로 입금 유도 중지.
카카오 로그인은 실제 앱 키와 리다이렉트 등록 필요. 미설정 시 이메일 가입 이용.
검증 배지는 실제 검증 결과만 반영하며 미검증 회원을 검증 완료로 표시하지 않음. 서류 검증 업체 연결은 별도 운영 작업.

SEO: /love-counsel /reunion /breakup /tarot /astrology /dating-chat /download, robots.txt와 sitemap.xml. 네이버 소유확인·사이트맵 제출 별도. 검색 순위/색인 보장 없음.
PWA: HTTPS Android Chrome 앱 설치, iOS Safari 홈 화면 추가. APK 아님.

운영 전 확인: 개인정보처리방침·이용약관과 수집/국외이전 고지, 사업자/환불 안내, 신고/차단/탈퇴 및 운영 대응, 이메일 소유확인/비밀번호 재설정, 실제 폰/카카오 테스트, 운영 DB 백업·요금제. 현재 기능 검증과 운영 정책 준비는 별개.
무료 Render DB는 2026-11-13 07:03 KST 만료 예정. 장기 회원 모집 전 유료 DB 또는 적합한 상시 저장소 전환 필요.
