# GymFit - Authentication & Authorization Flow

## 1. Authentication Architecture (Stateless Dual-Token JWT)

GymFit employs a stateless dual-token authentication mechanism designed to protect multi-tenant boundaries while minimizing database session lookup overhead.

```
Member / Client                 Backend Gateway               Database
      │                                │                         │
      │ 1. POST /api/v1/auth/login     │                         │
      │    (email, password)           │                         │
      ├───────────────────────────────>│                         │
      │                                │ 2. Verify User & Hash   │
      │                                ├────────────────────────>│
      │                                │    (BCrypt compare)     │
      │                                │<────────────────────────┤
      │                                │                         │
      │                                │ 3. Generate Signed JWTs │
      │                                │    - Access (15 min)    │
      │                                │    - Refresh (7 days)   │
      │ 4. 200 OK                      │                         │
      │    (Access Token + Refresh)    │ 5. Store Refresh Hash   │
      │<───────────────────────────────┼────────────────────────>│
      │                                │                         │
```

---

## 2. Request Authorization & Multi-Tenant Pipeline

Every API call after authentication follows this pipeline:

```
                      Incoming HTTP Request (Header: "Bearer <token>")
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          JwtAuthenticationFilter             │
                      │  - Validates HMAC-SHA256 signature           │
                      │  - Verifies token is not expired             │
                      │  - Extracts UserDetails, Roles & gymId       │
                      │  - Sets Spring SecurityContextHolder         │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │            TenantContextFilter               │
                      │  - Reads gymId from validated claims         │
                      │  - Sets ThreadLocal TenantContext            │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          Controller Layer Guard              │
                      │  - Checks @PreAuthorize("hasRole(...)")      │
                      │  - Invokes custom TenantGuard evaluator      │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │         Hibernate Tenant Filter              │
                      │  - Automatically appends "gym_id = :gymId"   │
                      │    to all JPA queries                        │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │           Safe MySQL Execution               │
                      │  - Strictly isolated tenant records returned │
                      └──────────────────────────────────────────────┘
```

---

## 3. JWT Claims Specification

```json
{
  "sub": "1048",
  "iss": "gymfit-api",
  "email": "sarah.member@apexfit.com",
  "role": "ROLE_MEMBER",
  "gymId": 24,
  "branchId": 3,
  "iat": 1793623000,
  "exp": 1793623900
}
```

- `sub`: Internal unique `user_id`.
- `role`: Grants coarse authorization (`ROLE_PLATFORM_ADMIN`, `ROLE_GYM_OWNER`, `ROLE_TRAINER`, `ROLE_MEMBER`).
- `gymId`: Discriminator used by `TenantContextFilter`. `null` exclusively for `ROLE_PLATFORM_ADMIN`.
- `exp`: 15-minute access window. Expired tokens are automatically refreshed via `/api/v1/auth/refresh` without prompting the user to re-authenticate.
