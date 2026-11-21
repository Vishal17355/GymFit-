# GymFit - Documentation & Architecture Suite

Welcome to the **GymFit** Architecture, Visual Design, and Presentation Suite. GymFit is an enterprise-ready, multi-tenant Fitness Tracking and Gym Management SaaS platform designed with a Modular Monolithic Architecture.

---

## 1. Documentation Organization

The project documentation is organized into three specialized, clean directories:

```
docs/
├── technical/        # In-depth architectural, database, API, and security specifications
├── visual/           # 10 production-grade architecture diagrams (Mermaid .mmd + Rendered .svg)
└── presentation/     # Presentation-ready slide deck script, viva/interview defense guide, Q&A
```

---

## 2. Directory Quick Links

### 📘 [Technical Documentation](technical/README.md)
Detailed engineering specifications for software architects, backend developers, frontend engineers, and security reviewers:
- **[01_system_architecture.md](technical/01_system_architecture.md)**: High-level system architecture & modular monolith paradigms.
- **[02_frontend_architecture.md](technical/02_frontend_architecture.md)**: React 18+ SPA architecture, Tailwind CSS design tokens, route guards.
- **[03_backend_architecture.md](technical/03_backend_architecture.md)**: Spring Boot 3 / Java 21 layered architecture, filter chains, DTO patterns.
- **[04_database_schema.md](technical/04_database_schema.md)**: MySQL 8.x schema DDL, foreign key relationships, compound indexing.
- **[05_api_documentation.md](technical/05_api_documentation.md)**: Comprehensive REST API catalog across all domains.
- **[06_module_documentation.md](technical/06_module_documentation.md)**: Detailed breakdown of the 9 domain modules.
- **[07_auth_and_security_flow.md](technical/07_auth_and_security_flow.md)**: Stateless dual-token JWT authentication, ThreadLocal multi-tenancy.

### 🎨 [Visual Documentation & Diagram Guide](visual/DIAGRAMS_GUIDE.md)
Contains both `.mmd` (Mermaid source) and `.svg` (Rendered vector graphics) along with simple English explanations and verbal presentation scripts:
1. **[01_high_level_system_architecture.svg](visual/01_high_level_system_architecture.svg)** | [Source](visual/01_high_level_system_architecture.mmd)
2. **[02_frontend_backend_communication.svg](visual/02_frontend_backend_communication.svg)** | [Source](visual/02_frontend_backend_communication.mmd)
3. **[03_database_er_diagram.svg](visual/03_database_er_diagram.svg)** | [Source](visual/03_database_er_diagram.mmd)
4. **[04_user_roles_and_permissions.svg](visual/04_user_roles_and_permissions.svg)** | [Source](visual/04_user_roles_and_permissions.mmd)
5. **[05_registration_and_login_flow.svg](visual/05_registration_and_login_flow.svg)** | [Source](visual/05_registration_and_login_flow.mmd)
6. **[06_workout_creation_and_assignment_workflow.svg](visual/06_workout_creation_and_assignment_workflow.svg)** | [Source](visual/06_workout_creation_and_assignment_workflow.mmd)
7. **[07_gym_registration_workflow.svg](visual/07_gym_registration_workflow.svg)** | [Source](visual/07_gym_registration_workflow.mmd)
8. **[08_membership_and_payment_workflow.svg](visual/08_membership_and_payment_workflow.svg)** | [Source](visual/08_membership_and_payment_workflow.mmd)
9. **[09_application_data_flow.svg](visual/09_application_data_flow.svg)** | [Source](visual/09_application_data_flow.mmd)
10. **[10_deployment_architecture.svg](visual/10_deployment_architecture.svg)** | [Source](visual/10_deployment_architecture.mmd)

### 🎤 [Presentation & Defense Guide](presentation/README.md)
Everything required for project defense, college viva, or technical interviews:
- **[PROJECT_PRESENTATION.md](presentation/PROJECT_PRESENTATION.md)**: Complete 12-section project write-up (Problem, Solution, Objectives, Stack, Security, Workflows, Future Roadmap).
- **[SLIDE_DECK_OUTLINE.md](presentation/SLIDE_DECK_OUTLINE.md)**: 10-slide script with speaker notes, verbal timings, and model answers for difficult technical examiner questions.
