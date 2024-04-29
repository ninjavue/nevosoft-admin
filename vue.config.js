const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

module.exports = merge(defineConfig({
  transpileDependencies: true
}), {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
      })
    ]
  }
});
