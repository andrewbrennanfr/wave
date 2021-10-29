import { useModule } from './module/module-tools'
import { Module as _Module } from './module/module-types'

export type Module<D, P> = _Module<D, P>

export type Items<D, P> = Module<D, P>['state']['items']
export type Statuses<D, P> = Module<D, P>['state']['statuses']

export default useModule
