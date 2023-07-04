export class BlockLink extends HTMLElement {
  #state

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.#state = {
      element: undefined,
      target: undefined,
      down: null,
      up: null
    }
    this.controller = new AbortController()
  }

  get state() {
    return this.#state
  }

  set state(newState) {
    this.#state = { ...this.#state, ...newState }
  }

  get element() {
    const element = this.querySelectorAll(`${this.tagName.toLowerCase()} > *`)

    if (!element) {
      throw new Error('block-link must have one child element')
    }

    if (element.length > 1) {
      throw new Error('block-link must have only one child element')
    }

    return element[0]
  }

  get target() {
    const target = this.querySelectorAll('a[href]')

    if (!target.length) {
      throw new Error('block-link must have a child element with an href attribute')
    }

    if (target.length > 1) {
      throw new Error('block-link must have only one child element with an href attribute')
    }

    return target[0]
  }

  connectedCallback() {
    const { signal } = this.controller 
    const element = this.element
    const target = this.target

    this.state = { target, element }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: contents;
        }
      </style>

      <slot></slot>
    `

    this.element.addEventListener('mousedown', this.recordMouseDown.bind(this), { signal })
    this.element.addEventListener('mouseup', this.recordMouseUp.bind(this), { signal })
    this.element.addEventListener('click', this.handleClick.bind(this), { signal })

    element.style.cursor = 'pointer'
  }

  disconnectedCallback() {
    this.controller.abort()
  }

  recordMouseDown() {
    this.state = { down: +new Date() }
  }

  recordMouseUp() {
    this.state = { up: +new Date() }
  }

  handleClick() {
    const { target, down, up } = this.state

    if (up - down > 200) {
      return
    }

    target.click()
  }
}

if (!customElements.get('block-link')) {
  customElements.define('block-link', BlockLink)
}