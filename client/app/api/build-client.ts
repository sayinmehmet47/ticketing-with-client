import axios from 'axios';
import { headers } from 'next/headers';

export default function buildClient() {
  const headersList = headers();

  if (typeof window === 'undefined') {
    return axios.create({
      // baseURL:
      // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // if it is local development, we can use this baseURL but in production we can not use this baseURL
      // because we are using ingress-nginx in production
      // so we need to use the baseURL of ingress-nginx
      // 'http://www.ticketing-app-prod.xyz/',

      baseURL:
        process.env.NODE_ENV === 'production'
          ? 'http://www.kitapkurdu.xyz/'
          : 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',

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
