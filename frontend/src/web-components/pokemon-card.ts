import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('pokemon-card')
export class PokemonCard extends LitElement {
  @property({ type: String }) name = ''
  @property({ type: String }) image = ''

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
    }
  `
  render() {
    return html` <img src=${this.image} alt=${this.name} /> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-card': PokemonCard
  }
}
