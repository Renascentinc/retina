import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-header', 'Integration | Component | search header', {
    integration: true
});

skip('it renders', function(assert) {
    this.render(hbs`{{search-header}}`);

    assert.equal(this.$().text().trim(), '');
});
