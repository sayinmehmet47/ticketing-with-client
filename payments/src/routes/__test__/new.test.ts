import request from 'supertest';

import { app } from '../../app';
import { Order } from '../../models/orders';
import mongoose from 'mongoose';
import { OrderStatus } from '@sayinmehmet-ticketing/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('return 404 when purchasing that does not exist', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '1223456',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
  expect(response.status).toEqual(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const cookie = await global.signin();

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '1223456',
      orderId: order.id,
    });

  expect(response.status).toEqual(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = await global.signin(userId);

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  }).save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '1223456',
      orderId: order.id,
    });

  expect(response.status).toEqual(400);
});

it('returns a 200 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', await global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
