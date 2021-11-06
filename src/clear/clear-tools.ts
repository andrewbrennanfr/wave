import { filterItems } from '../item/item-tools'
import { UseState } from '../state/state-types'
import { ClearAction } from './clear-types'
import { reject } from 'ramda'

export const makeClear =
    <D, P>({ getState, setState }: UseState<D, P>): ClearAction<D> =>
    (fn) => {
        setState({ items: reject(fn, filterItems(getState().items)) })
    }
