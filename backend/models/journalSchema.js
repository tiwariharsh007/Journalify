import mongoose, { Schema } from "mongoose";

const journalSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  visitedLocation: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required:true,
  },
  visitedDate: {
    type: Date,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

export const Journal = mongoose.model("Journal", journalSchema);
