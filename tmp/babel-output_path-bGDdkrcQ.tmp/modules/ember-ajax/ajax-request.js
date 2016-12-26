import Ember from 'ember';
import AjaxRequestMixin from './mixins/ajax-request';

var EmberObject = Ember.Object;

export default EmberObject.extend(AjaxRequestMixin);