import { UseState } from '../state/state-types'

export type EditAction<D, P> = (
    useState: UseState<D, P>,
    oldData: D,
    newData: D
) => void

export type EditRequest<D> = (oldData: D, newData: D) => Promise<D>
