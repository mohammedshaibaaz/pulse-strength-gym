# 🏋️ Pulse Strength Club - Full-Stack Gym Booking System

> **DEMO PORTFOLIO PROJECT** - Showcasing full-stack development skills with MERN stack (MongoDB, Express, Node.js, React/Vanilla JS)

A premium gym website with a complete class booking system featuring real-time availability tracking, email notifications, and database integration.

## 🎯 Project Purpose

This is a **portfolio demonstration project** built to showcase:
- ✅ Full CRUD operations (Create bookings, Read classes, Update capacity, Delete bookings)
- ✅ RESTful API design
- ✅ Database schema design and integration
- ✅ Real-time capacity tracking
- ✅ Email notifications with Nodemailer
- ✅ Frontend-backend communication
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Google Analytics 4 integration

## 🚀 Tech Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - Class booking, modal interactions, API communication
- **Google Analytics 4** - Event tracking and conversion monitoring

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for RESTful API
- **MongoDB** - NoSQL database for classes and bookings
- **Mongoose** - ODM for MongoDB
- **Nodemailer** - Email notifications
- **express-validator** - Input validation

### Deployment
- **Vercel** - Frontend and serverless backend hosting
- **MongoDB Atlas** - Cloud database (free tier)

## 📁 Project Structure

```
pulse-gym/
├── index.html             # Main HTML file
├── styles.css             # Styling
├── script.js              # General JavaScript
├── booking.js             # Booking system JavaScript
├── server/                # Backend
│   ├── index.js          # Express server
│   ├── routes/
│   │   └── booking.js    # API routes
│   ├── models/
│   │   ├── Class.js      # Class schema
│   │   └── Booking.js    # Booking schema
│   ├── config/
│   │   └── db.js         # Database connection
│   └── utils/
│       ├── email.js      # Nodemailer setup
│       └── seed.js       # Database seeder
├── images/               # Image assets
├── package.json          # Dependencies
├── vercel.json           # Vercel config
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "pulse gym"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB Database

**Option A: MongoDB Atlas (Recommended for deployment)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password

**Option B: Local MongoDB**
```bash
# Install MongoDB locally and use:
mongodb://localhost:27017/pulse-gym
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulse-gym?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Pulse Strength Club <noreply@pulsestrength.club>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Gmail Setup:**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the app password in `EMAIL_PASSWORD`

### 5. Seed the Database

Populate the database with sample classes:

```bash
npm run seed
```

This creates 20+ classes across all days of the week.

### 6. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

### 7. Configure Google Analytics 4

1. Create a GA4 property at [Google Analytics](https://analytics.google.com/)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Replace `G-XXXXXXXXXX` in `index.html` with your actual ID

## 🌐 Deployment on Vercel

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy

**Via GitHub (Recommended):**
1. Push your code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/new)
3. Vercel auto-detects configuration from `vercel.json`

**Via CLI:**
```bash
vercel
```

### 3. Configure Environment Variables in Vercel

In Vercel Dashboard → Settings → Environment Variables, add:
- `MONGODB_URI`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`
- `FRONTEND_URL` (your Vercel domain)

### 4. Update Frontend API URL

In `booking.js`, update:
```javascript
const API_URL = 'https://your-project.vercel.app/api';
```

## 📡 API Endpoints

### Get All Classes
```
GET /api/classes
```
Returns all available classes with booking information.

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "...",
      "name": "Strength Foundations",
      "trainer": "Mohammed Altaf",
      "day": "Monday",
      "time": "06:00 AM",
      "duration": 60,
      "capacity": 8,
      "booked_count": 3,
      "difficulty": "Beginner",
      "category": "Strength",
      "available_spots": 5,
      "is_full": false
    }
  ]
}
```

### Book a Class
```
POST /api/book
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+49123456789",
  "class_id": "...",
  "emergency_contact": "Jane Doe +49987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Class booked successfully! Check your email for confirmation.",
  "data": { ... }
}
```

### Get User Bookings
```
GET /api/bookings/:email
```

### Cancel Booking
```
DELETE /api/booking/:id
```

## 🎨 Features

### Frontend Features
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Class Schedule** - Weekly grid layout with real-time availability
- ✅ **Booking Modal** - Interactive form with validation
- ✅ **Loading States** - Skeleton screens and spinners
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Accessibility** - ARIA labels, keyboard navigation
- ✅ **SEO Optimized** - Meta tags, schema markup
- ✅ **Performance** - Lazy loading, optimized images

### Backend Features
- ✅ **RESTful API** - Clean endpoint design
- ✅ **Database Integration** - MongoDB with Mongoose ODM
- ✅ **Input Validation** - express-validator for security
- ✅ **Error Handling** - Centralized error middleware
- ✅ **Email Notifications** - HTML emails via Nodemailer
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Environment Config** - dotenv for secrets management

### Analytics & Tracking
- ✅ **Google Analytics 4** - Page view tracking
- ✅ **Event Tracking** - Class booking events
- ✅ **Conversion Tracking** - Booking completion goals
- ✅ **User Flow Analysis** - Homepage → Schedule → Booking

## 🔐 Security Considerations

- Input validation on both frontend and backend
- Email normalization and sanitization
- MongoDB injection protection via Mongoose
- CORS configuration for API access
- Environment variables for sensitive data
- Rate limiting (recommended for production)

## 📊 Database Schema

### Class Model
```javascript
{
  name: String,
  description: String,
  trainer: String,
  day: String (enum),
  time: String,
  duration: Number,
  capacity: Number,
  booked_count: Number,
  difficulty: String (enum),
  category: String (enum),
  timestamps: true
}
```

### Booking Model
```javascript
{
  user_name: String,
  email: String,
  phone: String,
  emergency_contact: String,
  class_id: ObjectId (ref: Class),
  booking_date: Date,
  status: String (enum),
  timestamps: true
}
```

## 🚧 Future Enhancements

- [ ] User authentication with JWT
- [ ] Magic link login system
- [ ] Booking history dashboard
- [ ] Payment integration (Stripe)
- [ ] Waiting list functionality
- [ ] Class cancellation by admin
- [ ] Email reminders before class
- [ ] Rating and review system
- [ ] Mobile app (React Native)

## 📝 License

This is a portfolio demonstration project. Feel free to use it as inspiration for your own projects.

## 👨‍💻 Author

**Mohammed Altaf Hussain** (or your name)
- Portfolio: [your-portfolio.com]
- LinkedIn: [your-linkedin]
- GitHub: [your-github]

## 🙏 Acknowledgments

- Frontend design inspired by modern gym websites
- Icons and images placeholder (replace with actual assets)
- Email templates adapted from email best practices

---

**Note:** This is a demo project for portfolio purposes. Replace placeholder data (emails, analytics IDs, etc.) with real values for production use.
