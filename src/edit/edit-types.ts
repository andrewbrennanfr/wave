export type EditAction<D> = (oldData: D, data: D) => void

export type EditRequest<D> = (oldData: D, data: D) => Promise<D>
