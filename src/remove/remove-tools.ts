import {
    makeAddItem,
    makeItemFromPartial,
    makeRemoveItem,
} from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { RemoveAction, RemoveRequest } from './remove-types'

//==============================================================================

export const makeRemove =
    <D, P>(
        { getState, setState }: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: RemoveRequest<D>
    ): RemoveAction<D> =>
    (data) => {
        const addItem = makeAddItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const item = makeItemFromPartial({ data, status: 'removing' })

        setState({ items: addItem(item, getState().items) })

        request(data)
            .then(() => {
                setState({ items: removeItem(item, getState().items) })
            })
            .catch((error: any) => {
                setState({
                    items: addItem(
                        makeItemFromPartial({ data, status: Error(error) }),
                        getState().items
                    ),
                })
            })
    }
