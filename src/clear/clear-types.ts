import { Item } from '../item/item-types'

export type ClearAction<D> = (fn: (item: Item<D>) => boolean) => void
