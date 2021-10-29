import { useAdd } from '../add/add-tools'
import type { AddRequest } from '../add/add-types'
import { useEdit } from '../edit/edit-tools'
import type { EditRequest } from '../edit/edit-types'
import { useFetch } from '../fetch/fetch-tools'
import { FetchRequest } from '../fetch/fetch-types'
import { groupItems, sortItems } from '../item/item-tools'
import type { GetDataKey } from '../item/item-types'
import { useRefetch } from '../refetch/refetch-tools'
import type { RefetchRequest } from '../refetch/refetch-types'
import { useRemove } from '../remove/remove-tools'
import { RemoveRequest } from '../remove/remove-types'
import { makeState } from '../state/state-tools'
import type { GetParamsKey } from '../status/status-types'
import type { Module } from './module-types'

export const useModule = <D, P>(
    getKeys: { getDataKey: GetDataKey<D>; getParamsKey: GetParamsKey<P> },
    requests: Partial<{
        add: AddRequest<D>
        edit: EditRequest<D>
        fetch: FetchRequest<D, P>
        refetch: RefetchRequest<D, P>
        remove: RemoveRequest<D>
    }>
): Module<D, P> => {
    const state = makeState<D, P>()

    const add = useAdd(getKeys, state, requests.add)
    const edit = useEdit(getKeys, state, requests.edit)
    const fetch = useFetch(getKeys, state, requests.fetch)
    const refetch = useRefetch(getKeys, state, requests.refetch)
    const remove = useRemove(getKeys, state, requests.remove)

    return { state, groupItems, sortItems, add, edit, fetch, refetch, remove }
}
