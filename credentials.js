module.exports = [
  {
    name: 'twitter',
    domain: process.env.TWITTER_CALLBACK,
    client_id: process.env.TWITTER_CLIENT_ID,
    client_secret: process.env.TWITTER_CLIENT_SECRET,
    grant_url: 'https://api.twitter.com/oauth/access_token',
  },
  {
    name: 'github',
    domain: process.env.GITHUB_CALLBACK,
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    grant_url: 'https://github.com/login/oauth/access_token',
  },
  {
    name: 'linkedin',
    domain: process.env.LINKEDIN_CALLBACK,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    grant_url: 'https://www.linkedin.com/oauth/v2/accessToken',
  },
];
