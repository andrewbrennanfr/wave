import { UseState } from '../state/state-types'

//==============================================================================

export type AddAction<D, P> = (useState: UseState<D, P>, data: D) => void

export type AddRequest<D> = (data: D) => Promise<D>
