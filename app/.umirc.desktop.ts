// ref: https://umijs.org/config/
export default  {
  chainWebpack(config, arg) {
    // console.log(config);
    // console.log(arg);
    config.entry('umi').prepend('./src/pages/index2.tsx');
  },
  define: {
    'process.env.Adapter': 'desktop'
  },
  outputPath: '../desktop/app-dist/',
}
