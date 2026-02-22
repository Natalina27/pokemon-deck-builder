import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type PokemonCardProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  name?: string
  image?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'pokemon-card': PokemonCardProps
    }
  }
}
