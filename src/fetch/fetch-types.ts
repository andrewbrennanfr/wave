export type FetchAction<P> = (params: P) => void

export type FetchRequest<D, P> = (params: P) => Promise<Array<D>>
