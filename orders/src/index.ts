import 'express-async-errors';
import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@sayinmehmet-ticketing/common';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/listener/ticket-updated-listener';
import { ExpirationCompleteEventListener } from './events/listener/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listener/payment-created-listener';

const start = async () => {
  console.log('Starting up.');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await new TicketCreatedListener(natsWrapper.client).listen();
    await new TicketUpdatedListener(natsWrapper.client).listen();
    await new ExpirationCompleteEventListener(natsWrapper.client).listen();
    await new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    if (error instanceof DatabaseConnectionError) {
      throw new DatabaseConnectionError();
    }
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
