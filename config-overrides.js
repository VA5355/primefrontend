const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@redux': path.resolve(__dirname, 'src/redux'),
    '@lib': path.resolve(__dirname, 'src/lib'),
    '@libs': path.resolve(__dirname, 'src/libs'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@context': path.resolve(__dirname, 'src/context'),
     '@providers': path.resolve(__dirname, 'src/providers')
  })
);