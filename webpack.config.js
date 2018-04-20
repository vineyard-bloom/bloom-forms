const path = require('path')
const BUILD_DIR = path.join(__dirname, '/')
const APP_DIR = path.join(__dirname, '/src/')
const webpack = require('webpack')

module.exports = {
  entry: APP_DIR + 'index.js',
  output: {
    filename: 'index.js',
    path: BUILD_DIR,
    library: 'bloom-forms',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'env'],
          plugins: [
            'transform-object-rest-spread',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2|svg)$/,
        loader: 'url-loader',
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'public/fonts')
        ],
        options: {
          limit: 10000
        }
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {
        comments: false
      },
      sourceMap: {
        url: 'inline'
      }
    })
  ],

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.jsx', '.js', '.html', '.scss']
  }
}
