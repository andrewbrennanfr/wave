import { makeItemFromData, useItem } from '../item/item-tools'
import type { GetDataKey } from '../item/item-types'
import type { State } from '../state/state-types'
import { makeStatusFromPartial, useStatus } from '../status/status-tools'
import type { GetParamsKey } from '../status/status-types'
import type { RefetchAction, RefetchRequest } from './refetch-types'

export const useRefetch =
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
            makeStatusFromPartial({ params, status: 'refetching' })
        )

        try {
            const datas = await request(params)

            state.items = datas.map(makeItemFromData).reduce(addItem, {})

            state.statuses = addStatus(
                state.statuses,
                makeStatusFromPartial({ params, status: 'refetched' })
            )
        } catch (error: any) {
            state.statuses = addStatus(
                state.statuses,
                makeStatusFromPartial({ params, status: Error(error) })
            )
        }
    }
