const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const fs = require('fs');
const path = require('path');

mongoose.connect("mongodb+srv://sachin123:strongpass@cluster0.uwvstmj.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'MongoDB connection error:'));
conn.once('open', () => {
  console.log('MongoDB connection open');
  const gfs = Grid(conn.db, mongoose.mongo);

  // Function to store PDF file
  const storePDF = (filePath, fileName) => {
    const writestream = gfs.createWriteStream({
      filename: fileName,
      content_type: 'application/pdf'
    });

    fs.createReadStream(filePath).pipe(writestream);

    writestream.on('close', (file) => {
      console.log('PDF file saved successfully!', file);
    });
  };

  // Example usage
  // storePDF(path.join(__dirname, 'path/to/your/file.pdf'), 'file.pdf');
});

// Create a Schema for Users
const userSchema = new mongoose.Schema({
  employeName: {
    type: String,
  },
  employeId: {
    type: String,
    required: true,
    minLength: 6
  },
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  storePDF: (filePath, fileName) => {
    const gfs = Grid(conn.db, mongoose.mongo);
    const writestream = gfs.createWriteStream({
      filename: fileName,
      content_type: 'application/pdf'
    });

    fs.createReadStream(filePath).pipe(writestream);

    writestream.on('close', (file) => {
      console.log('PDF file saved successfully!', file);
    });
  }
};

