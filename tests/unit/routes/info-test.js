import { moduleFor, test } from 'ember-qunit';

moduleFor('route:info', 'Unit | Route | info', {
    needs: ['service:session']
});

test('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});
