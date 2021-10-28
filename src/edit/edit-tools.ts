import {
    makeItemFromData,
    makeItemFromPartial,
    useItem,
} from '../item/item-tools'
import type { GetDataKey } from '../item/item-types'
import type { State } from '../state/state-types'
import type { EditAction, EditRequest } from './edit-types'

export const useEdit =
    <D, P>(
        { getDataKey }: { getDataKey: GetDataKey<D> },
        state: State<D, P>,
        request?: EditRequest<D>
    ): EditAction<D> =>
    async (oldData: D, newData: D) => {
        if (!request) return

        const { addItem, getItem, removeItem } = useItem({ getDataKey })

        state.items = addItem(
            removeItem(state.items, getItem(state.items, oldData)),
            makeItemFromPartial({ data: newData, status: 'editing' })
        )

        try {
            const newestData = await request(oldData, newData)

            state.items = addItem(
                removeItem(state.items, getItem(state.items, newData)),
                makeItemFromData(newestData)
            )
        } catch (error: any) {
            state.items = addItem(
                state.items,
                makeItemFromPartial({ data: newData, status: Error(error) })
            )
        }
    }
