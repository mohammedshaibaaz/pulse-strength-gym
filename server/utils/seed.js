import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Class from '../models/Class.js';
import connectDB from '../config/db.js';

dotenv.config();

// Sample class data
const sampleClasses = [
  // Monday
  {
    name: 'Strength Foundations',
    description: 'Master compound lifts with professional coaching. Perfect for building a strong base.',
    trainer: 'Mohammed Altaf',
    day: 'Monday',
    time: '06:00 AM',
    duration: 60,
    capacity: 8,
    difficulty: 'Beginner',
    category: 'Strength'
  },
  {
    name: 'Power Hour',
    description: 'Advanced powerlifting focused on squat, bench, and deadlift progression.',
    trainer: 'Sarah Miller',
    day: 'Monday',
    time: '05:00 PM',
    duration: 90,
    capacity: 6,
    difficulty: 'Advanced',
    category: 'Strength'
  },
  {
    name: 'HIIT Blast',
    description: 'High-intensity interval training for fat loss and conditioning.',
    trainer: 'Alex Chen',
    day: 'Monday',
    time: '06:30 PM',
    duration: 45,
    capacity: 12,
    difficulty: 'Intermediate',
    category: 'HIIT'
  },

  // Tuesday
  {
    name: 'Olympic Lifting',
    description: 'Learn snatch and clean & jerk techniques for explosive power.',
    trainer: 'Viktor Novak',
    day: 'Tuesday',
    time: '06:30 AM',
    duration: 75,
    capacity: 6,
    difficulty: 'Intermediate',
    category: 'Strength'
  },
  {
    name: 'Conditioning Circuit',
    description: 'Full-body conditioning with kettlebells, ropes, and bodyweight exercises.',
    trainer: 'Alex Chen',
    day: 'Tuesday',
    time: '05:30 PM',
    duration: 60,
    capacity: 10,
    difficulty: 'Beginner',
    category: 'Conditioning'
  },
  {
    name: 'Personal Training',
    description: '1-on-1 session tailored to your specific goals and needs.',
    trainer: 'Mohammed Altaf',
    day: 'Tuesday',
    time: '07:00 PM',
    duration: 60,
    capacity: 1,
    difficulty: 'Beginner',
    category: 'Personal Training'
  },

  // Wednesday
  {
    name: 'Strength Foundations',
    description: 'Master compound lifts with professional coaching. Perfect for building a strong base.',
    trainer: 'Sarah Miller',
    day: 'Wednesday',
    time: '06:00 AM',
    duration: 60,
    capacity: 8,
    difficulty: 'Beginner',
    category: 'Strength'
  },
  {
    name: 'Deadlift Mastery',
    description: 'Focused session on deadlift technique, accessories, and progressive overload.',
    trainer: 'Viktor Novak',
    day: 'Wednesday',
    time: '05:00 PM',
    duration: 75,
    capacity: 8,
    difficulty: 'Intermediate',
    category: 'Strength'
  },
  {
    name: 'Metabolic Conditioning',
    description: 'Build work capacity and endurance with challenging circuits.',
    trainer: 'Alex Chen',
    day: 'Wednesday',
    time: '06:30 PM',
    duration: 60,
    capacity: 12,
    difficulty: 'Intermediate',
    category: 'Conditioning'
  },

  // Thursday
  {
    name: 'Bench Press Workshop',
    description: 'Improve bench press technique and accessory work for upper body strength.',
    trainer: 'Sarah Miller',
    day: 'Thursday',
    time: '06:30 AM',
    duration: 60,
    capacity: 8,
    difficulty: 'Intermediate',
    category: 'Strength'
  },
  {
    name: 'Strongman Training',
    description: 'Atlas stones, farmer carries, and functional strength movements.',
    trainer: 'Viktor Novak',
    day: 'Thursday',
    time: '05:30 PM',
    duration: 75,
    capacity: 6,
    difficulty: 'Advanced',
    category: 'Strength'
  },
  {
    name: 'HIIT Cardio',
    description: 'Improve cardiovascular fitness with intense interval training.',
    trainer: 'Alex Chen',
    day: 'Thursday',
    time: '06:30 PM',
    duration: 45,
    capacity: 12,
    difficulty: 'Beginner',
    category: 'HIIT'
  },

  // Friday
  {
    name: 'Squat Clinic',
    description: 'Perfect your squat form and build lower body strength.',
    trainer: 'Mohammed Altaf',
    day: 'Friday',
    time: '06:00 AM',
    duration: 75,
    capacity: 8,
    difficulty: 'Intermediate',
    category: 'Strength'
  },
  {
    name: 'Full Body Strength',
    description: 'Complete workout hitting all major muscle groups.',
    trainer: 'Sarah Miller',
    day: 'Friday',
    time: '05:00 PM',
    duration: 90,
    capacity: 10,
    difficulty: 'Intermediate',
    category: 'Strength'
  },
  {
    name: 'Friday Night Burn',
    description: 'End the week strong with high-intensity conditioning.',
    trainer: 'Alex Chen',
    day: 'Friday',
    time: '06:30 PM',
    duration: 60,
    capacity: 12,
    difficulty: 'Intermediate',
    category: 'HIIT'
  },

  // Saturday
  {
    name: 'Weekend Warriors',
    description: 'Intensive strength session for those who train hard on weekends.',
    trainer: 'Viktor Novak',
    day: 'Saturday',
    time: '09:00 AM',
    duration: 90,
    capacity: 10,
    difficulty: 'Intermediate',
    category: 'Strength'
  },
  {
    name: 'Olympic Lifting Workshop',
    description: 'Advanced techniques for competitive Olympic lifters.',
    trainer: 'Sarah Miller',
    day: 'Saturday',
    time: '11:00 AM',
    duration: 90,
    capacity: 6,
    difficulty: 'Advanced',
    category: 'Strength'
  },
  {
    name: 'Personal Training',
    description: '1-on-1 session tailored to your specific goals and needs.',
    trainer: 'Mohammed Altaf',
    day: 'Saturday',
    time: '02:00 PM',
    duration: 60,
    capacity: 1,
    difficulty: 'Beginner',
    category: 'Personal Training'
  },

  // Sunday
  {
    name: 'Recovery & Mobility',
    description: 'Active recovery session focusing on mobility and flexibility.',
    trainer: 'Alex Chen',
    day: 'Sunday',
    time: '10:00 AM',
    duration: 60,
    capacity: 15,
    difficulty: 'Beginner',
    category: 'Conditioning'
  },
  {
    name: 'Powerlifting Focus',
    description: 'Competition-style training for serious powerlifters.',
    trainer: 'Viktor Novak',
    day: 'Sunday',
    time: '02:00 PM',
    duration: 120,
    capacity: 6,
    difficulty: 'Advanced',
    category: 'Strength'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing classes
    await Class.deleteMany({});
    console.log('🗑️  Cleared existing classes');

    // Insert sample classes
    const classes = await Class.insertMany(sampleClasses);
    console.log(`✅ Added ${classes.length} classes`);

    console.log('\n📊 Classes by day:');
    const classesByDay = await Class.aggregate([
      {
        $group: {
          _id: '$day',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    classesByDay.forEach(day => {
      console.log(`   ${day._id}: ${day.count} classes`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
