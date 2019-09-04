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
          <div class="row justify-center text-center">
            <h5>
              Join our group chat on Telegram
            </h5>
          </div>
          <div class="row justify-center">
            <a href="https://t.me/CatalystNetOrg">
              <q-avatar
                size="100px"
              >
                <img src="../../assets/catalyst-icon.jpeg">
              </q-avatar>
            </a>
          </div>
          <div class="row justify-center title">
            <a href="https://t.me/CatalystNetOrg">
              <h6>t.me/CatalystNetOrg</h6>
            </a>
          </div>
        </div>
        <div
          class="col-auto"
          style="margin-bottom: 2rem; margin-top: 3rem;"
        >
          <div class="row justify-center default-font-bold">
            <q-btn
              unelevated
              color="secondary"
              label="Join"
              @click="linkToTelegram"
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

export default {
  name: 'Twitter',

  data() {
    return {
      tweetLabel: 'Retweet',
      tweeted: false,
      followed: false,
      rewardDialog: false,
      qrCodeDataURL: null,
    };
  },

  methods: {

    linkToTelegram() {
      window.location.href = 'https://t.me/CatalystNetOrg';
    },
  },
};
</script>
<style>
.title h5 {
  line-height: 1rem;
  margin-block-end: 1rem;
  text-align: center;
}

.title a, .title a:visited {
    color: white;
    text-decoration: none;
}
.loading:before {
    opacity: 1;
}

</style>
