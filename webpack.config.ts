import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { resolve } from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, Plugin } from 'webpack';

fixTsconfigPathsPluginConflict();

const PROD_ENV = process.env.NODE_ENV === 'production';

const config: Configuration = {
  mode: PROD_ENV ? 'production' : 'development',
  entry: ['./src/index'],
  output: { path: resolve(__dirname, 'build'), filename: '[name].js' },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, use: [{ loader: 'ts-loader' }] },
      { test: /\.(html|svg)$/, use: [{ loader: 'html-loader', options: { interpolate: true } }] },
      {
        test: /\.scss$/i,
        use: [
          PROD_ENV ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: { sassOptions: { includePaths: ['src/styles'] } } },
        ],
      },
    ],
  },
  plugins: PROD_ENV ? getProdPlugins() : getDevPlugins(),
};

export default config;

function getProdPlugins(): Plugin[] {
  return [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src/index.html'),
      minify: { removeComments: true, collapseWhitespace: true },
    }),
    new MiniCssExtractPlugin(),
    new OptimizeCssAssetsPlugin(),
  ];
}

function getDevPlugins(): Plugin[] {
  return [new HtmlWebpackPlugin({ template: resolve(__dirname, 'src/index.html') })];
}

function fixTsconfigPathsPluginConflict(): void {
  delete process.env.TS_NODE_PROJECT;
}
