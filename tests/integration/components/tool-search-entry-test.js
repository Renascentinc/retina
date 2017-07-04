import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tool-search-entry', 'Integration | Component | tool search entry', {
    integration: true
});

test('it renders', function(assert) {
    this.render(hbs`{{tool-search-entry}}`);

    assert.equal(this.$().text().trim(), '');
});
