import { AddAction } from '../add/add-types'
import { EditAction } from '../edit/edit-types'
import { FetchAction } from '../fetch/fetch-types'
import { groupItems, sortItems } from '../item/item-tools'
import { RefetchAction } from '../refetch/refetch-types'
import { RemoveAction } from '../remove/remove-types'
import { State } from '../state/state-types'

export type Module<D, P> = {
    add: AddAction<D, P>
    edit: EditAction<D, P>
    fetch: FetchAction<D, P>
    refetch: RefetchAction<D, P>
    remove: RemoveAction<D, P>

    groupItems: typeof groupItems
    sortItems: typeof sortItems

    state: State<D, P>
}
