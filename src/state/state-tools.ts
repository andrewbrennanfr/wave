import { State, UseState } from './state-types'
import * as R from 'ramda'

//==============================================================================

export const makeState = <D, P>(): State<D, P> => ({ items: {}, statuses: {} })

export const makeUseState = <D, P>(state: State<D, P>): UseState<D, P> => ({
    getState: R.always(state),
    setState: (newState) => {
        state.items = R.prop('items', newState)
        state.statuses = R.prop('statuses', newState)
    },
})
