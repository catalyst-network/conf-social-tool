<template>
  <q-page class="flex flex-center bg-primary">
    <div
      class="column justify-center q-gutter-y-lg"
    >
      <div class="col-auto">
        <div class="row justify-center title">
          <h5>
            To earn some free goodies
          </h5>
        </div>
        <div class="col-auto">
          <div class="row justify-center title">
            <h5>
              Give us a follow
            </h5>
          </div>
          <div class="row justify-center">
            <twitter
              v-if="!followed"
            >
              <a
                href="https://twitter.com/twitter"
                class="twitter-follow-button"
                data-size="large"
                data-show-count="false"
              >
                Follow @catalystNetOrg
              </a>
            </twitter>
            <p
              v-if="followed"
              class="text-secondary default-font-bold"
            >
              Done <q-icon name="done" />
            </p>
          </div>
        </div>
        <div class="col-auto">
          <div class="row justify-center title">
            <h5>
              Share this Tweet
            </h5>
          </div>
          <div class="row justify-center">
            <twitter
              style="max-width: 85vw"
            >
              <blockquote class="twitter-tweet">
                <p
                  lang="en"
                  dir="ltr"
                >
                  appreciation Tweet 🙏
                </p>&mdash; Twitter (@Twitter)
                <a href="https://twitter.com/Twitter/status/1161997700985958403?ref_src=twsrc%5Etfw">August 15, 2019</a>
              </blockquote>
            </twitter>
          </div>
          <div class="row justify-center default-font-bold">
            <q-btn
              v-if="!tweeted"
              :disable="tweeted"
              unelevated
              color="blue"
              :label="tweetLabel"
              @click="tweet"
            />
            <p
              v-if="tweeted"
              class="text-secondary"
            >
              Done <q-icon name="done" />
            </p>
          </div>
        </div>
        <div
          class="col-auto"
          style="margin-bottom: 2rem; margin-top: 3rem;"
        >
          <div class="row justify-center default-font-bold">
            <q-btn
              :disable="!tweeted"
              unelevated
              color="secondary"
              label="Claim Reward"
              @click="claimReward"
            />
          </div>
        </div>
      </div>
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      />
    </div>
    <q-dialog
      v-model="rewardDialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-info text-black text-center">
        <q-card-section>
          <h5>
            To claim your free T-shirt show this QR code at the Catalyst Booth
          </h5>
        </q-card-section>
        <q-card-section>
          <div class="qr-code text-black">
            <img
              :src="qrCodeDataURL"
            >
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { twitter } from 'vue-twitter';
import * as QRCode from 'qrcode';

export default {
  name: 'Twitter',
  components: {
    twitter,
  },
  data() {
    return {
      tweetLabel: 'Retweet',
      tweeted: false,
      followed: false,
      rewardDialog: false,
      qrCodeDataURL: null,
    };
  },


  async mounted() {
    if (this.signedIn()) {
      console.log('Followed: ', await this.hasFollowed());
      console.log('Tweeted: ', await this.hasTweeted());
      await QRCode.toDataURL('text', (err, url) => {
        if (err) {
          console.error(err);
        } else {
          console.log('URL: ', url);
          console.log(typeof url === 'string');
          this.qrCodeDataURL = url;
        }
      });
    } else {
      this.$router.push('/');
    }
  },

  methods: {
    async qrCode(user) {
      // const options = {
      //   width: 300,
      //   height: 300,
      // };
      if (typeof user === 'string') {
        console.log(user);
        await QRCode.toDataURL('text', (err, url) => {
          if (err) {
            console.error(err);
          } else {
            console.log('URL: ', url);
            console.log(typeof url === 'string');
            this.qrCodeDataURL = url;
          }
        });
      }
    },
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
        console.log(following);
        this.followed = true;
        return following.includes('Twitter');
      });
    },
    async hasTweeted() {
      return this.$hello('twitter').api('me/share', { limit: 25 }).then((response) => {
        const tweets = response.data.map(tweet => tweet.text);
        if (tweets.includes('RT @Twitter: appreciation Tweet 🙏')) {
          this.tweeted = true;
          this.tweetLabel = 'Done';
          return true;
        }
        return false;
      });
    },
    async tweet() {
      this.$hello('twitter').api('me/share', 'POST', {
        id: '1161997700985958403',
      }).then((...args) => {
        this.tweeted = true;
        this.tweetLabel = 'Done';
        console.log(args);
      },
      (...args) => console.log(args));
    },
    async claimReward() {
      if (this.followed && this.tweeted) {
        // const qrCodeData = {
        //   platform: 'twitter',
        //   username: '__stxphxn__',
        //   name: 'Stephen',
        //   email: 'test@test.com',
        //   access_token: '1154427289414897666-l9Hfsmwn2WYM581sImCrH5byPX3uaV',
        // };
        // const text = JSON.stringify(qrCodeData);
        console.log(this.qrCodeDataURL);
        this.rewardDialog = true;
      }
    },
  },
};
</script>
<style>
.title h5 {
  line-height: 1rem;
  margin-block-end: 1rem;
}
</style>
