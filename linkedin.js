const axios = require('axios');
const database = require('./airtable.js');

module.exports = {

  async getEmail(accessToken) {
    try {
      const result = await axios({
        method: 'get',
        url: 'https://api.linkedin.com/v2/emailAddress',
        params: {
          q: 'members',
          projection: '(elements*(handle~))',
          oauth2_access_token: accessToken,
        },
      });
      return result.data.elements[0]['handle~'].emailAddress;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async getProfile(accessToken) {
    try {
      const result = await axios({
        method: 'get',
        url: 'https://api.linkedin.com/v2/me',
        params: {
          oauth2_access_token: accessToken,
        },
      });
      return result.data;
    } catch (e) {
      console.error(e);
      return false;
    }
  },


  async shareArticle(id, accessToken) {
    return axios({
      method: 'post',
      url: 'https://api.linkedin.com/v2/ugcPosts',
      headers: { 'X-Restli-Protocol-Version': '2.0.0' },
      data: {
        author: `urn:li:person:${id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: 'Learning more about LinkedIn by reading the LinkedIn Blog!',
            },
            shareMediaCategory: 'ARTICLE',
            media: [
              {
                status: 'READY',
                description: {
                  text: 'Official LinkedIn Blog - Your source for insights and information about LinkedIn.',
                },
                originalUrl: 'https://blog.linkedin.com/',
                title: {
                  text: 'Official LinkedIn Blog',
                },
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS',
        },
      },
      oauth2_access_token: accessToken,
    });
  },

  async store(accessToken) {
    const profile = await this.getProfile(accessToken);

    const exists = await database.findRecord('username', profile.id);
    if (!exists) {
      const email = await this.getEmail(accessToken);
      const fullName = `${profile.localizedFirstName} ${profile.localizedLastName}`;
      const user = {
        id: accessToken,
        name: fullName,
        email,
        username: profile.id,
        platform: 'linkedin',
      };
      await database.storeRecord(user);
    }
  },
};
