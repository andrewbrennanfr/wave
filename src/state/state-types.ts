import type { Items } from '../item/item-types'
import type { Statuses } from '../status/status-types'

export type State<D, P> = { items: Items<D>; statuses: Statuses<P> }
