import axios from 'axios';
import { useState } from 'react';

interface UseRequestProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  body: any;
}

export function useRequest({ url, method, body }: UseRequestProps) {
  const [errors, setErrors] = useState<React.ReactNode>();

  const doRequest = async () => {
    try {
      setErrors(undefined);
      const response = await axios[method](url, body);
      return response.data;
    } catch (error: any) {
      setErrors(
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <ul className="text-red-500 text-xs italic">
            {error?.response?.data?.errors?.map((err: any) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}
