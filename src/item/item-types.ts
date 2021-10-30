export type Item<D> = {
    data: D
    status: 'adding' | 'editing' | 'removing' | Error | null
}

export type GetDataKey<D> = (data: D) => string

export type Items<D> = Partial<Record<ReturnType<GetDataKey<D>>, Item<D>>>
