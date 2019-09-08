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
            <iframe
              src="https://www.linkedin.com/pages-extensions/FollowCompany?id=18055982&counter=bottom"
              height="43"
              width="81"
              frameborder="0"
              allowfullscreen=""
              title="Embedded post"
            />
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
              Share this Post
            </h5>
          </div>
          <div class="row justify-center">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:6564520918251634688"
              height="563"
              width="504"
              frameborder="0"
              allowfullscreen=""
              title="Embedded post"
            />
          </div>
          <div class="row justify-center default-font-bold">
            <q-btn
              v-if="!shared"
              :disable="shared"
              unelevated
              color="blue"
              :label="shareLabel"
              @click="share"
            />
            <p
              v-if="shared"
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
              :disable="!shared"
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

import * as QRCode from 'qrcode';
import Profile from '../../store/Profile';

export default {
  name: 'Linkedin',

  data() {
    return {
      shareLabel: 'Share',
      shared: false,
      followed: false,
      rewardDialog: false,
      qrCodeDataURL: null,
      accessToken: null,
    };
  },

  computed: {
    user() {
      return Profile.find('linkedin');
    },
  },


  async mounted() {
    this.$q.loading.show({
      backgroundColor: 'primary',
      messageColor: 'secondary',
      customClass: 'loading',
    });
    if (!this.signedIn()) {
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
        console.log(user);
        await QRCode.toDataURL(user, options, (err, url) => {
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
      const session = this.$hello('linkedin').getAuthResponse();
      this.accessToken = session.access_token;
      console.log(session);
      const currentTime = (new Date()).getTime() / 1000;
      console.log(session.expires, currentTime);
      return session && session.access_token && session.expires > currentTime;
    },
    async share() {
      const result = await this.$axios.get(`http://127.0.0.1:5500/linkedin/share/${this.user.username}/${this.user.id}`);
      if (result === 'success') {
        this.shared = true;
        this.shareLabel = 'Done';
      }
    },
    async claimReward() {
      if (this.followed && this.shared) {
        const qrCodeData = {
          platform: 'linkedin',
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
