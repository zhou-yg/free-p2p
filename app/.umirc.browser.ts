
// ref: https://umijs.org/config/
export default {
  chainWebpack(config, arg) {
    config.entry('umi').prepend('./src/rtc/adapter/browser.ts');
  },
  define: {
    'process.env.Adapter': 'browser'
  },
  outputPath: '../browser/app-dist/',
}
