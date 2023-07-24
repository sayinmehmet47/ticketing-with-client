'use client';

import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useRequest } from '@/hooks/use-request';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CardButton = ({
  ticket,
}: {
  ticket: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => router.push(`/orders/${order.id}`),
  });
  return (
    <CardFooter className="flex flex-col items-center justify-center gap-2">
      <div className="text-red-500">{errors}</div>
      <Button className="w-full" onClick={() => doRequest()}>
        <Check className="mr-2 h-4 w-4" /> Purchase
      </Button>
    </CardFooter>
  );
};
