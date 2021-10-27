import type { Fetch as _Fetch, Fetches as _Fetches } from './fetch/fetch-types'
import type { Item as _Item, Items as _Items } from './item/item-types'
import { makeModule } from './module/module-tools'
import type { Module as _Module } from './module/module-types'
import type { State as _State } from './state/state-types'

export type Fetch<P> = _Fetch<P>
export type Fetches<P> = _Fetches<P>
export type Item<D> = _Item<D>
export type Items<D> = _Items<D>
export type Module<D, P> = _Module<D, P>
export type State<D, P> = _State<D, P>

export default makeModule
