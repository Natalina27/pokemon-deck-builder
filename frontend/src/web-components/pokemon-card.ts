import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('pokemon-card')
export class PokemonCard extends LitElement {
    @property({ type: String }) name = ''
    @property({ type: String }) image = ''
    
    static styles = css`
        :host {
            display: block;
            width: 200px;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
        }
        img {
            width: 100%;
        }
        p {
            font-weight: bold;
        }
    `
  render() {
    console.log('render called', this.name, this.image)
    return html`
    <img src=${this.image} alt=${this.name} />
    <p>${this.name}</p>
    `
  }
}

declare global {
    interface HTMLElementTagNameMap {
        'pokemon-card': PokemonCard
    }
}
