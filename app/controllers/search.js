import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    selectedStatus: '',

    selectedBrand: '',

    selectedType: '',

    _userID: null,

    _query: Ember.computed(function() {
        return {
            status: this.getWithDefault('selectedStatus', ''),
            brand: this.getWithDefault('selectedBrand', ''),
            type: this.getWithDefault('selectedType', ''),
            userID: this.getWithDefault('_userID', '')
        }
    }).volatile()
});
