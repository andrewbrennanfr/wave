import type { AddAction } from '../add/add-types'
import type { EditAction } from '../edit/edit-types'
import type { FetchAction } from '../fetch/fetch-types'
import type { groupItems, sortItems } from '../item/item-tools'
import type { PublicItems } from '../item/item-types'
import type { RefetchAction } from '../refetch/refetch-types'
import type { RemoveAction } from '../remove/remove-types'
import { PublicStatuses } from '../status/status-types'

export type Module<D, P> = {
    state: { items: PublicItems<D>; statuses: PublicStatuses<P> }
    groupItems: typeof groupItems
    sortItems: typeof sortItems

    add: AddAction<D>
    edit: EditAction<D>
    fetch: FetchAction<P>
    refetch: RefetchAction<P>
    remove: RemoveAction<D>
}
