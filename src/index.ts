import {
    addItems,
    addStatuses,
    makeItemFromData,
    makeItemFromPartial,
    makeItems,
    makeState,
    removeItems,
    sortItems,
} from './tools'
import type {
    Item as _Item,
    Items as _Items,
    Module as _Module,
    State as _State,
    Status as _Status,
} from './types'

export type Item<D> = _Item<D>
export type Items<D> = _Items<D>
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
        //----------------------------------------------------------------------

        state,
        list: (comparator) => sortItems(comparator, state.items),

        //----------------------------------------------------------------------

        add: (data) => {
            if (!requests.add) return

            state.items = addItems(
                [
                    [
                        getDataKey(data),
                        makeItemFromPartial({ data, status: 'adding' }),
                    ],
                ],
                state.items
            )

            requests
                .add(data)
                .then((newData) => {
                    state.items = addItems(
                        [[getDataKey(newData), makeItemFromData(newData)]],
                        removeItems([getDataKey(data)], state.items)
                    )
                })
                .catch((error) => {
                    state.items = addItems(
                        [
                            [
                                getDataKey(data),
                                makeItemFromPartial({
                                    data,
                                    status: Error(error),
                                }),
                            ],
                        ],
                        removeItems([getDataKey(data)], state.items)
                    )
                })
        },

        //----------------------------------------------------------------------

        edit: (oldData, newData) => {
            if (!requests.edit) return

            state.items = addItems(
                [
                    [
                        getDataKey(newData),
                        makeItemFromPartial({
                            data: newData,
                            status: 'editing',
                        }),
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
                                makeItemFromData(newestData),
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
                                makeItemFromPartial({
                                    data: newData,
                                    status: Error(error),
                                }),
                            ],
                        ],
                        removeItems([getDataKey(newData)], state.items)
                    )
                })
        },

        //----------------------------------------------------------------------

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

        //----------------------------------------------------------------------

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

        //----------------------------------------------------------------------

        remove: (data) => {
            if (!requests.remove) return

            state.items = addItems(
                [
                    [
                        getDataKey(data),
                        makeItemFromPartial({ data, status: 'removing' }),
                    ],
                ],
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
                                makeItemFromPartial({
                                    data,
                                    status: Error(error),
                                }),
                            ],
                        ],
                        removeItems([getDataKey(data)], state.items)
                    )
                })
        },

        //----------------------------------------------------------------------
    }
}
