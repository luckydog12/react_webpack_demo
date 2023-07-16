const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const getStyleLoaders = (pre) =>
	[
		"style-loader",
		"css-loader",
		{
			loader: "postcss-loader",
			options: {
				postcssOptions: {
					plugins: ["postcss-preset-env"]
				}
			}
		},
		pre
	].filter(Boolean);

module.exports = {
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "static/js/[name].js",
		chunkFilename: "static/js/[name].chunk.js",
		assetModuleFilename: "static/media/[hash:10][ext][query]"
	},
	module: {
		rules: [
			//  css
			{
				test: /\.css$/,
				use: getStyleLoaders()
			},
			{
				test: /\.less$/,
				use: getStyleLoaders("less-loader")
			},
			// image
			{
				test: /\.(jpe?g|png|gif|webp|svg)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024
					}
				}
			},
			// font
			{
				test: /\.(woff2?|ttf)$/,
				type: "asset/resource"
			},
			// js
			{
				test: /\.jsx?$/,
				include: path.resolve(__dirname, "../src"),
				loader: "babel-loader",
				options: {
					cacheDirectory: true,
					cacheCompression: false,
					plugins: [require.resolve("react-refresh/babel")].filter(Boolean)
				}
			}
		]
	},
	plugins: [
		new EslintWebpackPlugin({
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			cache: true,
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/.eslintcache"
			)
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../public/index.html")
		}),
		new ReactRefreshWebpackPlugin()
	],
	optimization: {
		splitChunks: {
			chunks: "all"
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}.js`
		}
	},
	devServer: {
		host: "localhost",
		port: 3000,
		open: true,
		hot: true,
		historyApiFallback: true
	},
	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},
	mode: "development",
	devtool: "cheap-module-source-map"
};
