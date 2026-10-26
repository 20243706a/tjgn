# 상담 웹앱 (실시간 연동)

의존성 없음. Node 18 이상이면 `node server.js` 로 실행돼요. 방은 하나뿐이고, 주소 하나로 화면을 구분해요.

## 주소
- `https://내주소/` → 친구 화면
- `https://내주소/?admin` → 상담사 화면
- 상담사 화면의 "완료"를 누르면 기록과 친구 화면이 모두 처음 상태로 리셋돼요.

## 파일
server.js, friend.html, admin.html, common.js, style.css, manifest.json, package.json (폴더 없이 한 곳에)

## 전체화면
아이패드 Safari 공유 버튼 → "홈 화면에 추가". 그 아이콘으로 열면 주소창 없이 전체화면이에요. 상담사는 `/?admin` 을 연 상태에서 추가하세요. 추가하지 않으면 오른쪽 위 "전체화면" 버튼을 쓸 수 있어요(지원 기기만).

## 상담사 주소 잠그기 (권장)
Render의 Environment에 `ADMIN_KEY` = 아무 비밀 단어를 넣으면, 상담사 화면은 `/?admin=비밀단어` 로만 열려요. 상담사 기록은 친구 화면으로 전송되지 않아요.

## 올리기 (Render)
1. GitHub 저장소에 파일 전부 업로드.
2. render.com → New → Web Service → 저장소 선택.
3. Start Command `node server.js`, Free 플랜.

## 참고
- 데이터는 서버 메모리에만 있어서 서버가 재시작되면 사라져요.
- 한 번에 한 상담만 진행해요. 다음 상담 전에 "완료"를 누르세요.
