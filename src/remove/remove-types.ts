import { UseState } from '../state/state-types'

//==============================================================================

export type RemoveAction<D, P> = (useState: UseState<D, P>, data: D) => void

export type RemoveRequest<D> = (data: D) => Promise<void>
