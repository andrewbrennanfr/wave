import {
    makeItemFromPartial,
    useAddItem,
    useGetItem,
    useRemoveItem,
} from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { State } from '../state/state-types'
import { RemoveAction, RemoveRequest } from './remove-types'

export const useRemove =
    <D, P>(
        getKeys: { getDataKey: GetDataKey<D> },
        state: State<D, P>,
        request?: RemoveRequest<D>
    ): RemoveAction<D> =>
    (data) => {
        if (!request) return

        const addItem = useAddItem(getKeys)
        const getItem = useGetItem(getKeys)
        const removeItem = useRemoveItem(getKeys)

        state.items = addItem(
            makeItemFromPartial({ data, status: 'removing' }),
            state.items
        )

        request(data)
            .then(() => {
                state.items = removeItem(
                    getItem(data, state.items),
                    state.items
                )
            })
            .catch((error: any) => {
                state.items = addItem(
                    makeItemFromPartial({ data, status: Error(error) }),
                    state.items
                )
            })
    }
