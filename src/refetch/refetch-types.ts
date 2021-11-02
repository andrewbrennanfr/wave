export type RefetchAction<P> = (params: P) => void

export type RefetchRequest<D, P> = (params: P) => Promise<Array<D>>
