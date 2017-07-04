import { moduleFor, test } from 'ember-qunit';

moduleFor('service:data-cache', 'Unit | Service | data cache', {
    needs: ['service:session']
});

test('it exists', function(assert) {
    let service = this.subject();
    assert.ok(service);
});
