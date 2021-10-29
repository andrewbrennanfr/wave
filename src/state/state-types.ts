import { Items } from '../item/item-types'
import { Statuses } from '../status/status-types'

export type State<D, P> = { items: Items<D>; statuses: Statuses<P> }
