import { Items } from '../item/item-types'
import { Statuses } from '../status/status-types'

export type State<D, P> = { items: Items<D>; statuses: Statuses<P> }

export type UseState<D, P> = {
    getState: () => State<D, P>
    setState: (partial: Partial<State<D, P>>) => void
}
