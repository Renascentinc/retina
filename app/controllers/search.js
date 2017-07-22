import Ember from 'ember';
import SearchMixin from '../mixins/search-driver';

export default Ember.Controller.extend(SearchMixin, {
    goToInfoPage(toolId) {
        this.transitionToRoute('info', toolId);
    }
});
