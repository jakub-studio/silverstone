const cssLoaders = [
	"style-loader",
	{ loader: "css-loader" },
	{
		loader: "postcss-loader",
		options: {
			postcssOptions: {
				ident: 'postcss',
				plugins: [require('tailwindcss'), require('autoprefixer')]
			},
		}
	}
]

module.exports = {
	name: "Base",
	devtool: false,
	module: {
		rules: [{
			test: /\.tsx?$/i,
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						"@babel/preset-react",
						"@babel/preset-typescript"
					],
					plugins: [
						["@babel/plugin-proposal-class-properties", { loose: true }]
					]
				}
			}
		}, {
			test: /\.css$/i,
			use: cssLoaders,
		}, {
			test: /\.scss$/i,
			use: [
				/* sass loader */
				...cssLoaders,
				{
					loader: "sass-loader",
					options: {
						implementation: require("sass"),
						sassOptions: {
							fiber: require("fibers"),
						}
					}
				}
			]
		}]
	},
}