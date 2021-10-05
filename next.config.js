module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },

      use: ['@svgr/webpack'],
    });
    const IGNORES = [
      'electron'
    ];
    config.externals.push(({ context, request }, cb) => {
      if (IGNORES.indexOf(request) >= 0) {
        return cb(null, "require('" + request + "')");
      }
      return cb();
    })

    return config;
  },
  images: {
    domains: [
      'nft-market-dev.s3.us-east-2.amazonaws.com',
      'nft-market-dev.s3.amazonaws.com'
    ],
  },
}
