import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tool-search-entry', 'Integration | Component | tool search entry', {
    integration: true,
    beforeEach() {
        this.set('tool', { id: 1, brand: 'Bosch', type: '18v Drill', username: 'username', status: 'Available' });
    }
});

test('it displays all tool info', function(assert) {
    this.render(hbs`{{tool-search-entry tool=tool}}`);

    assert.equal(this.$('.tool-info-id').first().text().trim(), 1);
    assert.equal(this.$('.tool-info-brand').first().text().trim(), 'Bosch');
    assert.equal(this.$('.tool-info-status').first().text().trim(), 'Available');
    assert.equal(this.$('.tool-info-type').first().text().trim(), '18v Drill');
    assert.equal(this.$('.tool-info-username').first().text().trim(), 'username,');
    assert.equal(this.$('.tool-info-status').first().text().trim(), 'Available');
});

test('it fires an action when the result is clicked', function(assert) {
    this.set('validate', function(toolId) {
        assert.ok(toolId, 'toolId was null');
        assert.equal(toolId, 1, 'toolId was incorrect');
    });

    this.render(hbs`{{tool-search-entry tool=tool onResultSelected=(action validate)}}`);

    this.$('.tool-info').first().trigger('click');
});

test('it renders info icon when you pass the displayOptions flag', function(assert) {
    this.render(hbs`{{tool-search-entry tool=tool displayOptions=true}}`);

    assert.ok(this.$('.search-icon.fa-info-circle').length === 1);
    assert.ok(this.$('.search-icon.fa-chevron-right').length === 0);
});
