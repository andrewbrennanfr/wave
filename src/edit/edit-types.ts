export type EditAction<D> = (oldData: D, newData: D) => void

export type EditRequest<D> = (oldData: D, newData: D) => Promise<D>
