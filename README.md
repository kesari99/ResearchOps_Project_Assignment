# Project Management System with Daily Standups

![Project Dashboard](https://drive.google.com/file/d/1XE-miHu3dk5W9imcIalbR_HrQNC9Mo49/view?usp=sharing) <!-- Add your screenshot path -->

A full-featured project management platform with integrated daily standup meetings, role-based access control, and kanban-style task boards.

## Key Features

### 🔐 User Authentication
- Secure JWT token-based login system
- Password protected accounts
- Session management

### 👥 Role-Based Access Control
- **Admin**: Full system access, user management
- **Manager**: Project creation, team management
- **Researcher**: Task management, daily updates

### 📊 Project Management
- Create and organize projects with metadata
- Team assignment and collaboration
- Project progress tracking

### 🎯 Task Management
- Kanban-style boards (To Do, In Progress, Review, Done)
- Drag-and-drop task organization
- Priority levels, tags, and due dates
- Task history tracking

![Task Board](screenshots/board.gif) <!-- Add your GIF path -->

### 📅 Daily Standup System
- Automated daily meeting prompts at 9 AM
- Structured update format:
  - What I did yesterday
  - What I'll do today
  - Current blockers
- Meeting history with timestamps
- End-of-day edits available

![Meeting Mode](screenshots/meeting-modal.png) <!-- Add your screenshot path -->

### 🔍 Search & Filtering
- Quick search across projects and tasks
- Advanced filtering options
- Recent items display

![Search Results](screenshots/search.png) <!-- Add your screenshot path -->

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or local)
- Git

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-management-system.git
   cd project-management-system
