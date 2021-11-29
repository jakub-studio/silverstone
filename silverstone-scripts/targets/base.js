module.exports = vars => ({
	name: "Base",
	devtool: false,
	module: {
		rules: [
			// I have sepereated these 3 rules out to ensure that the minimum amount of plugins are running at
			// any one time, thus increasing performance.
			{
				test: /\.tsx$/i,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react", "@babel/preset-typescript"]
					}
				}
			}, {
				test: /\.ts$/i,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-typescript"]
					}
				}
			},{
				test: /\.jsx$/i,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"]
					}
				}
			}, {
				test: /\.css$/i,
				use: [
					"style-loader",
					"css-loader",
					{
						loader: "postcss-loader", options: {
							postcssOptions: {
								ident: 'postcss',
								plugins: [require("tailwindcss"), require("autoprefixer")]
							},
						}
					}
				],
			}
		]
	},
});