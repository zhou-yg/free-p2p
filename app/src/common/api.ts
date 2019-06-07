import {env} from './env';
import b from './dapter/browser';
import d from './dapter/desktop';

let api;

if (env.browser) {
  api = b;
} else {
  api = d;
}

export default api;