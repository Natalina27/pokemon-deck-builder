/// <reference types="react" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pokemon-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string
        image?: string
      }
    }
  }
}