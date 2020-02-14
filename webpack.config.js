const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const HtmlPlugin = require('html-webpack-plugin');

const locations = {
  base: path.resolve(__dirname),
  public: path.resolve(__dirname, 'public'),
  js: path.resolve(__dirname, 'assets/js/index.js'),
  scss: path.resolve(__dirname, 'assets/scss/index.scss')
}

module.exports = 
  {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  mode: process.env.NODE_ENV || 'development',
  entry: {
    'assets/js/index': locations.js,
    'assets/css/main': locations.scss
  },
  output: {
    publicPath: "/",
    path: locations.public
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
      },
      { 
        test: /\.hbs$/, 
        loader: "handlebars-loader",
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: '*.{html,ico}',
        to: locations.public
      },
      {
        from: 'assets/html/pages/**/index.html',
        to: locations.public
      },
      {
        from: 'assets/images/**/*.*',
        to: locations.public
      }
    ]),
    new ImageminPlugin({ 
      test: /\.(jpe?g|png|gif|svg)$/i ,
      pngquant: {
        quality: '45-50'
      },
      optipng: {
        optimizationLevel: 9
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      options:{
        ignoreOrder: true
      }
    }),
    {
      apply(compiler) {
        compiler.hooks.shouldEmit.tap('remove js from css output', (compilation) => {
          delete compilation.assets['assets/css/main.js'];
          return true;
        })
      }
    },
    new HtmlPlugin({
      templateParameters: (compilation, assets, assetTags, options) => {
        assets.js = assets.js.filter(asset => !asset.match(/css/))
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          'title': 'Salis Braimah'
        };
      },
      template: '!!handlebars-loader!assets/html/index/index.hbs',
      minify: true
    })
  ],
  devServer: {
    contentBase: locations.public,
    watchContentBase: true,
    port: 3000,
    historyApiFallback: true
  }
}