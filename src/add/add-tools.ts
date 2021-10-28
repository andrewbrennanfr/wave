import {
    makeItemFromData,
    makeItemFromPartial,
    useItem,
} from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { State } from '../state/state-types'
import { AddAction, AddRequest } from './add-types'

export const useAdd =
    <D, P>(
        { getDataKey }: { getDataKey: GetDataKey<D> },
        state: State<D, P>,
        request?: AddRequest<D>
    ): AddAction<D> =>
    async (data) => {
        if (!request) return

        const { addItem, getItem, removeItem } = useItem({ getDataKey })

        state.items = addItem(
            state.items,
            makeItemFromPartial({ data, status: 'adding' })
        )

        try {
            const newData = await request(data)

            state.items = addItem(
                removeItem(state.items, getItem(state.items, data)),
                makeItemFromData(newData)
            )
        } catch (error: any) {
            state.items = addItem(
                state.items,
                makeItemFromPartial({ data, status: Error(error) })
            )
        }
    }
