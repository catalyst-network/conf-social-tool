<template>
  <div>
    <div class="row justify-center">
      Follow us
    </div>
    <div class="row justify-center">
      <twitter>
        <a
          href="https://twitter.com/twitter"
          class="twitter-follow-button"
          data-size="large"
          data-show-count="false"
        >
          Follow @catalystNetOrg
        </a>
      </twitter>
    </div>
    <div class="row justify-center">
      Tweet
    </div>
    <div class="row justify-center">
      <q-btn
        label="Tweet"
        @click="tweet"
      />
    </div>
  </div>
</template>
<script>
import { twitter } from 'vue-twitter';

export default {
  name: 'Twitter',
  components: {
    twitter,
  },

  async mounted() {
    if (this.signedIn()) {
      console.log(await this.hasFollowed());
      console.log(await this.hasTweeted());
    } else {
      this.router.push('/');
    }
  },

  methods: {
    signedIn() {
      const session = this.$hello('twitter').getAuthResponse();
      console.log(session);
      const currentTime = (new Date()).getTime() / 1000;
      console.log(session.expires, currentTime);
      return session && session.access_token && session.expires > currentTime;
    },
    async hasFollowed() {
      return this.$hello('twitter').api('me/following', { limit: 25 }).then((response) => {
        const following = response.data.map(account => account.screen_name);
        console.log('Followed; ', following.includes('catalystNetOrg'));
        return following.includes('catalystNetOrg');
      });
    },
    async hasTweeted() {
      return this.$hello('twitter').api('me/share', { limit: 25 }).then((response) => {
        const tweets = response.data.map(tweet => tweet.text);
        console.log('Tweeted: ', tweets.includes('Test Tweet'));
        return tweets.includes('Test Tweet');
      });
    },
    async tweet() {
      this.$hello('twitter').api('me/share', 'POST', {
        message: 'Test Tweet2',
      }).then((...args) => console.log(args), (...args) => console.log(args));
    },
  },

};
</script>
<style>

</style>
