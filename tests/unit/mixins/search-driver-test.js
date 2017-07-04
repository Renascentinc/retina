import Ember from 'ember';
import SearchDriverMixin from 'retina-app/mixins/search-driver';
import { module, test } from 'qunit';

module('Unit | Mixin | search driver', {
    needs: ['service:session']
});

test('it works', function(assert) {
    let SearchDriverObject = Ember.Object.extend(SearchDriverMixin);
    let subject = SearchDriverObject.create();
    assert.ok(subject);
});
