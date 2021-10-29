import { AddAction } from '../add/add-types'
import { EditAction } from '../edit/edit-types'
import { FetchAction } from '../fetch/fetch-types'
import { groupItems, sortItems } from '../item/item-tools'
import { PublicItems } from '../item/item-types'
import { RefetchAction } from '../refetch/refetch-types'
import { RemoveAction } from '../remove/remove-types'
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
