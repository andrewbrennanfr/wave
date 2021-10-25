export type ItemStatus = 'adding' | 'editing' | 'removing' | Error | null

export type Item<D> = { data: D; status: ItemStatus }

export type Items<D> = Record<string, Item<D>>

export type FetchStatus =
    | 'fetched'
    | 'fetching'
    | 'refetched'
    | 'refetching'
    | Error
    | null

export type Status = Record<string, FetchStatus>

export type State<D> = {
    items: Items<D>
    status: Status
}

export type Module<D, P> = {
    list: (comparator: (item: Item<D>) => number | string) => Array<Item<D>>
    state: State<D>

    add: (data: D) => void
    edit: (oldData: D, newData: D) => void
    fetch: (params: P) => void
    refetch: (params: P) => void
    remove: (data: D) => void
}
