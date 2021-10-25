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
