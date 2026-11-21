# GymFit - Frontend Architecture Specification

## 1. Technology Baseline

- **Framework**: React 18+ (Single Page Application)
- **Language**: JavaScript (ES2023+ modern syntax)
- **Styling**: Tailwind CSS (Utility-first, design tokens, responsive breakpoints)
- **Routing**: React Router v6
- **State Management**: React Context API + Local Storage for Auth; TanStack Query / SWR pattern for server-state caching.
- **HTTP Client**: Axios with custom interceptors for Bearer Token injection and silent refresh.

---

## 2. Component Hierarchy & Architectural Patterns

```
                                      App.jsx (Root Component)
                                                 │
                                                 ▼
                                     AuthProvider (AuthContext)
                                                 │
                                                 ▼
                                    BrowserRouter (React Router)
                                                 │
                 ┌───────────────────────────────┴───────────────────────────────┐
                 │                                                               │
                 ▼                                                               ▼
        Public Routes (Guest)                                           Protected Routes (Auth)
   ┌───────────────────────────┐                                                 │
   │  - /login                 │                                                 ▼
   │  - /forgot-password       │                                       RoleGuard (RBAC Gate)
   │  - /reset-password        │                                                 │
   └───────────────────────────┘                ┌────────────────────────────────┼────────────────────────────────┐
                                                │                                │                                │
                                                ▼                                ▼                                ▼
                                       Platform Admin View               Gym Owner View                     Member View
                                    ┌───────────────────────┐        ┌───────────────────────┐        ┌───────────────────────┐
                                    │ DashboardLayout       │        │ DashboardLayout       │        │ MobileMemberLayout    │
                                    │  - TenantTable        │        │  - OccupancyWidget    │        │  - DigitalPassCard    │
                                    │  - SaasPlanEditor     │        │  - MemberDirectory    │        │  - ActiveWorkoutLog   │
                                    │  - PlatformTelemetry  │        │  - TrainerRoster      │        │  - DietMacroTracker   │
                                    └───────────────────────┘        │  - FinancialReports   │        │  - ClassBookingGrid   │
                                                                     └───────────────────────┘        └───────────────────────┘
```

---

## 3. Core Directory Layout

```
src/
├── assets/                  # SVG Icons, images, tenant brand assets
├── components/
│   ├── common/              # Button, Input, Modal, Table, Badge, Card, StatBox
│   ├── layout/              # Sidebar, Navbar, MobileBottomNav, PageHeader
│   └── feedback/            # ToastNotification, Spinner, ErrorBoundary
├── context/
│   ├── AuthContext.jsx      # Current user profile, token state, login/logout handlers
│   └── TenantThemeContext.jsx # Gym branding color theme variables
├── hooks/
│   ├── useAuth.js           # Quick hook accessing AuthContext
│   ├── useApi.js            # Wrapper for loading/error state management
│   └── useDebounce.js       # Search input debouncer
├── routes/
│   ├── AppRoutes.jsx        # Route registry
│   ├── ProtectedRoute.jsx   # Checks authentication status
│   └── RoleGuard.jsx        # Validates user.role matches required route role
├── services/
│   ├── api.js               # Central Axios client with interceptors
│   ├── authService.js       # Login, refresh, logout API calls
│   ├── memberService.js     # Member CRUD and digital pass calls
│   ├── trainerService.js    # Trainer and client assignment calls
│   ├── workoutService.js    # Workout routines and log submissions
│   └── attendanceService.js # Check-in / Check-out QR verification
├── pages/                   # Role-scoped page views
└── utils/                   # DateTime, Currency, and Validation helpers
```

---

## 4. Key Frontend Design Patterns

1. **Atomic Reusable Components**: Buttons, form inputs, modal dialogs, and data tables are isolated from business logic for reuse across all 4 role portals.
2. **Silent JWT Refresh Interceptor**: Axios interceptor monitors outgoing calls; when a `401 Unauthorized` is returned, it pauses queued requests, invokes `/api/v1/auth/refresh`, and transparently replays the original requests without user interruption.
3. **Responsive Mobile-First Viewports**: Members primarily access GymFit via smartphones at the gym. The `MobileMemberLayout` provides a bottom tab-bar navigation, large QR check-in buttons, and quick tap-to-complete workout set inputs.
