import {
    makeAddItem,
    makeGetItem,
    makeItemFromData,
    makeItemFromPartial,
    makeRemoveItem,
} from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { EditAction, EditRequest } from './edit-types'

//==============================================================================

export const makeEdit =
    <D, P>(
        { getState, setState }: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: EditRequest<D>
    ): EditAction<D> =>
    (oldData, newData) => {
        const addItem = makeAddItem(getKeys)
        const getItem = makeGetItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const oldItem =
            getItem(oldData, getState().items) || makeItemFromData(oldData)

        const newItem = makeItemFromPartial({
            data: newData,
            status: 'editing',
        })

        setState({
            items: addItem(newItem, removeItem(oldItem, getState().items)),
        })

        request(oldData, newData)
            .then((newestData) => {
                setState({
                    items: addItem(
                        makeItemFromData(newestData),
                        removeItem(newItem, getState().items)
                    ),
                })
            })
            .catch((error: any) => {
                setState({
                    items: addItem(
                        makeItemFromPartial({
                            data: newData,
                            status: Error(error),
                        }),
                        removeItem(newItem, getState().items)
                    ),
                })
            })
    }
