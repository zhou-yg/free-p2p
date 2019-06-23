import {env} from './env';
// import b from './dapter/browser';
// import d from './dapter/desktop';

let api:Adapter;

if (env.browser) {
  api = window.bb;
} else {
  api = window.dd;
}

export default api;
