import { makeItemFromData, useItem } from '../item/item-tools'
import type { GetDataKey } from '../item/item-types'
import type { RefetchAction, RefetchRequest } from '../refetch/refetch-types'
import type { State } from '../state/state-types'
import { makeStatusFromPartial, useStatus } from '../status/status-tools'
import type { GetParamsKey } from '../status/status-types'

export const useFetch =
    <D, P>(
        {
            getDataKey,
            getParamsKey,
        }: { getDataKey: GetDataKey<D>; getParamsKey: GetParamsKey<P> },
        state: State<D, P>,
        request?: RefetchRequest<D, P>
    ): RefetchAction<P> =>
    async (params) => {
        if (!request) return

        const { addItem } = useItem({ getDataKey })
        const { addStatus } = useStatus({ getParamsKey })

        state.statuses = addStatus(
            state.statuses,
            makeStatusFromPartial({ params, status: 'fetching' })
        )

        try {
            const datas = await request(params)

            state.items = datas
                .map(makeItemFromData)
                .reduce(addItem, state.items)

            state.statuses = addStatus(
                state.statuses,
                makeStatusFromPartial({ params, status: 'fetched' })
            )
        } catch (error: any) {
            state.statuses = addStatus(
                state.statuses,
                makeStatusFromPartial({ params, status: Error(error) })
            )
        }
    }
