import { moduleFor, skip } from 'ember-qunit';

moduleFor('route:scan', 'Unit | Route | scan', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
});

skip('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});
