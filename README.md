# ProTool - Project Management Dashboard

A comprehensive full-stack project management dashboard inspired by Asana, Jira, Trello, ClickUp, and Zoho Sprints.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (Admin, Project Manager, Team Member)
- Protected routes and middleware

### 📁 Project Management
- Create, update, and delete projects
- Project member management
- Project status tracking (Active, Completed, Archived)
- Project deadlines and descriptions

### 📌 Task Management (Kanban Style)
- Create, update, and delete tasks
- Drag and drop functionality
- Task assignment to team members
- Priority levels (Low, Medium, High)
- Status columns (Todo, In Progress, Review, Done)
- Comments on tasks
- File attachments

### 🏃 Sprint Management
- Create and manage sprints
- Sprint duration and status tracking
- Add tasks to sprints
- Burndown charts and analytics

### 📊 Dashboard Analytics
- Project overview metrics
- Task statistics by status and priority
- Team productivity insights
- Recent activity feed
- Project progress tracking

### 🔔 Notifications
- Task assignment notifications
- Status change alerts
- Comment notifications
- Sprint updates

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests

### Infrastructure
- **AWS EC2** for backend hosting
- **AWS RDS** for PostgreSQL database
- **AWS S3** for file storage

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd protool
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "MEMBER"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (Protected)

#### PUT /api/auth/profile
Update user profile (Protected)

#### PUT /api/auth/change-password
Change password (Protected)

### Project Endpoints

#### GET /api/projects
Get all projects for authenticated user (Protected)

#### GET /api/projects/:id
Get single project by ID (Protected)

#### POST /api/projects
Create new project (Protected)
```json
{
  "name": "Project Name",
  "description": "Project description",
  "deadline": "2024-12-31"
}
```

#### PUT /api/projects/:id
Update project (Protected)

#### DELETE /api/projects/:id
Delete project (Protected)

#### POST /api/projects/:id/members
Add member to project (Protected)

#### DELETE /api/projects/:id/members/:memberId
Remove member from project (Protected)

### Task Endpoints

#### GET /api/tasks/project/:projectId
Get all tasks for a project (Protected)

#### GET /api/tasks/:id
Get single task by ID (Protected)

#### POST /api/tasks/project/:projectId
Create new task (Protected)
```json
{
  "title": "Task Title",
  "description": "Task description",
  "priority": "MEDIUM",
  "assignedTo": 1,
  "sprintId": 1
}
```

#### PUT /api/tasks/:id
Update task (Protected)

#### DELETE /api/tasks/:id
Delete task (Protected)

#### PUT /api/tasks/order/update
Update task order for drag and drop (Protected)

### Sprint Endpoints

#### GET /api/sprints/project/:projectId
Get all sprints for a project (Protected)

#### GET /api/sprints/:id
Get single sprint by ID (Protected)

#### POST /api/sprints/project/:projectId
Create new sprint (Protected)
```json
{
  "name": "Sprint 1",
  "description": "Sprint description",
  "startDate": "2024-01-01",
  "endDate": "2024-01-14"
}
```

#### PUT /api/sprints/:id
Update sprint (Protected)

#### DELETE /api/sprints/:id
Delete sprint (Protected)

#### GET /api/sprints/:id/burndown
Get sprint burndown data (Protected)

### Dashboard Endpoints

#### GET /api/dashboard/analytics
Get dashboard analytics (Protected)

#### GET /api/dashboard/my-tasks
Get tasks assigned to current user (Protected)

#### GET /api/dashboard/notifications
Get user notifications (Protected)

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: User accounts with roles and authentication
- **Projects**: Project containers with members and tasks
- **ProjectMembers**: Many-to-many relationship between users and projects
- **Tasks**: Individual tasks with status, priority, and assignments
- **Sprints**: Time-bound iterations for task management
- **Comments**: Task discussions and updates
- **Attachments**: File attachments for tasks
- **Notifications**: User notifications and alerts

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- CORS configuration
- Rate limiting
- Security headers with Helmet

## 🚀 Deployment

### Backend Deployment (AWS EC2)

1. **Server Setup**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <repository-url>
cd protool/backend

# Install dependencies
npm install --production

# Set up environment variables
cp .env.example .env
# Edit .env with production values
```

2. **Database Setup**:
- Set up AWS RDS PostgreSQL instance
- Update DATABASE_URL in .env
- Run migrations: `npx prisma db push`

3. **Start Application**:
```bash
# Start with PM2
pm2 start index.js --name "protool-backend"

# Setup PM2 startup script
pm2 startup
pm2 save
```

4. **Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/protool/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### Frontend Deployment

1. **Build for Production**:
```bash
cd frontend
npm run build
```

2. **Deploy to Static Hosting**:
- Copy `dist` folder to web server
- Configure Nginx to serve static files
- Set up SSL certificate

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Development Notes

### Code Structure
- **Backend**: Clean architecture with controllers, routes, middleware, and services
- **Frontend**: Component-based architecture with context for state management
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: JWT tokens with refresh mechanism

### Best Practices
- Input validation on both client and server
- Error handling with proper HTTP status codes
- Environment variable configuration
- Code organization and modularity
- Security-first approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
