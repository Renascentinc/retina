import { shallowMount } from '@vue/test-utils'
import AddButton from '@/components/add-button.vue'
import sinon from 'sinon'

describe('add-button.vue', () => {
  it('renders the correct title', () => {
    const wrapper = shallowMount(AddButton, {
      propsData: {
        text: 'TEST',
        onClick () {}
      }
    })
    expect(wrapper.find('.default-text').text()).toMatch('NEW TEST')
  })

  it('fires an action on click', () => {
    const onClick = sinon.stub()

    const wrapper = shallowMount(AddButton, {
      propsData: {
        text: 'TEST',
        onClick
      }
    })

    wrapper.find('.search-result').trigger('click')
    expect(onClick.called).toBe(true)
  })
})
