import {
    makeItemFromData,
    makeItemFromPartial,
    useAddItem,
    useGetItem,
    useRemoveItem,
} from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { State } from '../state/state-types'
import { EditAction, EditRequest } from './edit-types'

export const useEdit =
    <D, P>(
        getKeys: { getDataKey: GetDataKey<D> },
        state: State<D, P>,
        request?: EditRequest<D>
    ): EditAction<D> =>
    (oldData: D, newData: D) => {
        if (!request) return

        const addItem = useAddItem(getKeys)
        const getItem = useGetItem(getKeys)
        const removeItem = useRemoveItem(getKeys)

        state.items = addItem(
            makeItemFromPartial({ data: newData, status: 'editing' }),
            removeItem(getItem(oldData, state.items), state.items)
        )

        request(oldData, newData)
            .then((newestData) => {
                state.items = addItem(
                    makeItemFromData(newestData),
                    removeItem(getItem(newData, state.items), state.items)
                )
            })
            .catch((error: any) => {
                state.items = addItem(
                    makeItemFromPartial({
                        data: newData,
                        status: Error(error),
                    }),
                    state.items
                )
            })
    }
