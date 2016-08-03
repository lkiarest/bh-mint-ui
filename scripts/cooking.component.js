var path = require('path');
var cooking = require('cooking');
var Components = require('../components.json');
var webpack = require('webpack');
var entries = {};

Object.keys(Components).forEach(compo => {
  entries[compo] = path.join(__dirname, '../', Components[compo]);
});

cooking.set({
  use: 'vue',
  entry: Components,
  dist: './lib/',
  clean: false,
  template: false,
  format: 'umd',
  moduleName: ['BHMINT', '[name]'],
  extractCSS: '[name]/style.css',
  extends: ['vue', 'lint', 'saladcss']
});

cooking.remove('output.publicPath');

cooking.add('resolve.alias', {
  'main': path.join(__dirname, '../src'),
  'packages': path.join(__dirname, '../packages')
});
cooking.add('output.filename', '[name]/index.js');

var externals = {};
Object.keys(Components).forEach(function (key) {
  externals[`packages/${key}/index.js`] = `bh-mint-ui/lib/${key}`;
  externals[`packages/${key}/style.css`] = `bh-mint-ui/lib/${key}/style.css`;
});

cooking.add('externals', Object.assign({
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
}, externals));

cooking.add('plugin.defiendImportCSS', new webpack.DefinePlugin({
  'process.env.IMPORTCSS': JSON.stringify(true)
}));
cooking.add('preLoader.js.exclude', /node_modules|lib/);
cooking.add('preLoader.vue.exclude', /node_modules|lib/);

module.exports = cooking.resolve();
