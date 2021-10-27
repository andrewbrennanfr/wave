export type Item<D> = {
    data: D
    status: 'adding' | 'editing' | 'removing' | Error | null
}

export type Items<D> = Partial<Record<string, Item<D>>>
