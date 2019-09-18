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
          @click="auth('linkedin')"
        />
        <!-- <q-btn
          unelevated
          style="background: #211f1f; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-github"
          label="Join with"
          class="text-info"
          @click="auth('github')"
        /> -->
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
    async storeUser(user, network) {
      const userExists = Profile.find(network);
      if (!userExists) {
        Profile.insert({
          data: user,
        });
      }
    },
    auth(network) {
      this.$q.loading.show({
        backgroundColor: 'primary',
        messageColor: 'secondary',
        customClass: 'loading',
      });

      if (network === 'telegram') {
        this.$router.push('/telegram');
        this.$q.loading.hide();
        return true;
      }

      this.$hello.init({
        twitter: process.env.TWITTER_CLIENT_ID,
        // github: process.env.GITHUB_CLIENT_ID,,
        linkedin: process.env.LINKEDIN_CLIENT_ID,
      }, {
        oauth_proxy: `${process.env.SERVER_ENDPOINT}/proxy`,
        redirect_uri: '/loading',
      });

      this.$hello(network).login({ display: 'popup', scope: 'email, publish' }).then(async () => {
        const authRes = this.$hello(network).getAuthResponse();
        console.log(authRes);
        /*
          performs operations using the token from authRes
        */
        if (network === 'linkedin') {
          const profile = await this.$axios.get(`${process.env.SERVER_ENDPOINT}/linkedin/profile/${authRes.access_token}`);
          console.log(profile);
          const user = {
            name: `${profile.data.localizedFirstName} ${profile.data.localizedLastName}`,
            username: profile.data.id,
            accessToken: authRes.access_token,
            platform: network,
          };
          this.storeUser(user, network);
        } else {
          const profile = await this.$hello(network).api('me');
          console.log(profile);
          const user = {
            name: profile.name,
            username: profile.screen_name,
            accessToken: authRes.oauth_token,
            platform: network,
          };
          this.storeUser(user, network);

          const isExistingUser = this.$axios.get(`${process.env.SERVER_ENDPOINT}/find/${authRes.oauth_token}`);
          if (!isExistingUser) {
            this.$axios({
              method: 'get',
              url: `${process.env.SERVER_ENDPOINT}/create`,
              params: user,
            }).then((res) => {
              console.log(res);
            });
          }
        }

        this.$router.push(`/${network}`);
        this.$q.loading.hide();
      },
      (e) => {
        console.error(e);
        this.$q.loading.hide();
      });
      return true;
    },
  },
};
</script>
