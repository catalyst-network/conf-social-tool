<template>
  <q-page class="flex flex-center bg-primary">
    <div class="column">
      <h3 class="text-info text-center">
        Join the community
      </h3>
      <!-- <q-button @click="auth('twitter')">Twitter</q-button>
    <q-button @click="auth('twitter')">LinkedIn</q-button>
    <q-button @click="auth('twitter')">Facebook</q-button>
    <q-button @click="auth('twitter')">Github</q-button> -->
      <div class="column q-pa-md q-gutter-y-md">
        <q-btn
          unelevated
          rounded
          style="background: #1da1f2; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-twitter"
          label="Join with"
          size="md"
          class="text-info"
        />
        <q-btn
          unelevated
          rounded
          style="background: #1877f2; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-facebook"
          label="Join with"
          class="text-info"
        />
        <q-btn
          unelevated
          rounded
          style="background: #007bb5; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-linkedin"
          label="Join with"
          class="text-info"
        />
        <q-btn
          unelevated
          rounded
          style="background: #211f1f; margin: 0.75rem auto; width: 70%;"
          icon-right="fab fa-github"
          label="Join with"
          class="text-info"
        />
      </div>

      <!-- <q-list dark>
        <q-item
          clickable
          @click="auth('twitter')"
        >
          <q-item-section avatar>
            <q-icon name="fab fa-twitter" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Join with Twitter') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon name="fab fa-facebook" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Join with Facebook') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon name="fab fa-linkedin" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Join with LinkedIn') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon name="fab fa-github" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('Join with Github') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list> -->
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',

  methods: {
    auth(network) {
      this.$hello.init({
        twitter: 'AeWaRlsX9Y0sGN6hzOPbnvD7i',
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
          /*
            performs operations using the user info from profile
          */
        });
      });
    },
  },
};
</script>
