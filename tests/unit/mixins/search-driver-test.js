import Ember from 'ember';
import SearchDriverMixin from 'retina-app/mixins/search-driver';
import { module, test } from 'qunit';

module('Unit | Mixin | search driver', {
    needs: ['service:session', 'service:store']
});

test('it works', function(assert) {
    let SearchDriverObject = Ember.Object.extend(SearchDriverMixin);
    let subject = SearchDriverObject.create();
    assert.ok(subject);
});

test('it returns the tools and dropdown if it already has it', function(assert) {
    let SearchDriverObject = Ember.Object.extend(SearchDriverMixin, {
        // _dropdown: { key: 'vlaue' },
        _tools: { key: 'value' }
    });
    let subject = SearchDriverObject.create();

    let dropdown = subject.get('dropdown');
    assert.equal(dropdown, { key: 'value' });

    let tools = subject.get('tools');
    assert.equal(tools, { key: 'value' });
});
