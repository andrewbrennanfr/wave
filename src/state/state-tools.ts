import { State } from './state-types'

//==============================================================================

export const makeState = <D, P>(): State<D, P> => ({ items: {}, statuses: {} })
