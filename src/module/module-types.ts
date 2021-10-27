import type { Item } from '../item/item-types'
import type { State } from '../state/state-types'

export type Module<D, P> = {
    list: (comparator: (item: Item<D>) => number | string) => Array<Item<D>>
    state: State<D, P>
    add: (data: D) => void
    edit: (oldData: D, newData: D) => void
    fetch: (params: P) => void
    refetch: (params: P) => void
    remove: (data: D) => void
}
