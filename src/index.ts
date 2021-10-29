import { PublicItems } from './item/item-types'
import { useModule } from './module/module-tools'
import { Module as _Module } from './module/module-types'
import { PublicStatuses } from './status/status-types'

export type Items<D> = PublicItems<D>
export type Module<D, P> = _Module<D, P>
export type Statuses<D> = PublicStatuses<D>

export default useModule
