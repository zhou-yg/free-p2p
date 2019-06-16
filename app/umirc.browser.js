
// ref: https://umijs.org/config/
const config =  {
  treeShaking: true,
  define: {
    'process.env.Adapter': 'browser'
  },
  outputPath: '../browser/app-dist/',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'app',
      dll: true,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}

module.exports = config;