# 04. Tasks

## 진행 규칙

- **순서대로만 진행**: Phase 1 → Phase 2 → Phase 3. 이전 Phase가 끝나기 전 다음 Phase 착수 금지
- **병렬 금지**: 각 Phase 내 단계도 순서대로 하나씩 진행. 여러 단계를 동시에 진행하지 않음
- **단계별 검증 필수**: 각 단계는 '검증 방법' 항목을 통과해야 다음 단계로 넘어감

> 확장 단계(JWT 로그인, 팀, Kanban, 채팅, CI/CD 등)는 본 문서에 포함하지 않는다. 별도 문서에서 다룬다.

---

## Phase 1 — 설계 (CLAUDE.md + docs/ 6종 작성)

**상태: 완료**

| # | 단계 | 검증 방법 |
|---|---|---|
| 1 | `CLAUDE.md` 작성 (역할/절대 규칙/모호 요청 처리) | 파일 존재 및 5개 절대 규칙 포함 확인 |
| 2 | `docs/00-overview.md` 작성 | 문서 지도 표 + 읽는 순서 + 관심사 분리 설명 포함 확인 |
| 3 | `docs/01-product.md` 작성 | 목표/페르소나/MVP 범위/UI 톤/확장/범위 외/성공 기준 포함 확인 |
| 4 | `docs/02-specs.md` 작성 | Task 모델/검증 규칙/REST API 5개/화면 명세 포함 확인 |
| 5 | `docs/03-design.md` 작성 | 8개 결정표(선택/대안/근거/트레이드오프) 포함 확인 |
| 6 | `docs/04-tasks.md` 작성 (본 문서) | Phase 1~3 체크리스트와 진행 규칙 포함 확인 |
| 7 | `docs/05-conventions.md` 작성 | 코딩 컨벤션/커밋 규칙 포함 확인 |
| 8 | 6개 문서 간 상호 참조 정합성 확인 | 문서 간 필드명/API 경로/모델명이 서로 일치하는지 대조 |
| 9 | `CLAUDE.md`의 문서 읽기 순서와 실제 파일명 일치 확인 | `00→01→02→03→04→05` 순서와 실제 파일명 대조 |
| 10 | Phase 1 완료 승인 | 사용자에게 6개 문서 내용 요약 보고 후 승인받음 |

---

## Phase 2 — 백엔드 (`backend/` FastAPI → CRUD API 5개 → Swagger 확인)

**상태: 완료**

| # | 단계 | 검증 방법 | 완료 |
|---|---|---|---|
| 1 | `backend/` 디렉터리 및 FastAPI 프로젝트 구조 생성 | 디렉터리 구조가 `03-design.md`와 일치하는지 확인 | ✅ |
| 2 | 의존성 설치 (FastAPI, Uvicorn, SQLAlchemy 등) | `requirements.txt` 또는 `pyproject.toml`에 명시, 서버 정상 기동 확인 | ✅ |
| 3 | SQLite 연결 및 SQLAlchemy 세팅 | 앱 기동 시 DB 파일 생성 확인 | ✅ |
| 4 | Task 모델 정의 (`02-specs.md` 필드 기준) | 모델 필드가 명세와 1:1 일치하는지 코드 리뷰 | ✅ |
| 5 | Pydantic 스키마 정의 (요청/응답, 검증 규칙 포함) | title/status/due_at 위반 시 `400` 반환 테스트 | ✅ |
| 6 | `POST /api/tasks` 구현 | 정상 생성 시 `201` 및 생성된 리소스 반환 확인 | ✅ |
| 7 | `GET /api/tasks`, `GET /api/tasks/:id` 구현 | 목록은 `description` 제외, 단건은 포함 여부 확인. 없는 id → `404` | ✅ |
| 8 | `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` 구현 | 부분 수정 `200`, 삭제 `204`, 없는 id → `404` 확인 | ✅ |
| 9 | 단위/통합 테스트 작성 및 실행 | 전체 테스트 통과 (`pytest` 등) 확인 | ✅ (13개 통과, `05-conventions.md` 매트릭스 기준 PUT 400 케이스 포함) |
| 10 | Swagger UI(`/docs`)에서 5개 API 동작 확인 | Swagger에서 각 엔드포인트 직접 호출하여 응답 코드/본문 확인 | ✅ |

**추가 발견 및 조치**: 브라우저 실검증 중 프론트-백엔드 간 CORS 차단 발견 → `CORSMiddleware` 추가로 수정 (`fix: CORS 미들웨어 추가로 프론트-백엔드 통신 차단 문제 해결`)

---

## Phase 3 — 프론트엔드 (`frontend/` HTML+JS+Tailwind → 메인 화면 → API 연결 → git push)

**상태: 완료**

| # | 단계 | 검증 방법 | 완료 |
|---|---|---|---|
| 1 | `frontend/` 디렉터리 및 기본 HTML 구조 생성 (Tailwind CDN 포함) | 브라우저에서 페이지 로드 및 Tailwind 클래스 적용 확인 | ✅ |
| 2 | 메인 화면 레이아웃 (카드 목록 + 추가 폼) 마크업 | 360px 너비에서 레이아웃 깨짐 없는지 확인 | ✅ (헤드리스 크롬으로 `scrollWidth === clientWidth === 360` 확인) |
| 3 | Mac OS 톤 디자인 토큰 적용 (rounded-xl, shadow-lg, backdrop-blur 등) | `03-design.md` 토큰값과 실제 클래스 대조 | ✅ |
| 4 | 라이트/다크 테마 토글 구현 (`localStorage`, `prefers-color-scheme`) | 새로고침 후 테마 유지 확인 | ✅ (토글 후 reload 시 `dark` 클래스 유지 확인) |
| 5 | API 연결: 목록 조회 및 카드 렌더링 (status 배지, D-N HH:MM 표시) | 실제 백엔드 데이터가 화면에 정확히 표시되는지 확인 | ✅ |
| 6 | API 연결: 추가/수정(모달)/삭제(휴지통+확인) 기능 구현 | CRUD 4종이 화면에서 각각 정상 동작하는지 수동 테스트 | ✅ (curl 기반 통합 시나리오로 확인) |
| 7 | 3초 폴링으로 목록 자동 갱신 구현 | 다른 클라이언트에서 변경 후 3초 내 반영 확인 | ✅ |
| 8 | 전체 동작 확인 후 git commit & push | `git log`로 커밋 확인, 원격 저장소에 반영 확인 | ✅ (`jinsoo75-git/jinsoo`로 push 완료) |

---

## 현재 진행 상태 요약

| Phase | 상태 |
|---|---|
| Phase 1 — 설계 | ✅ 완료 |
| Phase 2 — 백엔드 | ✅ 완료 (CORS 수정 포함) |
| Phase 3 — 프론트엔드 | ✅ 완료 (push 완료) |

MVP 3개 Phase 모두 완료. 다음 단계는 `01-product.md`의 확장 범위(JWT 로그인, 팀, Kanban, 채팅, CI/CD)이며, 별도 문서에서 계획한다.
