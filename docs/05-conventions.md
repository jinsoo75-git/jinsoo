# 05. Conventions

## 명명 규칙 (Naming)

| 대상 | 규칙 |
|---|---|
| 백엔드 (Python) | `snake_case` |
| 프론트엔드 (JS 변수/함수) | `camelCase` |
| 컴포넌트 | `PascalCase` |
| 식별자 | 영어만 사용 |
| 주석 | 한국어만 사용 |

## 금지 사항 (5개)

| 금지 | 이유 | 대안 |
|---|---|---|
| `print` 디버깅 | 노이즈 발생, 프로덕션 로그와 혼재 | `logging` 모듈 사용 |
| bare `except` | 예외 삼킴, 원인 파악 불가 | `except SpecificError`처럼 구체적 예외 지정 |
| 비밀번호 하드코딩 | 보안 사고 위험 | `.env` + `os.getenv()` 사용 |
| `any` 타입 (TS) | 타입 의미 상실 | 명시적 타입 정의 |
| `!important` | CSS 우선순위 꼬임 | 셀렉터 구조/특이성 개선 |

## 테스트

- 테스트 프레임워크: **pytest**
- 각 API 엔드포인트마다 다음 케이스를 포함:
  - 정상 케이스
  - 검증 실패 케이스 (`400`)
  - 리소스 없음 케이스 (`404`)

## Git 커밋 규칙

- 커밋 접두사: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- 접두사 뒤에 **한국어 요약**을 붙인다.
- 형식: `<type>: <한국어 요약>`
  - 예: `feat: Task 생성 API 추가`
  - 예: `docs: Phase 1 설계 문서 7종 작성`
