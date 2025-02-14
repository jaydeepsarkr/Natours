const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
