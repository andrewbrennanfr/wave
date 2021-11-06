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
    (oldData, data) => {
        const addItem = makeAddItem(getKeys)
        const getItem = makeGetItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const oldItem =
            getItem(oldData, getState().items) || makeItemFromData(oldData)

        const item = makeItemFromPartial({ data, status: 'editing' })

        setState({
            items: addItem(item, removeItem(oldItem, getState().items)),
        })

        request(oldData, data)
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
