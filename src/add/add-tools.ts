import {
    makeAddItem,
    makeItemFromData,
    makeItemFromPartial,
    makeRemoveItem,
} from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { AddAction, AddRequest } from './add-types'

//==============================================================================

export const makeAdd =
    <D, P>(
        { getState, setState }: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: AddRequest<D>
    ): AddAction<D> =>
    (data) => {
        const addItem = makeAddItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const item = makeItemFromPartial({ data, status: 'adding' })

        setState({ items: addItem(item, getState().items) })

        request(data)
            .then((newData) => {
                setState({
                    items: addItem(
                        makeItemFromData(newData),
                        removeItem(item, getState().items)
                    ),
                })
            })
            .catch((error: any) => {
                setState({
                    items: addItem(
                        makeItemFromPartial({ data, status: Error(error) }),
                        removeItem(item, getState().items)
                    ),
                })
            })
    }
