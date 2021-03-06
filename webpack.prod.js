/* npm packages to help to work with file and directory paths */
const glob = require('glob-all');
const path = require('path');

/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* deletes dist folder before new bundles are created */
const CleanWebpackPlugin = require('clean-webpack-plugin');

/* optimises Images */
const {ImageminWebpackPlugin} = require("imagemin-webpack");
const imageminOptipng = require("imagemin-optipng");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminSvgo = require("imagemin-svgo");

/* removes unused css */
const PurifyCSSPlugin = require("purifycss-webpack");

/* generates Icons */
const WebappWebpackPlugin = require('webapp-webpack-plugin');

/* shared modules between dev and production config */
const common = require('./webpack.common.js');

/* merges shared modules */
const merge = require('webpack-merge')


/* run composer vendor-expose after webpack build */ 
const WebpackShellPlugin = require('webpack-shell-plugin');

/* templates directory */
const templateBaseDirName = __dirname + '/templates/';

/* all ss templates */
let Files = glob.sync([templateBaseDirName + "**/*.ss"]);



module.exports = merge(common, {
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
            chunkFilename: "[id].css"
        }),
        new PurifyCSSPlugin({
            paths: (Files),
            purifyOptions: {
                minify: true,
                info: true,
                rejected: true,
                whitelist: ['*js*']
            }
        }),
        new ImageminWebpackPlugin({
            imageminOptions: {
                plugins: [
                    imageminOptipng({
                        optimizationLevel: 5
                    }),
                    imageminGifsicle({
                        interlaced: true
                    }),
                    imageminJpegtran({
                        progressive: true
                    }),
                    imageminSvgo({
                        removeViewBox: true
                    })
                ]
            }
        }),
        new WebappWebpackPlugin({
            logo: './src/icons/icon.png',
            prefix: 'icons',
            emitStats: false,
            persistentCache: true,
            inject: 'true',
            background: '#fff',
            title: 'Webpack App',
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new WebpackShellPlugin({
            onBuildStart: ['echo "Starting..."'],
            onBuildExit:['cd ../.. && composer vendor-expose'],
            safe: true
        }),
    ],
})