const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

function excludePrismaFromSourceMapLoader() {
  return {
    apply(compiler) {
      compiler.hooks.afterEnvironment.tap('ExcludePrismaFromSourceMapLoader', () => {
        const rules = compiler.options.module?.rules;
        if (!Array.isArray(rules)) return;
        const prismaExclude = /libs[\\/]prisma[\\/]generated/;
        for (const rule of rules) {
          if (rule.enforce === 'pre' && rule.loader && String(rule.loader).includes('source-map-loader')) {
            rule.exclude = rule.exclude ? (Array.isArray(rule.exclude) ? [...rule.exclude, prismaExclude] : [rule.exclude, prismaExclude]) : prismaExclude;
            break;
          }
        }
      });
    },
  };
}

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/notification-service'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    excludePrismaFromSourceMapLoader(),
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],
};
