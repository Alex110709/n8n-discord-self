# Discord User v3.1.0 - 완전 통합

## 변경사항

현재 구조가 이미 충분히 간단합니다:
- Discord User (모든 작업)  
- Discord User Trigger (이벤트)

v3.1.0에서는 DM 기능을 강화하고 문서를 업데이트하겠습니다.

## 최종 결정

**2개 노드 유지:**
1. **Discord User** - 모든 작업 (Message, Profile, Server, etc.)
2. **Discord User Trigger** - 실시간 이벤트 + DM 전용 이벤트

이것이 가장 깔끔하고 n8n 표준에 맞습니다.
Trigger 노드는 별도로 유지하는 것이 n8n의 베스트 프랙티스입니다.
