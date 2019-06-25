// ref: https://umijs.org/config/
export default  {
  chainWebpack(config, arg) {
    config.entry('umi').prepend('./src/rtc/adapter/desktop.ts');
  },
  define: {
    'process.env.Adapter': 'desktop'
  },
  outputPath: '../desktop/app-dist/',
}
