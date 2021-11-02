import { Items as _Items } from './item/item-types'
import { makeModule } from './module/module-tools'
import { Module as _Module } from './module/module-types'
import { State as _State } from './state/state-types'
import { Statuses as _Statuses } from './status/status-types'

//==============================================================================

export type Module<D, P> = _Module<D, P>

export type State<D, P> = _State<D, P>

export type Items<D> = _Items<D>

export type Item<D> = NonNullable<Items<D>[string]>

export type Statuses<P> = _Statuses<P>

export type Status<P> = NonNullable<Statuses<P>[string]>

export default makeModule
