import mongoose from 'mongoose';

const EmotionCacheSchema = new mongoose.Schema({
  subreddit: { type: String, required: true },
  emotions: [{
    emotion: String,
    count: Number
  }],
  posts: [{
    title: String,
    selftext: String,
    score: Number,
    created: Number,
    url: String
  }],
  lastFetched: { type: Date, required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true }
});

// Create a compound index for efficient querying
EmotionCacheSchema.index({ subreddit: 1, weekStart: 1 }, { unique: true });

export const EmotionCache = mongoose.models.EmotionCache || mongoose.model('EmotionCache', EmotionCacheSchema);