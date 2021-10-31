import { AddAction } from '../add/add-types'
import { ClearAction } from '../clear/clear-types'
import { EditAction } from '../edit/edit-types'
import { FetchAction } from '../fetch/fetch-types'
import { filterItems, groupItems, sortItems } from '../item/item-tools'
import { RefetchAction } from '../refetch/refetch-types'
import { RemoveAction } from '../remove/remove-types'
import { State } from '../state/state-types'

//==============================================================================

export type Module<D, P> = {
    add: AddAction<D, P>
    clear: ClearAction<D, P>
    edit: EditAction<D, P>
    fetch: FetchAction<D, P>
    refetch: RefetchAction<D, P>
    remove: RemoveAction<D, P>

    filterItems: typeof filterItems
    groupItems: typeof groupItems
    sortItems: typeof sortItems

    state: State<D, P>
}
