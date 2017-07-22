import { moduleFor, test } from 'ember-qunit';

moduleFor('route:add', 'Unit | Route | add', {
    needs: ['service:session']
});

test('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});
