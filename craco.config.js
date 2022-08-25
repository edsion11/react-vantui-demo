const path = require("path");
const webpack = require("webpack");
const VantUIPlugin = require("@antmjs/plugin-vantui");
const CracoLessPlugin = require("craco-less");

module.exports = {
  style: {
    //修改样式配置
  },
  eslint: {
    // 修改eslint配置，同.eslintrc
  },
  babel: {
    //babel配置，同.babelrc
    rules: [
      {
        test: /node_modules[\\/]@tarojs(.+?)\.[tj]sx?$/i,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [
            [
              "@antmjs/babel-preset",
              {
                presets: {
                  env: {
                    debug: false,
                    useBuiltIns: false,
                    corejs: false,
                    modules: false,
                  },
                  react: {
                    runtime: "automatic",
                  },
                  typescript: {
                    isTSX: true,
                    jsxPragma: "React",
                    allExtensions: true,
                    allowNamespaces: true,
                  },
                },
                decorators: {
                  legacy: false,
                  decoratorsBeforeExport: false,
                },
                classProperties: {
                  loose: false,
                },
                runtime: {
                  absoluteRuntime: path.dirname(
                    require.resolve("@babel/runtime-corejs3/package.json")
                  ),
                  version: require("@babel/runtime-corejs3/package.json")
                    .version,
                  corejs: false,
                  helpers: true, // 使用到@babel/runtime
                  regenerator: true, // 使用到@babel/runtime
                  useESModules: false,
                },
                exclude: [/@babel[/|\\\\]runtime/, /core-js/],
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    //注入插件
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: { javascriptEnabled: true },
        },
        modifyLessRule: function () {
          return {
            test: /\.less$/,
            use: [
              { loader: "style-loader" },
              {
                loader: "css-loader",
              },
              { loader: "less-loader" },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      ['postcss-pxtransform',{platform: "h5",designWidth: 750}]
                      // [
                      //   "postcss-pxtorem",
                      //   {
                      //     rootValue: 40,
                      //     unitPrecision: 5,
                      //     propList: ["*"],
                      //     selectorBlackList: [],
                      //     replace: true,
                      //     mediaQuery: false,
                      //     minPixelValue: 0,
                      //     // include: /node_modules/i,
                      //     // exclude: /node_modules/i,
                      //   }
                      // ]
                    ],
                  },
                },
              },
            ],
          };
        },
      },
    },
  ],
  webpack: {
    mainFields: ["main:h5", "browser", "module", "jsnext:main", "main"],
    alias: {
      "@tarojs/components/dist/taro-components/taro-components.css":
        path.resolve(
          process.cwd(),
          "./node_modules/@tarojs/components/dist/taro-components/taro-components.css"
        ),
      "@tarojs/components/loader": path.resolve(
        process.cwd(),
        "./node_modules/@tarojs/components/loader"
      ),
      "@tarojs/components": path.resolve(
        process.cwd(),
        "./node_modules/@tarojs/components/dist-h5/react"
      ),
    },
    plugins: [
      // 为了使移动H5和Taro小程序保持同一套组件，原因在介绍有说明，所以这里需要把Taro内置的一些插件属性给加进来
      new webpack.DefinePlugin({
        ENABLE_INNER_HTML: true,
        ENABLE_ADJACENT_HTML: true,
        ENABLE_TEMPLATE_CONTENT: true,
        ENABLE_CLONE_NODE: true,
        ENABLE_SIZE_APIS: false,
      }),
      new webpack.EnvironmentPlugin({
        LIBRARY_ENV: "react",
        TARO_ENV: "h5",
      }),
      new VantUIPlugin({
        designWidth: 750,
        deviceRatio: {
          640: 2.34 / 2,
          750: 1,
          828: 1.81 / 2,
        },
      }),
    ],
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
  },
  module: {
    rules: [
      {
        // 这里其实可以在自己的webpack内配置，核心就是匹配到test的部分不触发polyfill，仅仅更新下语法就行，否则会报错
        test: /node_modules[\\/]@tarojs(.+?)\.[tj]sx?$/i,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [
            [
              "@antmjs/babel-preset",
              {
                presets: {
                  env: {
                    debug: false,
                    useBuiltIns: false,
                    corejs: false,
                    modules: false, // 对es6的模块文件不做转译，以便使用tree shaking、sideEffects等
                  },
                  react: {
                    runtime: "automatic",
                  },
                  typescript: {
                    isTSX: true,
                    jsxPragma: "React",
                    allExtensions: true,
                    allowNamespaces: true,
                  },
                },
                decorators: {
                  legacy: false,
                  decoratorsBeforeExport: false,
                },
                classProperties: {
                  loose: false,
                },
                runtime: {
                  absoluteRuntime: path.dirname(
                    require.resolve("@babel/runtime-corejs3/package.json")
                  ),
                  version: require("@babel/runtime-corejs3/package.json")
                    .version,
                  corejs: false,
                  helpers: true, // 使用到@babel/runtime
                  regenerator: true, // 使用到@babel/runtime
                  useESModules: false,
                },
                exclude: [/@babel[/|\\\\]runtime/, /core-js/],
              },
            ],
          ],
        },
      }
    ],
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    // 修改devServer配置
    return devServerConfig;
  },
};
