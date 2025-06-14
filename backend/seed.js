const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');

const postsData = [
  {
    title: 'First Blog',
    content: 'This is the first example blog post.',
    imageUrl: '/images/blog1.jpg',
  },
  {
    title: 'Second Blog',
    content: 'This is the second example blog post.',
    imageUrl: '/images/blog2.jpg',
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await User.deleteMany({});
    await Post.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({ username: 'admin', password: hashedPassword });
    const savedUser = await user.save();

    const posts = postsData.map(post => ({
      ...post,
      author: savedUser._id,
    }));

    await Post.insertMany(posts);
    console.log('Database seeded with users and posts!');

    await mongoose.disconnect();
    console.log('Disconnected from DB');
  } catch (err) {
    console.error('Error seeding DB:', err);
  }
}

seedDB();
