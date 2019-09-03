import { Model } from '@vuex-orm/core';

export default class Profile extends Model {
  static entity = 'profiles';

  static primaryKey = 'platform';

  static fields() {
    return {
      name: this.attr(''),
      username: this.attr(''),
      email: this.attr(''),
      accessToken: this.attr(''),
      platform: this.attr(''),
    };
  }
}
