import Ember from 'ember';
import attachFastClick from 'fastclick';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  },

  isLoginRoute: Ember.computed('currentRouteName', function() {
    return this.get('currentRouteName') === 'login';
  }),

  init() {
    Ember.run.scheduleOnce('afterRender', () => attachFastClick.attach(document.body));
  }
});
