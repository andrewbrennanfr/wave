export type Item<D> = {
    data: D
    status: 'adding' | 'editing' | 'removing' | Error | null
}

export type State<D> = {
    items: Record<string, Item<D>>
    status: Record<
        string,
        'fetched' | 'fetching' | 'refetched' | 'refetching' | Error | null
    >
}

export type Module<D, P> = {
    add: (data: D) => void
    edit: (oldData: D, newData: D) => void
    fetch: (params: P) => void
    refetch: (params: P) => void
    remove: (data: D) => void

    getItemsGroupedBy: (
        fn: (item: Item<D>) => string
    ) => Record<string, Array<Item<D>>>

    getItemsSortedBy: (fn: (item: Item<D>) => number | string) => Array<Item<D>>

    state: State<D>
}

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
        remove: (data: D) => Promise<D>
    }>
): Module<D, P> => {
    const state: State<D> = { items: {}, status: {} }

    const addItems = (
        items: State<D>['items'],
        entries: Array<[string, Item<D>]>
    ): State<D>['items'] => ({ ...items, ...Object.fromEntries(entries) })

    const removeItems = (
        items: State<D>['items'],
        keys: Array<string>
    ): State<D>['items'] =>
        Object.fromEntries(
            Object.entries(items).filter(([key]) => !keys.includes(key))
        )

    const addStatus = (
        status: State<D>['status'],
        paramsKey: string,
        value: State<D>['status'][string]
    ): State<D>['status'] => ({ ...status, [paramsKey]: value })

    const makeItem = (
        partial: Partial<Item<D>> & Pick<Item<D>, 'data'>
    ): Item<D> => ({ status: null, ...partial })

    const makeItems = (datas: Array<D>): State<D>['items'] =>
        Object.fromEntries(
            datas.map((data) => [getDataKey(data), makeItem({ data })])
        )

    return {
        add: (data) => {
            if (requests.add) {
                state.items = addItems(state.items, [
                    [getDataKey(data), makeItem({ data, status: 'adding' })],
                ])

                requests
                    .add(data)
                    .then((newData) => {
                        state.items = addItems(
                            removeItems(state.items, [getDataKey(data)]),
                            [[getDataKey(newData), makeItem({ data: newData })]]
                        )
                    })
                    .catch((error) => {
                        state.items = addItems(
                            removeItems(state.items, [getDataKey(data)]),
                            [
                                [
                                    getDataKey(data),
                                    makeItem({ data, status: Error(error) }),
                                ],
                            ]
                        )
                    })
            }
        },
        edit: (oldData, newData) => {
            if (requests.edit) {
                state.items = addItems(
                    removeItems(state.items, [getDataKey(oldData)]),
                    [
                        [
                            getDataKey(newData),
                            makeItem({ data: newData, status: 'editing' }),
                        ],
                    ]
                )

                requests
                    .edit(oldData, newData)
                    .then((newestData) => {
                        state.items = addItems(
                            removeItems(state.items, [getDataKey(newData)]),
                            [
                                [
                                    getDataKey(newestData),
                                    makeItem({ data: newestData }),
                                ],
                            ]
                        )
                    })
                    .catch((error) => {
                        state.items = addItems(
                            removeItems(state.items, [getDataKey(newData)]),
                            [
                                [
                                    getDataKey(newData),
                                    makeItem({
                                        data: newData,
                                        status: Error(error),
                                    }),
                                ],
                            ]
                        )
                    })
            }
        },
        fetch: (params) => {
            if (requests.fetch) {
                state.status = addStatus(
                    state.status,
                    getParamsKey(params),
                    'fetching'
                )

                requests
                    .fetch(params)
                    .then((datas) => {
                        state.items = addItems(
                            state.items,
                            Object.entries(makeItems(datas))
                        )

                        state.status = addStatus(
                            state.status,
                            getParamsKey(params),
                            'fetched'
                        )
                    })
                    .catch((error) => {
                        state.status = addStatus(
                            state.status,
                            getParamsKey(params),
                            Error(error)
                        )
                    })
            }
        },
        refetch: (params) => {
            if (requests.refetch) {
                state.status = addStatus(
                    state.status,
                    getParamsKey(params),
                    'fetching'
                )

                requests
                    .refetch(params)
                    .then((datas) => {
                        state.items = makeItems(datas)

                        state.status = addStatus(
                            state.status,
                            getParamsKey(params),
                            'refetched'
                        )
                    })
                    .catch((error) => {
                        state.status = addStatus(
                            state.status,
                            getParamsKey(params),
                            Error(error)
                        )
                    })
            }
        },
        remove: (data) => {
            if (requests.remove) {
                state.items = addItems(
                    removeItems(state.items, [getDataKey(data)]),
                    [[getDataKey(data), makeItem({ data, status: 'removing' })]]
                )

                requests
                    .remove(data)
                    .then(() => {
                        state.items = removeItems(state.items, [
                            getDataKey(data),
                        ])
                    })
                    .catch((error) => {
                        state.items = addItems(
                            removeItems(state.items, [getDataKey(data)]),
                            [
                                [
                                    getDataKey(data),
                                    makeItem({ data, status: Error(error) }),
                                ],
                            ]
                        )
                    })
            }
        },

        getItemsGroupedBy: (fn) =>
            Object.values(state.items).reduce<Record<string, Array<Item<D>>>>(
                (groupedBy, item) => ({
                    ...groupedBy,
                    [fn(item)]: [...(groupedBy[fn(item)] || []), item],
                }),
                {}
            ),

        getItemsSortedBy: (fn) =>
            Object.values(state.items).sort((itemA, itemB) =>
                fn(itemA) > fn(itemB) ? 1 : fn(itemA) > fn(itemB) ? -1 : 0
            ),

        state,
    }
}
