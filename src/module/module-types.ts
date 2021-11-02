import { AddAction } from '../add/add-types'
import { ClearAction } from '../clear/clear-types'
import { EditAction } from '../edit/edit-types'
import { FetchAction } from '../fetch/fetch-types'
import { filterItems, groupItems, sortItems } from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { RefetchAction } from '../refetch/refetch-types'
import { RemoveAction } from '../remove/remove-types'
import { GetParamsKey } from '../status/status-types'

//==============================================================================

export type Module<D, P> = {
    add: AddAction<D>
    clear: ClearAction<D>
    edit: EditAction<D>
    fetch: FetchAction<P>
    refetch: RefetchAction<P>
    remove: RemoveAction<D>

    filterItems: typeof filterItems
    groupItems: typeof groupItems
    sortItems: typeof sortItems
}

export type GetKeys<D, P> = {
    getDataKey: GetDataKey<D>
    getParamsKey: GetParamsKey<P>
}
