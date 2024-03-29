module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@screens': './src/screens',
            '@components': './src/components',
            '@services': './src/services',
            '@types': './src/types',
            '@navigation': './src/navigation',
            '@styles': './src/styles',
            '@globals': './src/globals'
          }
        },
      ]
    ]
  };
};
