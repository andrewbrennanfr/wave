import { UseState } from '../state/state-types'

export type RefetchAction<D, P> = (useState: UseState<D, P>, params: P) => void

export type RefetchRequest<D, P> = (params: P) => Promise<Array<D>>
