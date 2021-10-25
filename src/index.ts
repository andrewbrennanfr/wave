import {
    addItems,
    addStatuses,
    makeItem,
    makeItems,
    makeState,
    removeItems,
    sortItems,
} from './tools'
import {
    FetchStatus as _FetchStatus,
    Item as _Item,
    Items as _Items,
    ItemStatus as _ItemStatus,
    Module as _Module,
    State as _State,
    Status as _Status,
} from './types'

export type FetchStatus = _FetchStatus
export type Item<D> = _Item<D>
export type Items<D> = _Items<D>
export type ItemStatus = _ItemStatus
export type Module<D, P> = _Module<D, P>
export type State<D> = _State<D>
export type Status = _Status

export default <D, P>(
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
    }> = {}
): Module<D, P> => {
    const state = makeState<D>()

    return {
        add: (data) => {
            if (!requests.add) return

            state.items = addItems(
                [[getDataKey(data), makeItem({ data, status: 'adding' })]],
                state.items
            )

            requests
                .add(data)
                .then((newData) => {
                    state.items = addItems(
                        [[getDataKey(newData), makeItem({ data: newData })]],
                        removeItems([getDataKey(data)], state.items)
                    )
                })
                .catch((error) => {
                    state.items = addItems(
                        [
                            [
                                getDataKey(data),
                                makeItem({ data, status: Error(error) }),
                            ],
                        ],
                        removeItems([getDataKey(data)], state.items)
                    )
                })
        },
        edit: (oldData, newData) => {
            if (!requests.edit) return

            state.items = addItems(
                [
                    [
                        getDataKey(newData),
                        makeItem({ data: newData, status: 'editing' }),
                    ],
                ],
                removeItems([getDataKey(oldData)], state.items)
            )

            requests
                .edit(oldData, newData)
                .then((newestData) => {
                    state.items = addItems(
                        [
                            [
                                getDataKey(newestData),
                                makeItem({ data: newestData }),
                            ],
                        ],
                        removeItems([getDataKey(newData)], state.items)
                    )
                })
                .catch((error) => {
                    state.items = addItems(
                        [
                            [
                                getDataKey(newData),
                                makeItem({
                                    data: newData,
                                    status: Error(error),
                                }),
                            ],
                        ],
                        removeItems([getDataKey(newData)], state.items)
                    )
                })
        },
        fetch: (params) => {
            if (!requests.fetch) return

            state.status = addStatuses(
                [[getParamsKey(params), 'fetching']],
                state.status
            )

            requests
                .fetch(params)
                .then((datas) => {
                    state.items = addItems(
                        Object.entries(makeItems(getDataKey, datas)),
                        state.items
                    )

                    state.status = addStatuses(
                        [[getParamsKey(params), 'fetched']],
                        state.status
                    )
                })
                .catch((error) => {
                    state.status = addStatuses(
                        [[getParamsKey(params), Error(error)]],
                        state.status
                    )
                })
        },
        refetch: (params) => {
            if (!requests.refetch) return

            state.status = addStatuses(
                [[getParamsKey(params), 'refetching']],
                state.status
            )

            requests
                .refetch(params)
                .then((datas) => {
                    state.items = makeItems(getDataKey, datas)

                    state.status = addStatuses(
                        [[getParamsKey(params), 'refetched']],
                        state.status
                    )
                })
                .catch((error) => {
                    state.status = addStatuses(
                        [[getParamsKey(params), Error(error)]],
                        state.status
                    )
                })
        },
        remove: (data) => {
            if (!requests.remove) return

            state.items = addItems(
                [[getDataKey(data), makeItem({ data, status: 'removing' })]],
                removeItems([getDataKey(data)], state.items)
            )

            requests
                .remove(data)
                .then(() => {
                    state.items = removeItems([getDataKey(data)], state.items)
                })
                .catch((error) => {
                    state.items = addItems(
                        [
                            [
                                getDataKey(data),
                                makeItem({ data, status: Error(error) }),
                            ],
                        ],
                        removeItems([getDataKey(data)], state.items)
                    )
                })
        },

        list: (comparator) => sortItems(comparator, state.items),
        state,
    }
}
