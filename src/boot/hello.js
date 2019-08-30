import hello from 'hellojs';

export default async ({ Vue }) => {
  Vue.prototype.$hello = hello;
};
