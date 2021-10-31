import { Item } from '../item/item-types'
import { UseState } from '../state/state-types'

//==============================================================================

export type ClearAction<D, P> = (
    useState: UseState<D, P>,
    fn: (item: Item<D>) => boolean
) => void
