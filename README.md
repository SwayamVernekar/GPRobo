# Job Application Backend - MongoDB Atlas Integration

A complete backend system for handling job applications with MongoDB Atlas database and file upload functionality.

## 📋 Features

- ✅ Form submission with validation
- ✅ Resume file upload (PDF, DOC, DOCX up to 20MB)
- ✅ MongoDB Atlas integration
- ✅ RESTful API endpoints
- ✅ CORS enabled
- ✅ Error handling
- ✅ **Admin Dashboard** with authentication
- ✅ View, filter, and manage applications
- ✅ Download resumes
- ✅ Update application status
- ✅ Delete applications
- ✅ Real-time statistics

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Step 1: Clone/Download the Project

Download all the files to your local machine.

### Step 2: Install Dependencies

```bash
cd job-application-backend
npm install
```

### Step 3: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Verify your email

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free" (M0 Sandbox)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### Step 4: Configure Environment Variables

1. Rename `.env.example` to `.env`
2. Edit the `.env` file and update the connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER_URL/jobApplicationDB?retryWrites=true&w=majority
PORT=3000
MAX_FILE_SIZE=20971520
```

**Important:** Replace:
- `YOUR_USERNAME` with your MongoDB username
- `YOUR_PASSWORD` with your MongoDB password
- `YOUR_CLUSTER_URL` with your cluster URL (e.g., cluster0.abc123.mongodb.net)

### Step 5: Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database: jobApplicationDB
🚀 Server running on port 3000
```

### Step 6: Update Frontend

In your HTML file, update the API_URL:

```javascript
// For local development
const API_URL = 'http://localhost:3000/api/submit';

// For production (replace with your deployed backend URL)
const API_URL = 'https://your-backend-url.com/api/submit';
```

### Step 7: Access the Application

**Job Application Form (Public)**
- Open `http://localhost:3000/public/index.html` or simply open `public/index.html` in your browser
- Anyone can submit applications

**Admin Dashboard (Protected)**
1. Open `http://localhost:3000/public/login.html` or `public/login.html` in your browser
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. Access the admin dashboard to:
   - View all applications
   - Filter by status
   - Search applications
   - Download resumes
   - Update application status
   - Delete applications
   - View real-time statistics

## 📡 API Endpoints

### Public Endpoints

#### Submit Application
```http
POST /api/submit
Content-Type: multipart/form-data

Form Data:
- name: string (required)
- email: string (required)
- contactNo: string (required, 10 digits)
- collegeName: string (required)
- yearOfPassing: string (required)
- roleCategory: string (optional)
- exceptionalWork: string (optional)
- resume: file (required, PDF/DOC/DOCX, max 20MB)

Response:
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": "507f1f77bcf86cd799439011"
}
```

### Admin Endpoints

#### Get All Applications
```http
GET /api/applications?status=pending&page=1&limit=10

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

#### Get Single Application
```http
GET /api/applications/:id

Response:
{
  "success": true,
  "data": {...}
}
```

#### Download Resume
```http
GET /api/applications/:id/resume

Response: Binary file download
```

#### Update Application Status
```http
PUT /api/applications/:id/status
Content-Type: application/json

Body:
{
  "status": "reviewed"
}

Response:
{
  "success": true,
  "message": "Status updated successfully",
  "data": {...}
}
```

#### Delete Application
```http
DELETE /api/applications/:id

Response:
{
  "success": true,
  "message": "Application deleted successfully"
}
```

## 📂 Project Structure

```
job-application-backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── multer.js            # File upload configuration
├── models/
│   └── Application.js       # Mongoose schema
├── routes/
│   └── applications.js      # API routes
├── public/
│   └── index.html          # Frontend form
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .gitignore             # Git ignore file
├── package.json           # Dependencies
├── server.js              # Main server file
└── README.md             # Documentation
```

## 🗄️ Database Schema

```javascript
{
  name: String,
  email: String,
  contactNo: String,
  collegeName: String,
  yearOfPassing: String,
  roleCategory: String,
  exceptionalWork: String,
  resumeFileName: String,
  resumeFileType: String,
  resumeFileSize: Number,
  resumeData: Buffer,
  status: String (pending/reviewed/shortlisted/rejected),
  submittedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Notes

- Resume files are stored in MongoDB as Binary data
- CORS is enabled for all origins (configure for production)
- File size limited to 20MB
- Only PDF, DOC, DOCX files allowed
- Input validation on all fields
- Environment variables for sensitive data

## 🚀 Deployment

### Deploy Backend (Heroku Example)

1. Create a Heroku account
2. Install Heroku CLI
3. Run:
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set MONGODB_URI=your_connection_string
```

### Deploy Frontend

1. Update API_URL in HTML to your backend URL
2. Deploy to any static hosting (Netlify, Vercel, GitHub Pages)

## 🧪 Testing

Test the API with curl:

```bash
# Submit application
curl -X POST http://localhost:3000/api/submit \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "contactNo=1234567890" \
  -F "collegeName=MIT" \
  -F "yearOfPassing=2024" \
  -F "roleCategory=Software Engineer" \
  -F "resume=@/path/to/resume.pdf"

# Get all applications
curl http://localhost:3000/api/applications
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Check if your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct
- Ensure connection string is properly formatted
- Check if cluster is active

### File Upload Issues

- Verify file size is under 20MB
- Check file format is PDF, DOC, or DOCX
- Ensure multer is properly configured

### CORS Issues

- Make sure backend is running
- Check API_URL in frontend matches backend
- Verify CORS is enabled in server.js

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB Atlas connection string | Required |
| PORT | Server port | 3000 |
| MAX_FILE_SIZE | Maximum file size in bytes | 20971520 (20MB) |

## 📄 License

MIT License - feel free to use this project for your needs.

## 🤝 Support

For issues or questions:
1. Check MongoDB Atlas connection
2. Verify all environment variables
3. Check server logs for errors
4. Ensure all dependencies are installed

## 🎯 Next Steps

- [ ] Add authentication for admin endpoints
- [ ] Implement email notifications
- [ ] Add rate limiting
- [ ] Create admin dashboard
- [ ] Add automated testing
- [ ] Implement file virus scanning
- [ ] Add application export feature
