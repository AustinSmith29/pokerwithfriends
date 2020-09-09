/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src', 'public'),
  entry: path.resolve(__dirname, 'src', 'game', 'game.ts'),

  output: {
    filename: 'game.bundle.js',
    path: path.resolve(__dirname, 'src', 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src/game'),
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src/game'),
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'src', 'dist'),
      writeToDisk: true,
      open: true,
  },

  devtool: 'inline-source-map',
  mode: 'development',

  plugins: [
      new CopyPlugin({
          patterns: [
              {
                  from: '**/*',
              }
          ],
      }),
      new webpack.DefinePlugin({
          'typeof CANVAS_RENDERER': JSON.stringify(true),
          'typeof WEBGL_RENDERER': JSON.stringify(true)
      })
  ]
};
