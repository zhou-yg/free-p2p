
// ref: https://umijs.org/config/
export default {
  chainWebpack(config, arg) {
    config.entry('umi').prepend('./src/common/adapter/browser.ts');
  },
  define: {
    'process.env.Adapter': 'browser'
  },
  outputPath: '../browser/app-dist/',
}
