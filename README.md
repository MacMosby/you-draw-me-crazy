# ft_transcendence

_This project has been created as part of the 42 curriculum by lde-taey, mrodenbu, nandreev, nboer, sgramsch.
_
## Description
You Draw Me Crazy is a full-stack web application built as part of the 42 curriculum, within the project called ft_transcendence.
The project combines real-time multiplayer gameplay with modern web technologies and a containerized development workflow.

Core goals of the project:
- Build a responsive, browser-based multiplayer experience.
- Implement real-time communication using WebSockets.
- Organize the codebase into a clear frontend/backend architecture.
- Run the full stack reproducibly via Docker.

---

## Instructions

### Prerequisites
- Docker + Docker Compose
- GNU Make

### Start the project
From the repository root:

```bash
make
```

This command:
1. Synchronizes shared type files between backend and frontend.
2. Builds Docker images.
3. Starts containers in detached mode.

### Access the app
- Frontend: `http://localhost:5173`
- Backend service runs inside Docker and is used by the frontend.

### Useful commands
- `make clean` → Stop containers and remove volumes (keeps images).
- `make fclean` → Full cleanup (containers, volumes, images).
- `make re` → Full rebuild from scratch.

### Notes
- Backend and frontend are containerized in `requirements/backend` and `requirements/frontend`.
- PostgreSQL runs as a dedicated service (`postgres:16-alpine`).
- Shared files are copied from `requirements/backend/shared` to `requirements/frontend/shared` via `make sync-shared`.

---

## Technical Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, React Router
- **Backend:** NestJS, TypeScript, Socket.IO
- **Database:** PostgreSQL + Prisma ORM
- **Infra:** Docker, Docker Compose, Makefile workflow
--> TODO: explain major architectural decisions
---

## Database Scheme

TODO
---

## Features List
The following list reflects the implemented project scope and ownership. 

### 1) User Management & Authentication

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] User sign up / login | Users can create accounts with email/password | NestJS auth flow with DB-backed user records | mrodenbu, nboer, nandreev, sgramsch |
| [B] User session management | Keep users logged in during gameplay | Session/JWT-based auth state used by frontend socket/game flow | lde-taey, nboer, nandreev |
| [B] Database for users | Store user credentials and basic profile | Prisma schema + migrations for user persistence | sgramsch |

### 2) Rooms & Multiplayer

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] Automatic room assignment | Users automatically join a room with available players | Server handles room entry and capacity checks | mrodenbu, nboer, sgramsch |
| [B] Server-controlled drawer rotation | Server determines who draws next | Deterministic turn order managed by backend game state | sgramsch |
| [B/F] Round timer & score tracking | Each round has a timer; scores tracked per player | Server-authoritative scoring/timing, frontend live rendering | mrodenbu, nboer, lde-taey |
| [B] Multiplayer support | Support at least 2+ simultaneous players | Real-time sync of canvas, guesses, and scores | mrodenbu, nboer, nandreev |

### 3) Game Mechanics

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [F] Canvas drawing | Drawer can draw lines; guessers see updates in real-time | Frontend drawing board integrated with socket events | lde-taey, nandreev |
| [B/F] Guess submission | Players submit guesses; server checks correctness | Server handles scoring and round completion | mrodenbu, nboer, lde-taey |
| [B] Core game loop | Round starts, drawer draws, guessers submit guesses, round ends | Deterministic, server-authoritative state transitions | mrodenbu, nboer, sgramsch |

### 4) Frontend & UI

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [F] Minimal UI layout | Canvas, player list, scoreboard, guess input | Tailwind-based responsive layout and reusable components | lde-taey, nandreev |
| [F] Real-time updates | Canvas strokes, scores, guesses updated live | WebSocket client event handling + UI state updates | lde-taey, nandreev |
| [F] Privacy Policy & Terms | Static pages accessible from navigation | Static legal/info pages integrated into navigation | lde-taey, nandreev |
| [F] Responsive design | Works on desktop and mobile | Mobile-first adjustments with Tailwind utility classes | lde-taey, nandreev |

### 5) Infrastructure / DevOps

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] Containerization | Backend, frontend, DB run in Docker / single command | `docker-compose.yml` + Makefile orchestration | sgramsch, mrodenbu |
| [B] Environment variables | Store secrets (`.env`), include example file (`.env.example`) | Centralized env usage across services | sgramsch, nboer |
| [B] HTTPS | Use HTTPS for backend endpoints | Self-signed certs accepted for dev; required for production | mrodenbu, nboer, sgramsch |

### 6) Real-Time Communication

| Task | Description | Notes / Design Decisions | Implemented by |
| --- | --- | --- | --- |
| [B] WebSocket setup | Connect clients to server for real-time updates | Handles canvas, guesses, and player events | mrodenbu, nboer, nandreev |
| [B/F] Event handling | Drawer strokes, guess submissions, score updates | Server-authoritative events to prevent desync | mrodenbu, nboer, lde-taey, nandreev, sgramsch |

---

## Modules:

| Module | Points | Justification | Implementation | Worked on by |
| --- | --- | --- | --- | --- |
| total | 11 / 14 | - | - | -Maybe just use who could respond to the questions the best |
| Use a framework for both the frontend and backend. | 2 |  | Backend: NestJS Frontend: Tailwind |  |
|  Implement real-time features using WebSockets or similar technology. | 2 | Real time updates on the game progress (drawing, scores …) |  | all |
| Use an ORM for the database. | 1 |  | Prisma | sgramsch |
| Implement a complete web-based game where users can play against eachother. | 2 |  |  | all |
| Remote players — Enable two players on separate computers to play the same game in real-time. | 2 |  |  | all |
| Multiplayer game (more than two players). | 2 |  |  | all |
|  |  |  |  |  |
| OPTIONAL |  |  |  |  |
| Support for multiple languages (at least 3 languages). | 1 |  |  |  |
| Support for additional browsers. | 1 |  |  |  |
|  Game customization options | 1 |  |  |  |

TODO: add justificaton for every module choice, and an explanation on how it was implemented 

## Individual Contributions:

### lde-taey:

- Project owner
- Frontend developer: focused on UI components, layout, lobby management, and event flow integration with backend

### mrodenbu

- Backend developer

### nandreev:

- Tech lead
- Frontend developer

### nboer

- Backend developer
- DTOs

### sgramsch:

- Backend developer
- Database & Prisma
  
TO DO: we need a more detailed breakdown of what each team member contributed.
we should also mention specific features, modules, or components implemented by each person 


---

## Team Information

| Team member | Role | Responsibilities |
| --- | --- | --- |
| mrodenbu, nboer | Developer | Implementation and feature development |
| sgramsch | Project Manager | Organize the team’s work, plan and moderate team meetings, maintain task board, documentation, balance ideas with time and effort constraints |
| lde-taey | Project Owner | Defines product vision, prioritizes features, considers user needs, evaluation organization |
| nandreev | Tech Lead | Technical direction, architecture decisions, implementation guidance |

---

## Project Management

### How the team organized the work
- Work was split into backend, frontend, and integration streams.
- Shared data contracts were synchronized across services.
- Responsibilities were distributed by role and tracked continuously in biweekly meetings (online and in school), and conversations on Slack.

### Tools used for project management
- **GitHub**
	- Source control
	- Pull requests and review workflow: we protected the main and each pull request was reviewed by another team member
	- Issue/task tracking
- **Notion**
	- Was used to track the project in full
    - Gathered information and resources
	- Task distribution overview
	- Research notes
 - **Figma**
	- Used in an initial phase to create a flow chart with a usage visualization
 - **Canva**
	- Tool used to support the layout design
	- Source for images and icons

### Challenges

- Setup complexity: We spent significant time on Docker setup, frontend dependencies, rebasing branches, and understanding school environment constraints vs. real-world usage.
- WebSocket integration: Coordinating WSS implementation across frontend and backend required dedicated research sprints, separate check-in calls, and careful assignment of ownership.
- Frontend/backend sync: it took us a while to sync both sides, agree on shared types, and clarify who owns which event/endpoint.
- Deadline pressure: the original deadline of 1.3.26 was missed
- Scope management: ;odule selection (23.2) required explicit effort/desirability trade-off analysis, with some features (e.g. full User Management) deprioritized due to complexity.

---

## Resources
- 42 project subject and evaluation criteria
- NestJS documentation: https://docs.nestjs.com
- React documentation: https://react.dev
- Socket.IO documentation: https://socket.io/docs/v4
- Prisma documentation: https://www.prisma.io/docs
- Docker documentation: https://docs.docker.com

### AI Usage
AI tools were used in a supportive role for brainstorming, debugging hints, documentation polishing, and quick syntax checks. The project architecture, feature decisions, implementation choices, testing, and final validation were done by the team. AI was treated as an assistant to improve workflow efficiency, not as a replacement for individual understanding or ownership of the code.
