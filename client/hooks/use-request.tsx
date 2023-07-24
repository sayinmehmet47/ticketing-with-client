import axios from 'axios';
import { useState } from 'react';

interface UseRequestProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  onSuccess?: (data: any) => void;
  body: any;
}

export function useRequest({ url, method, body, onSuccess }: UseRequestProps) {
  const [errors, setErrors] = useState<React.ReactNode>();

  const doRequest = async (props = {}) => {
    try {
      setErrors(undefined);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) onSuccess(response.data as any);

      return response.data;
    } catch (error: any) {
      setErrors(
        <ul className="text-red-500 text-xs italic">
          {error?.response?.data?.errors?.map((err: any) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </ul>
      );
    }
  };

  return { doRequest, errors };
}
