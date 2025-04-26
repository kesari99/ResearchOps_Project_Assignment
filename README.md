# Project Management System with Daily Standups

A full-featured project management platform with integrated daily standup meetings, role-based access control, and trello
style task boards.

## Key Features

### 🔐 User Authentication
- Secure JWT token-based login system
- Password protected accounts
- Session management

### 👥 Role-Based Access Control
- **Admin**: Full system access, user management
- **Manager**: Project creation, team management
- **Researcher**: Project creation, team management

### 📊 Project Management
- Create and organize projects with metadata
- Project progress tracking
- ![myProjects](https://github.com/user-attachments/assets/15dc20e1-738f-4245-8a9d-130d20210fe9)


### 🎯 Task Management
- Kanban-style boards (To Do, In Progress, Review, Done)
- Drag-and-drop task organization
- Priority levels, tags, and due dates
- Task history tracking
- 
![MyTasks](https://github.com/user-attachments/assets/28a0ed1f-c979-4352-bd9c-303e515b9ca7)

![Screenshot (180)](https://github.com/user-attachments/assets/c3ee498a-99c6-497e-ba39-926d095ff5f1)


### 📅 Daily Standup System
- Automated daily meeting prompts at 9 AM
- Structured update format:
  - What I did yesterday
  - What I'll do today
- Meeting history with timestamps

![DailyStandupMeeting](https://github.com/user-attachments/assets/0d50719e-9cf6-4a71-a690-64fbba13441e)

### 🔍 Search & Filtering
- Quick search across projects and tasks
- Advanced filtering options
- Recent items display



### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or local)
- Git

### Setup
1. Clone the repository:
   ```bash
   git https://github.com/kesari99/ResearchOps_Project_Assignment.git
   # In first terminal (for server)
    cd server
    npm run dev

    # In second terminal (for client)
    cd client
    npm run dev
   

