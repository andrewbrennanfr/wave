import { UseState } from '../state/state-types'

export type FetchAction<D, P> = (useState: UseState<D, P>, params: P) => void

export type FetchRequest<D, P> = (params: P) => Promise<Array<D>>
