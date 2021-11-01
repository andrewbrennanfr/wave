import { makeModule } from './module/module-tools'
import { Module as _Module } from './module/module-types'

//==============================================================================

export type Module<D, P> = _Module<D, P>

export type State<D, P> = Module<D, P>['state']

export type Items<D, P> = State<D, P>['items']

export type Item<D, P> = NonNullable<Items<D, P>[string]>

export type Statuses<D, P> = State<D, P>['statuses']

export type Status<D, P> = NonNullable<Statuses<D, P>[string]>

export default makeModule
