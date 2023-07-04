import { BlockLink } from './src/BlockLink.js';

if (!customElements.get('block-link')) {
  customElements.define('block-link', BlockLink);
}