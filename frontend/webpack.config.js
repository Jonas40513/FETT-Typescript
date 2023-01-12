const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const { ServiceWorkerPlugin } = require("service-worker-webpack")

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "bundle_[hash].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "FETT",
            template: "index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "node_modules/leaflet/dist/", to: "res/" },
            ],
        }),
        new ServiceWorkerPlugin(
            {
                registration: {
                    autoRegister: false,
                    path: "./sw.js"
                }
            }
        )
    ],
    devtool: "cheap-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "/"),
        },
        compress: true,
        port: 4200,
        historyApiFallback: true
    },
}
