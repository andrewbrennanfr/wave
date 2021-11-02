import { makeAdd } from '../add/add-tools'
import { AddRequest } from '../add/add-types'
import { makeClear } from '../clear/clear-tools'
import { makeEdit } from '../edit/edit-tools'
import { EditRequest } from '../edit/edit-types'
import { makeFetch } from '../fetch/fetch-tools'
import { FetchRequest } from '../fetch/fetch-types'
import { filterItems, groupItems, sortItems } from '../item/item-tools'
import { makeRefetch } from '../refetch/refetch-tools'
import { RefetchRequest } from '../refetch/refetch-types'
import { makeRemove } from '../remove/remove-tools'
import { RemoveRequest } from '../remove/remove-types'
import { UseState } from '../state/state-types'
import { GetKeys, Module } from './module-types'
import * as R from 'ramda'

//==============================================================================

export const makeModule = <D, P>(
    useState: UseState<D, P>,
    getKeys: GetKeys<D, P>,
    requests: {
        add: AddRequest<D>
        edit: EditRequest<D>
        fetch: FetchRequest<D, P>
        refetch: RefetchRequest<D, P>
        remove: RemoveRequest<D>
    }
): Module<D, P> => ({
    add: makeAdd(useState, getKeys, R.prop('add', requests)),
    clear: makeClear(useState),
    edit: makeEdit(useState, getKeys, R.prop('edit', requests)),
    fetch: makeFetch(useState, getKeys, R.prop('fetch', requests)),
    refetch: makeRefetch(useState, getKeys, R.prop('refetch', requests)),
    remove: makeRemove(useState, getKeys, R.prop('remove', requests)),

    filterItems,
    groupItems,
    sortItems,
})
