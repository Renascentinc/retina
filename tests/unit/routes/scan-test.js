import { moduleFor, test } from 'ember-qunit';

moduleFor('route:scan', 'Unit | Route | scan', {
    needs: ['service:session']
});

test('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});
