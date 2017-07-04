import { moduleFor, test } from 'ember-qunit';

moduleFor('route:search', 'Unit | Route | search', {
    needs: ['service:session']
});

test('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});
