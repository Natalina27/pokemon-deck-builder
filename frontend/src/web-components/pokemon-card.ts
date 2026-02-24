import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('pokemon-card')
export class PokemonCard extends LitElement {
  @property({ type: String }) name = ''
  @property({ type: String }) image = ''
  @state() private imageLoaded = false

  static styles = css`
    :host {
      display: block;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;
    }
    :host:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: auto;
      display: block;
      opacity: 0;
      transition: opacity 0.25s ease-out;
    }
    img.loaded {
      opacity: 1;
    }
  `
  render() {
    return html`
      <img
        src=${this.image}
        alt=${this.name}
        class=${this.imageLoaded ? 'loaded' : ''}
        loading="lazy"
        @load=${() => {
          this.imageLoaded = true
        }}
        @error=${() => {
          this.imageLoaded = true
        }}
      />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-card': PokemonCard
  }
}
