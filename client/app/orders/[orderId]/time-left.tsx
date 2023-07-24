'use client';
import { useCurrentUser } from '@/app/current-user-context';
import { useRequest } from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import StripeCheckout from 'react-stripe-checkout';

const TimeLeft = ({
  data,
  msLeft,
  price,
  orderId,
}: {
  data: {
    expiresAt: string;
  };
  msLeft: number;
  price: number;
  orderId: string;
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const router = useRouter();
  const currentUser = useCurrentUser();

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId,
    },
    onSuccess: () => {
      router.push('/orders');
    },
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      const msLeft = new Date(data.expiresAt).getTime() - new Date().getTime();
      const timeLeft = Math.round(msLeft / 1000);
      setTimeLeft(`${timeLeft} seconds`);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <div className="text-xl font-bold">
      Expires in: {msLeft > 0 ? timeLeft : 'Expired'}
      <StripeCheckout
        token={({ id }) =>
          doRequest({
            token: id,
          })
        }
        stripeKey="pk_test_51LP6aiGCJMINMCUu3IORbXLsC0BdY227snNxLUSOcnAGk7PKfvNj9GdEkrddwqFoUc7e7VzmIaLuL1NTX6bz83hn00uJ2Lz06v"
        amount={price * 100}
        email={currentUser.email}
      />
      {errors && <div className="text-red-500">{errors}</div>}
    </div>
  );
};

export default TimeLeft;
