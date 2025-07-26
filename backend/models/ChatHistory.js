const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for each message
const messageSchema = new Schema(
  {
    text: { type: String, required: true },
    isUser: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // No separate _id for subdocuments
);

// Main schema for chat history
const chatHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
