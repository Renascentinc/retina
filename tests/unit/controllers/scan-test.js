import { moduleFor, skip } from 'ember-qunit';

moduleFor('controller:scan', 'Unit | Controller | scan', {
    needs: ['service:notification-messages']
});

skip('it exists', function(assert) {
    let controller = this.subject();
    assert.ok(controller);
});
