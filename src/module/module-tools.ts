import {
    makeFetchFromParams,
    makeFetchFromPartial,
    useAddFetch,
    useGetFetch,
    useRemoveFetch,
} from '../fetch/fetch-tools'
import {
    makeItemFromData,
    makeItemFromPartial,
    sortItems,
    useAddItem,
    useGetItem,
    useRemoveItem,
} from '../item/item-tools'
import { makeState } from '../state/state-tools'
import type { Module } from './module-types'

export const makeModule = <D, P>(
    {
        getDataKey,
        getParamsKey,
    }: {
        getDataKey: (data: D) => string
        getParamsKey: (params: P) => string
    },
    requests: Partial<{
        add: (data: D) => Promise<D>
        edit: (oldData: D, newData: D) => Promise<D>
        fetch: (params: P) => Promise<Array<D>>
        refetch: (params: P) => Promise<Array<D>>
        remove: (data: D) => Promise<void>
    }>
): Module<D, P> => {
    const state = makeState<D, P>()

    const addItem = useAddItem(getDataKey)
    const getItem = useGetItem(getDataKey)
    const removeItem = useRemoveItem(getDataKey)

    const addFetch = useAddFetch(getParamsKey)
    const getFetch = useGetFetch(getParamsKey)
    const removeFetch = useRemoveFetch(getParamsKey)

    return {
        state,
        sortItems,

        add: (data) => {
            if (!requests.add) return

            state.items = addItem(
                state.items,
                makeItemFromPartial({ data, status: 'adding' })
            )

            requests
                .add(data)
                .then((newData) => {
                    state.items = addItem(
                        removeItem(
                            state.items,
                            getItem(state.items, data) || makeItemFromData(data)
                        ),
                        makeItemFromData(newData)
                    )
                })
                .catch((error) => {
                    state.items = addItem(
                        removeItem(
                            state.items,
                            getItem(state.items, data) || makeItemFromData(data)
                        ),
                        makeItemFromPartial({ data, status: Error(error) })
                    )
                })
        },

        edit: (oldData, newData) => {
            if (!requests.edit) return

            state.items = addItem(
                removeItem(
                    state.items,
                    getItem(state.items, oldData) || makeItemFromData(oldData)
                ),
                makeItemFromPartial({ data: newData, status: 'editing' })
            )

            requests
                .edit(oldData, newData)
                .then((newestData) => {
                    state.items = addItem(
                        removeItem(
                            state.items,
                            getItem(state.items, newData) ||
                                makeItemFromData(newData)
                        ),
                        makeItemFromData(newestData)
                    )
                })
                .catch((error) => {
                    state.items = addItem(
                        removeItem(
                            state.items,
                            getItem(state.items, newData) ||
                                makeItemFromData(newData)
                        ),
                        makeItemFromPartial({
                            data: newData,
                            status: Error(error),
                        })
                    )
                })
        },

        fetch: (params) => {
            if (!requests.fetch) return

            state.fetches = addFetch(
                removeFetch(
                    state.fetches,
                    getFetch(state.fetches, params) ||
                        makeFetchFromParams(params)
                ),
                makeFetchFromPartial({ params, status: 'fetching' })
            )

            requests
                .fetch(params)
                .then((datas) => {
                    state.items = datas
                        .map(makeItemFromData)
                        .reduce(addItem, state.items)

                    state.fetches = addFetch(
                        removeFetch(
                            state.fetches,
                            getFetch(state.fetches, params) ||
                                makeFetchFromParams(params)
                        ),
                        makeFetchFromPartial({ params, status: 'fetched' })
                    )
                })
                .catch((error) => {
                    state.fetches = addFetch(
                        removeFetch(
                            state.fetches,
                            getFetch(state.fetches, params) ||
                                makeFetchFromParams(params)
                        ),
                        makeFetchFromPartial({ params, status: Error(error) })
                    )
                })
        },

        refetch: (params) => {
            if (!requests.refetch) return

            state.fetches = addFetch(
                state.fetches,
                makeFetchFromPartial({ params, status: 'refetching' })
            )

            requests
                .refetch(params)
                .then((datas) => {
                    state.items = datas
                        .map(makeItemFromData)
                        .reduce(addItem, {})

                    state.fetches = addFetch(
                        removeFetch(
                            state.fetches,
                            getFetch(state.fetches, params) ||
                                makeFetchFromParams(params)
                        ),
                        makeFetchFromPartial({ params, status: 'refetched' })
                    )
                })
                .catch((error) => {
                    state.fetches = addFetch(
                        removeFetch(
                            state.fetches,
                            getFetch(state.fetches, params) ||
                                makeFetchFromParams(params)
                        ),
                        makeFetchFromPartial({ params, status: Error(error) })
                    )
                })
        },

        remove: (data) => {
            if (!requests.remove) return

            state.items = addItem(
                removeItem(
                    state.items,
                    getItem(state.items, data) || makeItemFromData(data)
                ),
                makeItemFromPartial({ data, status: 'removing' })
            )

            requests
                .remove(data)
                .then(() => {
                    state.items = removeItem(
                        state.items,
                        getItem(state.items, data) || makeItemFromData(data)
                    )
                })
                .catch((error) => {
                    state.items = addItem(
                        removeItem(
                            state.items,
                            getItem(state.items, data) || makeItemFromData(data)
                        ),
                        makeItemFromPartial({ data, status: Error(error) })
                    )
                })
        },
    }
}
