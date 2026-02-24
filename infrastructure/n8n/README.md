# N8N Automation Stack — ScoreMyPrompt

Mini PC (Intel N100) 홈서버 자동화 인프라.

## Quick Start

```bash
# 1. 환경변수 설정
cp .env.example .env
nano .env  # 비밀번호 변경 필수!

# 2. 실행
docker compose up -d

# 3. 접속
open http://localhost:5678
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| N8N | 5678 | Workflow automation |
| PostgreSQL | 5432 | N8N data storage |
| Redis | 6379 | Queue & caching |

## Workflows

### WF-0: RSS Collector
- **주기:** 6시간마다
- **기능:** AI/프롬프트 관련 RSS → Google Sheets "RSS_Raw" 시트
- **설정:** Google Sheets ID 입력 필요

### WF-2: Content Draft Generator (Packing Assistant)
- **주기:** 매일 8AM EST
- **기능:** Content Calendar에서 `draft_needed` 슬롯 → Ollama로 초안 생성 → Sheets 업데이트
- **설정:** Google Sheets ID + Ollama 모델 설정

## Cloudflare Tunnel (선택)

외부에서 N8N webhook 접근이 필요한 경우:

```bash
# docker-compose.yml에서 cloudflared 서비스 주석 해제 후:
CLOUDFLARE_TUNNEL_TOKEN=your_token docker compose up -d
```

## 운영 참고

- **전력:** N100 6W TDP → 24시간 ~3,000원/월
- **백업:** `docker compose exec postgres pg_dump -U n8n n8n > backup.sql`
- **업데이트:** `docker compose pull && docker compose up -d`
- **로그:** `docker compose logs -f n8n`
