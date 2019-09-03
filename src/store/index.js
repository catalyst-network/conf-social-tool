import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexPersist from 'vuex-persist';
import Profile from './Profile';

// import example from './module-example'

Vue.use(Vuex);

const database = new VuexORM.Database();

const vuexPersist = new VuexPersist({
  key: 'catalyst-social',
  storage: localStorage,
});

database.register(Profile);

window.Profile = Profile;


/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },
    plugins: [VuexORM.install(database), vuexPersist.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
