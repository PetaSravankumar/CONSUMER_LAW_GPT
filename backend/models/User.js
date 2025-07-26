// models/User.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ✅ User Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
      default: '', // 🔁 Used for refreshing access tokens
    },
  },
  {
    timestamps: true, // ⏱️ Adds createdAt and updatedAt fields
  }
);

// ✅ User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
