const HOME = process.env.HOME;
console.log(`process.env.HOME:`, process.env.HOME);
// ref: https://umijs.org/config/
export default  {
  chainWebpack(config, arg) {
    config.entry('umi').prepend('./src/rtc/adapter/desktop.ts');
  },
  externals: {
    "fs": "require('fs')",
    "path": "require('path')",
  },
  define: {
    'process.env.Adapter': 'desktop',
    'process.env.HOME': HOME,
  },
  outputPath: '../desktop/app-dist/',

  minimizer: false,
}
