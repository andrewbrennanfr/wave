export type AddAction<D> = (data: D) => void

export type AddRequest<D> = (data: D) => Promise<D>
