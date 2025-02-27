const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../Models/tourModel');
const Review = require('../../Models/reviewModel');
const User = require('../../Models/userModel');

// Load environment variables
dotenv.config({ path: './config.env' });

const encodedPassword = encodeURIComponent(process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace('<PASSWORD>', encodedPassword);

// Connect to MongoDB Atlas
mongoose
  .connect(DB)
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });

const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');

const importData = async () => {
  try {
    const toursJSON = JSON.parse(tours);
    await Tour.create(toursJSON);
    const userJSON = JSON.parse(users);
    await User.create(userJSON, { validateBeforeSave: false });
    const reviewJSON = JSON.parse(reviews);
    await Review.create(reviewJSON);
    console.log('Data imported successfully!');
  } catch (err) {
    console.error('Error importing data:', err.message);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.error('Error deleting data:', err.message);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
