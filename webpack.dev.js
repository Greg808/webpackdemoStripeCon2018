/* npm packages to help to work with file and directory paths */
const path = require("path");

/*
* reloads browser on file save(css/js)
* To make livereload work with vagrant put this into your vagrant file
* config.vm.network "forwarded_port", guest: 35729, host: 35729,  host_ip: "192.168.33.13"
*/
const LiveReloadPlugin = require('webpack-livereload-plugin');

/* writes css to own file */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* deletes dist folder before new bundles are created */
const CleanWebpackPlugin = require('clean-webpack-plugin');

/* merge shared modules */
const merge = require('webpack-merge');

/* shared modules between dev and production config */
const common = require('./webpack.common.js');

/* run composer vendor-expose after webpack build */ 
const WebpackShellPlugin = require('webpack-shell-plugin');


module.exports = merge(common, {
    mode: 'development',
    watch: true,
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: [
        new LiveReloadPlugin({
            protocol: 'http',
            hostname: '127.0.0.1',
            appendScriptTag: true
        }),
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: "[id].css"
        }),
        new WebpackShellPlugin({
            onBuildExit: ['cd ../.. &&  composer vendor-expose'],
            safe:true
        }),
    ]
})