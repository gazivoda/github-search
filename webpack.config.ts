import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

const webpackConfig = (env): Configuration => ({
    entry: "./src/index.tsx",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            components: path.resolve(__dirname, "./src/components/")
        }
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: /dist/
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin(envKeys),
        new ForkTsCheckerWebpackPlugin({ eslint: true })
    ]
});

export default webpackConfig;