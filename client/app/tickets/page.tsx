'use client';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRequest } from '@/hooks/use-request';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'title must be at least 2 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'price must be a positive number.',
  }),
});

const NewTicket = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      price: 0,
    },
  });

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: form.getValues(),
    onSuccess: (ticket) => console.log(ticket),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await doRequest();

    // Reset the form
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 max-w-md mx-auto  mt-12  border border-gray-200 p-6 rounded-xl shadow-md"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create Ticket</FormLabel>
              <FormControl>
                <Input
                  placeholder="title"
                  {...field}
                  className={
                    form.formState.errors.title ? 'border-red-500' : ''
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl
                className={form.formState.errors.price ? 'border-red-500' : ''}
              >
                <Input placeholder="price" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="default"
          isLoading={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewTicket;
