import { filterItems } from '../item/item-tools'
import { ClearAction } from './clear-types'
import * as R from 'ramda'

//==============================================================================

export const makeClear =
    <D, P>(): ClearAction<D, P> =>
    (useState, fn) => {
        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        setTimeout(() => {
            setState(
                R.assoc(
                    'items',
                    R.reject(fn, filterItems(R.prop('items', getState()))),
                    getState()
                )
            )
        })
    }
