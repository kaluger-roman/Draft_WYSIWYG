const path = require ('path');
const HtmlWebpackPlugin= require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin= require('mini-css-extract-plugin');

module.exports={
    mode: "development",
    entry: {
        main:['@babel/polyfill','./src/index.js'],
    },
    output: {
        filename: "[name].[hash].bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:  "[name].[hash].bundle.css",
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    module: {
        rules: [

            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: true,
                        reloadAll:true,
                    }
                }
                    ,
                    {
                        loader: 'css-loader',
                    },
                ],
                exclude: /\.module\.css$/
            },


            {
                test: /\.css$/,
                use:[{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: true,
                        reloadAll:true,
                    }
                }
                ,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: true,
                        }
                    },
                ],
                include: /\.module\.css$/
            },

            {
               test:/\.(png|gif|svg|jpg)$/,
               use:['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets:[
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            }

        ]
    },
    resolve: {
        extensions: ['.js','.json','.png']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }

            }
        }
    },
    devServer: {
        port:4200,
        historyApiFallback: {
            rewrites: [
                { from: /^\/(\.)*/, to: '/' },
                { from: /^\/(\.)*\/(\.)*/, to: '/' },
            ]
        }
    },
    devtool: "source-map",
};