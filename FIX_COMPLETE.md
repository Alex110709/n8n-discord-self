# ✅ 설치 오류 수정 완료! (v2.0.1)

## 🔧 수정 내용

### 문제
```
ENOTEMPTY: directory not empty, rmdir '...n8n-core/node_modules/zod-to-json-schema/dist/types/parsers'
```

### 해결
- **n8n-core를 dependencies에서 peerDependencies로 이동**
- 의존성 충돌 제거
- 패키지 크기 감소

---

## 📦 최신 버전 정보

- **패키지명**: `n8n-nodes-discord-user`
- **버전**: **2.0.1** (최신)
- **상태**: ✅ Published
- **npm**: https://www.npmjs.com/package/n8n-nodes-discord-user

### 변경 사항
```json
// Before (v2.0.0)
"dependencies": {
  "discord.js-selfbot-v13": "^2.14.13",
  "n8n-core": "^1.19.0"  // ❌ 충돌 발생
}

// After (v2.0.1)
"dependencies": {
  "discord.js-selfbot-v13": "^2.14.13"  // ✅ 충돌 해결
},
"peerDependencies": {
  "n8n-workflow": "*",
  "n8n-core": "*"  // ✅ peerDependency로 이동
}
```

---

## 🚀 이제 n8n에서 정상적으로 설치 가능합니다!

### Community Nodes UI
1. **Settings** → **Community Nodes**
2. **Install** 클릭
3. 패키지명: `n8n-nodes-discord-user`
4. **Install** 클릭
5. n8n 재시작

### 명령어
```bash
npm install n8n-nodes-discord-user
```

---

## 📊 패키지 정보

```
Package: n8n-nodes-discord-user@2.0.1
Size: 16.4 KB
Dependencies: 1 (discord.js-selfbot-v13만)
PeerDependencies: n8n-workflow, n8n-core
Tests: 9/9 passing ✅
Build: Successful ✅
```

---

## 🎯 주요 기능

### Discord Self-Bot V2 노드
**8개 리소스 타입:**

1. ✉️ **Message** - 전송, 읽기, 수정, 삭제, 반응, 고정, 검색
2. 👤 **User Profile** - 프로필, 상태, 바이오, 아바타, 사용자명
3. 🏢 **Server** - 생성, 수정, 삭제, 목록, 정보
4. 📺 **Channel** - 생성, 수정, 삭제, 목록
5. 🎭 **Role** - 생성, 수정, 삭제, 할당, 제거
6. 👥 **Member** - 킥, 밴, 언밴, 닉네임, 목록
7. 🟢 **Presence** - 상태, 활동 설정
8. 🔗 **Invite** - 생성, 수락, 삭제, 목록

---

## 🔍 설치 확인

```bash
# npm에서 최신 버전 확인
npm view n8n-nodes-discord-user

# 버전 확인
npm view n8n-nodes-discord-user version
# 출력: 2.0.1

# 설치 테스트
npm install n8n-nodes-discord-user
```

---

## ⚠️ 중요 안내

1. **Discord ToS**: Self-bot 사용은 Discord 약관 위반
2. **계정 위험**: 계정 정지 가능성
3. **토큰 보안**: 절대 토큰 공유 금지
4. **책임**: 본인 책임 하에 사용

---

## 📝 변경 이력

### v2.0.1 (현재)
- ✅ n8n-core 의존성 충돌 해결
- ✅ ENOTEMPTY 설치 오류 수정
- ✅ 패키지 크기 최적화

### v2.0.0
- 완전한 Discord API 지원
- 8개 리소스 타입 추가

---

## 🎊 이제 정상적으로 설치됩니다!

n8n Community Nodes에서 `n8n-nodes-discord-user`를 검색하여 설치하세요.

**설치 오류가 해결되었습니다!** ✅
