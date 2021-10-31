import { makeAdd } from '../add/add-tools'
import { AddRequest } from '../add/add-types'
import { makeClear } from '../clear/clear-tools'
import { makeEdit } from '../edit/edit-tools'
import { EditRequest } from '../edit/edit-types'
import { makeFetch } from '../fetch/fetch-tools'
import { FetchRequest } from '../fetch/fetch-types'
import { filterItems, groupItems, sortItems } from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { makeRefetch } from '../refetch/refetch-tools'
import { RefetchRequest } from '../refetch/refetch-types'
import { makeRemove } from '../remove/remove-tools'
import { RemoveRequest } from '../remove/remove-types'
import { makeState } from '../state/state-tools'
import { GetParamsKey } from '../status/status-types'
import { Module } from './module-types'
import * as R from 'ramda'

//==============================================================================

export const makeModule = <D, P>(
    getKeys: { getDataKey: GetDataKey<D>; getParamsKey: GetParamsKey<P> },
    requests: {
        add: AddRequest<D>
        edit: EditRequest<D>
        fetch: FetchRequest<D, P>
        refetch: RefetchRequest<D, P>
        remove: RemoveRequest<D>
    }
): Module<D, P> => ({
    add: makeAdd(getKeys, R.prop('add', requests)),
    clear: makeClear(),
    edit: makeEdit(getKeys, R.prop('edit', requests)),
    fetch: makeFetch(getKeys, R.prop('fetch', requests)),
    refetch: makeRefetch(getKeys, R.prop('refetch', requests)),
    remove: makeRemove(getKeys, R.prop('remove', requests)),

    filterItems,
    groupItems,
    sortItems,

    state: makeState(),
})
