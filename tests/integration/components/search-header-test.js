import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-header', 'Integration | Component | search header', {
    integration: true,

    beforeEach() {
        this.set('_query', { status: '', brand: '', type: '', userID: '' });
        this.set('_fuzzySearchParams', { parameter: '' });
    }
});

test('it renders', function(assert) {
    this.render(hbs`{{search-header fuzzySearchParams=_fuzzySearchParams}}`);

    assert.equal(this.$('.search-header').length, 1);
});
