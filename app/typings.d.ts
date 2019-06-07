import { string } from "prop-types";

declare module '*.css';
declare module "*.png";

interface Window {
  REGISTER_ENV: {};
  Adapter: string;
}

declare const Adapter:string;