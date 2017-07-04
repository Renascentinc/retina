import { moduleFor, test } from 'ember-qunit';

moduleFor('route:loading', 'Unit | Route | loading', {
    needs: ['service:session']
});

test('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});
