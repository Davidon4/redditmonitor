import mongoose from 'mongoose';

async function createTTLIndex() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');

  try {
    await mongoose.connect(uri);
    
    // Get the SubredditMetrics collection
    const collection = mongoose.connection.collection('SubredditMetrics');
    
    // Create TTL index
    await collection.createIndex(
      { timestamp: 1 }, 
      { expireAfterSeconds: 10 * 24 * 60 * 60 } // 10 days
    );

    console.log('TTL index created successfully');
  } catch (error) {
    console.error('Error creating TTL index:', error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { createTTLIndex };