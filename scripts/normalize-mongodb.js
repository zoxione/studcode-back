const { MongoClient } = require('mongodb');
require('dotenv').config({
  path: '.env.development',
});

(async () => {
  let mongoUrl = '';
  if (process.env.MONGODB_URL) {
    mongoUrl = process.env.MONGODB_URL;
  } else {
    throw new Error('MONGODB_URL is not defined.');
  }

  try {
    const client = await MongoClient.connect(mongoUrl);
    console.log('Connected to MongoDB.');

    console.log('\nNormalizing projects...');
    const projects = await client.db().collection('projects').find({}).toArray();
    for (const [index, project] of projects.entries()) {
      const votes = await client.db().collection('votes').find({ project: project._id }).toArray();
      const reviews = await client.db().collection('reviews').find({ project: project._id }).toArray();
      const avgRating = reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      console.log(`[${index + 1}/${projects.length}] Project: ${project.title}, Flames: ${votes.length}, Rating: ${avgRating}.`);
      await client
        .db()
        .collection('projects')
        .updateOne({ _id: project._id }, { $set: { flames: votes.length, rating: avgRating } });
    }

    console.log('\nNormalizing reviews...');
    const reviews = await client.db().collection('reviews').find({}).toArray();
    for (const [index, review] of reviews.entries()) {
      const reactions = await client.db().collection('reactions').find({ review: review._id }).toArray();
      const likes = reactions.filter((reaction) => reaction.type === 'like').length;
      const dislikes = reactions.filter((reaction) => reaction.type === 'dislikes').length;

      console.log(`[${index + 1}/${reviews.length}] Review: ${review.text.slice(0, 10)}, Likes: ${likes}, Dislikes: ${dislikes}.`);
      await client
        .db()
        .collection('reviews')
        .updateOne({ _id: review._id }, { $set: { likes: likes, dislikes: dislikes } });
    }

    console.log('\nNormalized MongoDB 🥳.');
    client.close();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}.`);
  }
})();
