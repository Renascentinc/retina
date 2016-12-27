import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  },
  
  isLoginRoute: Ember.computed('currentRouteName', {
    get() {
        return (this.get('currentRouteName') === 'login');
    }
  }),
  
  getHeaderText: Ember.computed('currentRouteName', {
      get() {
          let headerText = 'RETINA';
          let routeName = this.get('currentRouteName');
          
          if( routeName === 'search' ) {
              headerText = 'Search';
              
          } else if( routeName === 'add') {
              headerText = 'Add Tool';
          }
          return( headerText );
      }
  })
});