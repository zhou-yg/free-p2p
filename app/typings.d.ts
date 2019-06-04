declare module '*.css';
declare module "*.png";

declare class Adapter {
  constructor ();
}

interface Window {
  REGISTER_ENV: {};
  Adapter: typeof Adapter;
}