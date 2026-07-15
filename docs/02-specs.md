# 02. Specs

## Task 모델

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | - | - | 고유 식별자 |
| `title` | VARCHAR(200) | ✅ | 업무 제목 |
| `description` | TEXT | - | 업무 상세 설명 |
| `status` | ENUM(`todo`, `in_progress`, `done`) | - | 업무 상태. 기본값 `todo` |
| `due_at` | DATETIME (UTC) | - | 마감 시각 (선택) |
| `created_at` | DATETIME (UTC) | - | 생성 시각 |
| `updated_at` | DATETIME (UTC) | - | 최종 수정 시각 |

## 검증 규칙

| 대상 | 규칙 | 위반 시 |
|---|---|---|
| `title` | 필수, 1~200자 | `400 Bad Request` |
| `status` | `todo` / `in_progress` / `done` 중 하나 | `400 Bad Request` |
| `due_at` | ISO 8601 형식 (예: `2026-05-12T18:00:00Z`) | 형식 위반 시 `400 Bad Request` |
| 존재하지 않는 `id` 조회/수정/삭제 | - | `404 Not Found` |

## REST API

| Method | Path | 응답 코드 | 설명 |
|---|---|---|---|
| `POST` | `/api/tasks` | `201 Created` | Task 생성 |
| `GET` | `/api/tasks` | `200 OK` | Task 목록 조회 |
| `GET` | `/api/tasks/:id` | `200 OK` | Task 단건 조회 |
| `PUT` | `/api/tasks/:id` | `200 OK` | Task 부분 수정 |
| `DELETE` | `/api/tasks/:id` | `204 No Content` | Task 삭제 |

### 응답 필드 범위

- **목록 조회 (`GET /api/tasks`)**: `description` **제외**
- **단건 조회 (`GET /api/tasks/:id`)**: `description` **포함**

## 화면 명세 (CRUD 4종 모두 UI로 동작)

### 추가 — 폼

- 입력 필드: `title`, `due_at`, `status`
- 제출 시 `POST /api/tasks` 호출

### 목록 — 카드

- 각 Task는 카드 형태로 표시
- **status 배지** 표시 (todo / in_progress / done)
- 마감까지 남은 일수 및 시간 표시: **`D-N HH:MM`** 형식 (예: `D-3 09:30`)

### 수정 — 카드 클릭 → 모달

- 카드를 클릭하면 수정 모달이 열림
- 모달에서 `title`, `description`, `status`, `due_at` 수정 가능
- 저장 시 `PUT /api/tasks/:id` 호출 (부분 수정)

### 삭제 — 휴지통 아이콘 → 확인 → DELETE

- 카드에 휴지통 아이콘 표시
- 클릭 시 확인 다이얼로그 표시
- 확인 시 `DELETE /api/tasks/:id` 호출
