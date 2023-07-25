import axios from 'axios';
import { headers } from 'next/headers';

export default function buildClient() {
  const headersList = headers();

  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://www.kitapkurdu.xyz/',
      headers: {
        Host: headersList.get('host'),
        Cookie: headersList.get('cookie'),
      },
    });
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
}
