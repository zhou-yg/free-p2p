import b from './umirc.browser';
import d from './umirc.desktop';

let config;
if (process.env.Env === 'b') {
  config = b;
} else {
  config = d;
}

export default config;
