const Webpack = require('webpack');
const Path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outPath = Path.join(__dirname, './dist');
const sourcePath = Path.join(__dirname, './src');
const isProduction = process.argv.indexOf('-p') >= 0;

module.exports = {
    context: sourcePath,
    entry: {
        main: './index.tsx'
    },
    externals: { leveldown: 'leveldown' },
    output: {
        path: outPath,
        publicPath: '',
        filename: 'bundle.js'
    },
    target: 'electron-main',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    devtool: 'inline-source-map',
    watch: true,

    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: isProduction
                    ? 'awesome-typescript-loader?module=es6'
                    : [
                        'awesome-typescript-loader'
                    ]
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url-loader?limit=100000!img-loader?progressive=true'
            },
            {
                test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new ExtractTextPlugin({
            filename: 'style.css'
        }),
        new CopyWebpackPlugin([
            {from: Path.join(__dirname, 'src/static/images'), to: Path.join(outPath, 'images')}
        ])
    ]
};
