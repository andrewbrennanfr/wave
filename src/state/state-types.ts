import type { Fetches } from '../fetch/fetch-types'
import type { Items } from '../item/item-types'

export type State<D, P> = { fetches: Fetches<P>; items: Items<D> }
