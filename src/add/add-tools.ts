import {
    makeItemFromData,
    makeItemFromPartial,
    useAddItem,
    useGetItem,
    useRemoveItem,
} from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { State } from '../state/state-types'
import { AddAction, AddRequest } from './add-types'

export const useAdd =
    <D, P>(
        getKeys: { getDataKey: GetDataKey<D> },
        state: State<D, P>,
        request?: AddRequest<D>
    ): AddAction<D> =>
    (data) => {
        if (!request) return

        const addItem = useAddItem(getKeys)
        const getItem = useGetItem(getKeys)
        const removeItem = useRemoveItem(getKeys)

        state.items = addItem(
            makeItemFromPartial({ data, status: 'adding' }),
            state.items
        )

        request(data)
            .then((newData) => {
                state.items = addItem(
                    makeItemFromData(newData),
                    removeItem(getItem(data, state.items), state.items)
                )
            })
            .catch((error: any) => {
                state.items = addItem(
                    makeItemFromPartial({ data, status: Error(error) }),
                    state.items
                )
            })
    }
