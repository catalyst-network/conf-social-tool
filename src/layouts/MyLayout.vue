<template>
  <q-layout view="hHh lpr fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="justify-center">
          <div class="row justify-center">
            <img
              class="logo"
              style="padding: 1rem 0"
              src="../assets/logo.svg"
            >
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
  methods: {
    openURL,
  },
};
</script>

<style>
</style>
