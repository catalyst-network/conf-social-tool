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
                href="https://twitter.com/catalystNetOrg"
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
                  Catalyst has developed a genuinely innovative consensus protocol — neither proof-of-work, nor proof-of-stake — that is fast, light, <a href="https://twitter.com/hashtag/secure?src=hash&amp;ref_src=twsrc%5Etfw">#secure</a> and <a href="https://twitter.com/hashtag/scalable?src=hash&amp;ref_src=twsrc%5Etfw">#scalable</a>. How can <a href="https://twitter.com/hashtag/dotnet?src=hash&amp;ref_src=twsrc%5Etfw">#dotnet</a> developers participate? Click here and find out more 👉 <a href="https://t.co/tKmPfXuKnu">https://t.co/tKmPfXuKnu</a> <a href="https://t.co/9FRpINRn19">pic.twitter.com/9FRpINRn19</a>
                </p>&mdash; Catalyst Network (@catalystNetOrg) <a href="https://twitter.com/catalystNetOrg/status/1169547000439812096?ref_src=twsrc%5Etfw">September 5, 2019</a>
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
        <div class="row justify-end">
          <q-icon
            v-close-popup
            name="close"
            size="md"
          />
        </div>
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
import Profile from '../../store/Profile';


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

  computed: {
    user() {
      return Profile.find('twitter');
    },
  },


  async mounted() {
    this.$q.loading.show({
      backgroundColor: 'primary',
      messageColor: 'secondary',
      customClass: 'loading',
    });
    if (this.signedIn()) {
      this.followed = await this.hasFollowed();
      console.log('Tweeted: ', await this.hasTweeted());
    } else {
      this.$router.push('/');
    }
    this.$q.loading.hide();
  },

  methods: {
    async qrCode(user) {
      const options = {
        width: 300,
        height: 300,
      };
      if (typeof user === 'string') {
        await QRCode.toDataURL(user, options, (err, url) => {
          if (err) {
            console.error(err);
          } else {
            this.qrCodeDataURL = url;
          }
        });
      }
    },
    signedIn() {
      const session = this.$hello('twitter').getAuthResponse();
      const currentTime = (new Date()).getTime() / 1000;
      return session && session.access_token && session.expires > currentTime;
    },
    async hasFollowed() {
      return this.$hello('twitter').api('me/following', { limit: 25 }).then((response) => {
        const following = response.data.map(account => account.screen_name);
        if (following.includes('catalystNetOrg')) {
          this.followed = true;
          return true;
        }
        this.followed = false;
        return false;
      });
    },
    async hasTweeted() {
      return this.$hello('twitter').api('me/share', { limit: 25 }).then((response) => {
        const tweets = response.data.map(tweet => tweet.text);
        if (tweets.includes('RT @catalystNetOrg: Catalyst has developed a genuinely innovative consensus protocol — neither proof-of-work, nor proof-of-stake — that is…')) {
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
      }).then(() => {
        this.tweeted = true;
        this.tweetLabel = 'Done';
      },
      (...args) => console.log(args));
    },
    async claimReward() {
      if (await this.hasFollowed() && this.tweeted) {
        const qrCodeData = {
          platform: 'twitter',
          username: this.user.username,
          name: this.user.name,
          access_token: this.user.accessToken,
        };
        const text = JSON.stringify(qrCodeData);
        await this.qrCode(text);
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
.loading:before {
    opacity: 1;
}

</style>
