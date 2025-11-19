# 🎉 배포 완료! n8n-nodes-discord-user

## ✅ 성공적으로 npm에 배포되었습니다!

### 📦 패키지 정보

- **패키지명**: `n8n-nodes-discord-user` (scoped 제거)
- **버전**: 2.0.0
- **상태**: ✅ Published
- **npm URL**: https://www.npmjs.com/package/n8n-nodes-discord-user
- **GitHub**: https://github.com/Alex110709/n8n-discord-self

---

## 🚀 n8n에서 설치하기

### 방법 1: Community Nodes UI (권장)

1. n8n 열기
2. **Settings** → **Community Nodes** 클릭
3. **Install** 버튼 클릭
4. 패키지명 입력: `n8n-nodes-discord-user`
5. **Install** 클릭
6. n8n 재시작

### 방법 2: 수동 설치

```bash
cd ~/.n8n/custom
npm install n8n-nodes-discord-user
# n8n 재시작
```

---

## 🎯 사용 가능한 노드

설치 후 n8n에서 2개의 노드를 사용할 수 있습니다:

### 1. Discord Self-Bot (V1)
- 간단한 작업에 최적화
- 6개 기본 작업

### 2. Discord Self-Bot V2 ⭐ 추천
- 완전한 Discord API 기능
- 8개 리소스 타입:
  - **Message**: 전송, 읽기, 수정, 삭제, 반응, 고정, 검색
  - **User Profile**: 프로필, 상태, 바이오, 아바타, 사용자명
  - **Server**: 생성, 수정, 삭제, 목록, 정보
  - **Channel**: 생성, 수정, 삭제, 목록
  - **Role**: 생성, 수정, 삭제, 할당, 제거
  - **Member**: 킥, 밴, 언밴, 닉네임, 목록
  - **Presence**: 상태, 활동 설정
  - **Invite**: 생성, 수락, 삭제, 목록

---

## 🔧 Discord 토큰 설정

1. n8n에서 **Credentials** → **New** 클릭
2. **Discord Self-Bot API** 검색
3. Discord 사용자 토큰 입력
4. **Save** 클릭

### Discord 토큰 얻기:
1. 웹 브라우저에서 Discord 열기
2. F12 (개발자 도구) 열기
3. Network 탭으로 이동
4. Discord에서 메시지 전송
5. discord.com/api 요청 찾기
6. Request Headers에서 `authorization` 헤더 찾기
7. 토큰 복사

---

## 📊 패키지 상세 정보

```
Package Size: 16.4 KB
Unpacked Size: 103.8 KB
Total Files: 28
Dependencies: 
  - discord.js-selfbot-v13: ^2.14.13
  - n8n-core: ^1.19.0
Tests: 9/9 passing ✅
Build: Successful ✅
```

---

## 📝 사용 예제

### 예제 1: 메시지 전송
```
Node: Discord Self-Bot V2
Resource: Message
Operation: Send
Channel ID: 123456789012345678
Content: Hello from n8n!
```

### 예제 2: 서버 멤버 목록
```
Node: Discord Self-Bot V2
Resource: Member
Operation: List Members
Server ID: 987654321098765432
Limit: 100
```

### 예제 3: 사용자 상태 변경
```
Node: Discord Self-Bot V2
Resource: Presence
Operation: Set Status
Status: Do Not Disturb
```

---

## ⚠️ 중요 경고

1. **Discord ToS 위반**: Self-bot 사용은 Discord 서비스 약관을 위반합니다
2. **계정 위험**: 계정이 정지될 수 있습니다
3. **토큰 보안**: 절대 토큰을 공유하지 마세요
4. **본인 책임**: 모든 사용은 본인의 책임입니다

---

## 🔍 확인 명령어

```bash
# npm에서 패키지 확인
npm view n8n-nodes-discord-user

# 패키지 검색
npm search n8n-nodes-discord-user

# 설치 테스트
npm install n8n-nodes-discord-user
```

---

## 📚 추가 리소스

- 📖 English Documentation: `docs/README.md`
- 📖 한국어 문서: `docs/KOREAN.md`
- 💡 Examples: `examples/workflow-example.json`
- 🐛 Issues: https://github.com/Alex110709/n8n-discord-self/issues

---

## 🎊 축하합니다!

패키지가 성공적으로 npm에 배포되었으며, 이제 전 세계의 n8n 사용자들이 Community Nodes를 통해 쉽게 설치할 수 있습니다!

**패키지명**: `n8n-nodes-discord-user`  
**설치 명령어**: `npm install n8n-nodes-discord-user`  
**n8n Community Nodes**: Settings → Community Nodes → Install → `n8n-nodes-discord-user`

---

## 📈 버전 히스토리

- **v2.0.0** (현재) - 완전한 Discord API 지원, 8개 리소스 타입
- **v1.0.0** - 초기 릴리스, 기본 메시징 기능

---

**Happy Automating with Discord! 🚀**
