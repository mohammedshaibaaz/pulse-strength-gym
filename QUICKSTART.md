# 🚀 Quick Start Guide - Pulse Strength Club

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier) OR local MongoDB
- Gmail account (for email notifications)
- Git

## 5-Minute Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create `.env` File
Copy `.env.example` to `.env` and fill in:

```env
# MongoDB Atlas - Get from cloud.mongodb.com
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/pulse-gym

# Email - Use Gmail App Password
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=Pulse Strength <noreply@pulsestrength.club>

# Development
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3️⃣ Seed Database with Sample Classes
```bash
npm run seed
```

Expected output:
```
✅ MongoDB Connected
🗑️  Cleared existing classes
✅ Added 20 classes
✨ Database seeded successfully!
```

### 4️⃣ Start the Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

## ✅ Testing the Booking System

1. Navigate to the **Schedule** section
2. Click "Book Class" on any available class
3. Fill in the form:
   - Name: Test User
   - Email: your-email@gmail.com
   - Phone: +49123456789
4. Click "Confirm Booking"
5. Check your email for confirmation!

## 📧 Gmail App Password Setup

1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other** (enter "Pulse Gym")
4. Copy the 16-character password
5. Paste in `.env` as `EMAIL_PASSWORD`

## 🔧 Common Issues

### "MongoDB connection failed"
- Check your MongoDB URI
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify username/password

### "Email not sending"
- Verify Gmail App Password is correct
- Ensure 2FA is enabled on Gmail
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

### "Class not loading"
- Run `npm run seed` to populate database
- Check MongoDB connection
- Verify API endpoint in `booking.js`

## 🌐 Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Full-stack gym booking system"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects settings from `vercel.json`
4. Add environment variables (copy from `.env`)
5. Deploy! 🚀

### 3. Update API URL
In `booking.js` line 10:
```javascript
const API_URL = 'https://your-project.vercel.app/api';
```

Redeploy and done! ✨

## 📊 Database Structure

**Classes Collection** (20 sample classes):
- Monday-Sunday classes
- Different trainers, times, difficulties
- Capacity: 6-15 spots per class

**Bookings Collection** (empty, populated by users):
- User info + class reference
- Auto-updates class capacity
- Sends email confirmations

## 🎯 Portfolio Highlights

Show recruiters:
1. **Full-stack architecture** - Separate frontend/backend
2. **RESTful API** - Clean endpoint design
3. **Database operations** - CRUD with MongoDB
4. **Email integration** - Professional Nodemailer templates
5. **Real-time updates** - Capacity tracking
6. **Error handling** - Validation + user feedback
7. **Production ready** - Vercel deployment

## 📚 Next Steps

- [ ] Customize class schedule (edit `server/utils/seed.js`)
- [ ] Replace placeholder images in `/images`
- [ ] Update Google Analytics ID in `index.html`
- [ ] Add your own branding/colors in `styles.css`
- [ ] Implement user authentication (optional)

## 💡 Pro Tips

**Local Development:**
- Use `npm run dev` for auto-restart on file changes
- MongoDB Compass for database visualization
- Postman for API testing

**Production:**
- Never commit `.env` file
- Use MongoDB Atlas free tier (512MB storage)
- Vercel handles serverless functions automatically
- Monitor analytics in GA4 dashboard

## 🆘 Need Help?

**Check these files:**
- `README_FULLSTACK.md` - Complete documentation
- `server/routes/booking.js` - API endpoints
- `booking.js` - Frontend booking logic
- `.env.example` - Required environment variables

**Test API manually:**
```bash
# Get all classes
curl http://localhost:3000/api/classes

# Health check
curl http://localhost:3000/api/health
```

---

**Happy coding! 🎉**
