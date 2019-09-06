<template>
  <q-page class="flex flex-center bg-primary">
    <div class="column">
      <h3 class="text-info text-center">
        Join the community
      </h3>
      <div class="column q-pa-md q-gutter-y-md">
        <q-btn
          unelevated
          style="background: #1da1f2; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-twitter"
          label="Join with"
          size="md"
          class="text-info"
          @click="auth('twitter')"
        />
        <!-- <q-btn
          unelevated
          style="background: #1877f2; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-facebook"
          label="Join with"
          class="text-info"
        /> -->
        <q-btn
          unelevated
          style="background: #007bb5; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-linkedin"
          label="Join with"
          class="text-info"
        />
        <q-btn
          unelevated
          style="background: #211f1f; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-github"
          label="Join with"
          class="text-info"
          @click="auth('github')"
        />
        <q-btn
          unelevated
          style="background: #2fa3e6; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-telegram"
          label="Join with"
          class="text-info"
          @click="auth('telegram')"
        />
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import Profile from '../store/Profile';

export default {
  name: 'Join',

  methods: {
    auth(network) {
      if (network === 'telegram') { this.$router.push('/telegram'); }
      this.$hello.init({
        twitter: 'AeWaRlsX9Y0sGN6hzOPbnvD7i',
        github: '10dd01c1a10f078a45fa',
      }, {
        oauth_proxy: 'http://127.0.0.1:5500/proxy',
        redirect_uri: '/loading',
      });
      this.$hello(network).login({ display: 'popup' }).then(() => {
        const authRes = this.$hello(network).getAuthResponse();
        console.log(authRes);
        /*
          performs operations using the token from authRes
        */
        this.$hello(network).api('me').then((json) => {
          const profile = json;
          console.log(profile);
          const user = {
            name: profile.name,
            username: profile.screen_name,
            id: authRes.oauth_token,
            platform: network,
          };
          const userExists = Profile.find(network);
          const isExistingUser = this.$axios.get(`http://127.0.0.1:5500/find/${authRes.oauth_token}`);
          if (!userExists) {
            Profile.insert({
              data: user,
            });
          }
          if (!isExistingUser) {
            this.$axios({
              method: 'get',
              url: 'http://127.0.0.1:5500/create',
              params: user,
            }).then((res) => {
              console.log(res);
            });
          }

          this.$router.push(`/${network}`);
          /*
            performs operations using the user info from profile
          */
        });
      },
      (e) => {
        console.error(e);
      });
    },
  },
};
</script>
