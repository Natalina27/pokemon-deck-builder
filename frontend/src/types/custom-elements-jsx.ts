/* eslint-disable @typescript-eslint/no-namespace */

import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type PokemonCardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  name?: string
  image?: string
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'pokemon-card': PokemonCardProps
      }
    }
  }
}
