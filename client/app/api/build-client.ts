import axios from 'axios';
import { headers } from 'next/headers';

export default function buildClient() {
  const headersList = headers();

  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
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
