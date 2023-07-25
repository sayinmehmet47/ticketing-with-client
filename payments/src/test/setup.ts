import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper');
// jest.mock('../stripe');

let mongo: MongoMemoryServer;

// that is interesting when putting here it works but in line 16 it does not work
process.env.STRIPE_KEY =
  'sk_test_51LP6aiGCJMINMCUutTkanWinySHpVqdag6ZhnL2G8cWZC0zoJkd8tH7tMH7soLL7txd3U5MAR4hJVikOfJy69shE00pZM1aiVW';

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

declare global {
  var signin: (id?: string) => Promise<string[]>;
}

global.signin = async (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@gmail.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Turn that session into JSON
  const sessionJSON = JSON.stringify({ jwt: token });

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
