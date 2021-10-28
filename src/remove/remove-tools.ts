import { makeItemFromPartial, useItem } from '../item/item-tools'
import type { GetDataKey } from '../item/item-types'
import type { State } from '../state/state-types'
import type { RemoveAction, RemoveRequest } from './remove-types'

export const useRemove =
    <D, P>(
        { getDataKey }: { getDataKey: GetDataKey<D> },
        state: State<D, P>,
        request?: RemoveRequest<D>
    ): RemoveAction<D> =>
    async (data) => {
        if (!request) return

        const { addItem, getItem, removeItem } = useItem({ getDataKey })

        state.items = addItem(
            state.items,
            makeItemFromPartial({ data, status: 'removing' })
        )

        try {
            await request(data)

            state.items = removeItem(state.items, getItem(state.items, data))
        } catch (error: any) {
            state.items = addItem(
                state.items,
                makeItemFromPartial({ data, status: Error(error) })
            )
        }
    }
