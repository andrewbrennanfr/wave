export type Item<D> = {
    data: D
    status: 'adding' | 'editing' | 'removing' | Error | null
}

export type PartialItem<D> = Pick<Item<D>, 'data'> &
    Partial<Omit<Item<D>, 'data'>>

export type GetDataKey<D> = (data: D) => string

export type Items<D> = Record<ReturnType<GetDataKey<D>>, Item<D>>

export type PublicItems<D> = Partial<Items<D>>
