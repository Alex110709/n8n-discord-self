# n8n-nodes-discord-self

n8n용 Discord Self-Bot 노드 - 사용자 계정으로 Discord 상호작용을 자동화합니다.

> ⚠️ **경고**: Self-bot 사용은 Discord 서비스 약관을 위반합니다. 본인의 책임 하에 사용하세요. 계정이 정지될 수 있습니다.

## 기능

이 패키지는 다음 기능을 제공하는 커스텀 n8n 노드입니다:

- 📤 채널에 메시지 전송
- 📥 채널에서 메시지 읽기
- 👍 이모지로 메시지에 반응
- ✏️ 본인 메시지 수정
- 🗑️ 본인 메시지 삭제
- 👤 사용자 정보 조회

## 설치

### 커뮤니티 노드 (권장)

1. n8n 인스턴스에서 **Settings** > **Community Nodes**로 이동
2. **Install** 클릭 후 `n8n-nodes-discord-self` 입력
3. **Install** 클릭 후 위험성에 동의

### 수동 설치

```bash
cd ~/.n8n/custom
npm install n8n-nodes-discord-self
```

설치 후 n8n을 재시작하세요.

## 필수 요구사항

- n8n 버전 0.199.0 이상
- Discord 사용자 계정 토큰

## Discord 토큰 얻기

1. 웹 브라우저에서 Discord 열기
2. `F12`를 눌러 개발자 도구 열기
3. **Network** 탭으로 이동
4. Discord에서 아무 메시지나 전송
5. `discord.com/api`로의 요청 찾기
6. 요청 헤더에서 `authorization` 헤더 찾기
7. 토큰 값 복사 (이것이 사용자 토큰입니다)

> ⚠️ **절대 토큰을 타인과 공유하지 마세요!**

## 설정

### 자격 증명 설정

1. n8n에서 **Credentials** > **New**로 이동
2. **Discord Self-Bot API** 검색
3. Discord 사용자 토큰 입력
4. **Save** 클릭

## 작업

### 메시지 전송 (Send Message)

Discord 채널에 메시지를 전송합니다.

**매개변수:**
- `Channel ID` (필수): 채널 ID
- `Message Content` (필수): 전송할 텍스트 내용

**예시:**
```json
{
  "channelId": "123456789012345678",
  "content": "n8n에서 안녕하세요!"
}
```

### 메시지 읽기 (Read Messages)

채널의 최근 메시지를 가져옵니다.

**매개변수:**
- `Channel ID` (필수): 채널 ID
- `Limit` (선택): 가져올 메시지 수 (1-100, 기본값: 10)

**출력:**
```json
{
  "messageId": "987654321098765432",
  "channelId": "123456789012345678",
  "content": "메시지 텍스트",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": "111111111111111111",
    "username": "사용자명",
    "discriminator": "1234"
  }
}
```

### 메시지 반응 (React to Message)

메시지에 이모지 반응을 추가합니다.

**매개변수:**
- `Channel ID` (필수): 채널 ID
- `Message ID` (필수): 메시지 ID
- `Emoji` (필수): 반응할 이모지 (예: 👍, ❤️, 또는 커스텀 이모지)

### 메시지 수정 (Edit Message)

본인의 메시지를 수정합니다.

**매개변수:**
- `Channel ID` (필수): 채널 ID
- `Message ID` (필수): 수정할 메시지 ID
- `New Content` (필수): 새로운 텍스트 내용

### 메시지 삭제 (Delete Message)

본인의 메시지를 삭제합니다.

**매개변수:**
- `Channel ID` (필수): 채널 ID
- `Message ID` (필수): 삭제할 메시지 ID

### 사용자 정보 조회 (Get User Info)

Discord 사용자의 정보를 가져옵니다.

**매개변수:**
- `User ID` (필수): 사용자 ID

**출력:**
```json
{
  "id": "111111111111111111",
  "username": "사용자명",
  "discriminator": "1234",
  "bot": false,
  "avatar": "해시",
  "avatarURL": "https://cdn.discordapp.com/avatars/...",
  "createdAt": "2020-01-01T00:00:00.000Z"
}
```

## Discord ID 가져오기

### 채널 ID
1. Discord에서 개발자 모드 활성화 (사용자 설정 > 고급 > 개발자 모드)
2. 채널 우클릭
3. **ID 복사** 클릭

### 메시지 ID
1. 개발자 모드 활성화
2. 메시지 우클릭
3. **ID 복사** 클릭

### 사용자 ID
1. 개발자 모드 활성화
2. 사용자 우클릭
3. **ID 복사** 클릭

## 예제 워크플로우

### 자동 응답 봇

특정 키워드가 포함된 메시지에 자동으로 응답하는 워크플로우를 만듭니다.

### 메시지 로거

특정 채널의 모든 메시지를 데이터베이스나 스프레드시트에 기록합니다.

### 예약 공지

일정에 따라 채널에 자동으로 메시지를 전송합니다.

## 문제 해결

### 오류: Invalid Token
- 토큰을 정확히 복사했는지 확인
- 새로운 토큰 발급 시도
- Discord 계정이 잠기지 않았는지 확인

### 오류: Missing Permissions
- 접근 권한이 있는 채널에만 상호작용 가능
- 본인의 메시지만 수정/삭제 가능

### 속도 제한
- Discord는 API 요청에 속도 제한이 있습니다
- 노드가 자동으로 속도 제한을 처리합니다
- 짧은 시간에 너무 많은 요청을 보내지 마세요

## 보안

- Discord 토큰을 **절대** 버전 관리 시스템에 커밋하지 마세요
- n8n의 자격 증명 시스템을 사용하여 토큰을 안전하게 저장하세요
- 토큰이 유출된 경우 정기적으로 교체하세요

## 법적 고지

이 도구는 교육 목적으로만 제공됩니다. Self-bot 사용은 Discord 서비스 약관(§6.3)을 위반합니다. 이 노드를 사용함으로써 다음을 인정합니다:

- Discord 계정이 정지될 수 있습니다
- 개발자는 어떠한 결과에도 책임이 없습니다
- 본인의 책임 하에 이 도구를 사용합니다

## 지원

- 이슈 보고: [GitHub Issues](https://github.com/Alex110709/n8n-discord-self/issues)
- n8n 커뮤니티: [community.n8n.io](https://community.n8n.io)

## 라이선스

MIT 라이선스 - 자세한 내용은 LICENSE 파일 참조

## 기여

기여를 환영합니다! Pull Request를 자유롭게 제출해주세요.

## 변경 로그

### 1.0.0
- 최초 릴리스
- 기본 메시징 작업
- 사용자 정보 조회
- 메시지 반응
