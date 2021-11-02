export type RemoveAction<D> = (data: D) => void

export type RemoveRequest<D> = (data: D) => Promise<void>
