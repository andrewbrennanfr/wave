import { makeItemFromData, useAddItem } from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { RefetchAction, RefetchRequest } from '../refetch/refetch-types'
import { State } from '../state/state-types'
import { makeStatusFromPartial, useAddStatus } from '../status/status-tools'
import { GetParamsKey } from '../status/status-types'
import { map, reduceRight } from 'ramda'

export const useFetch =
    <D, P>(
        getKeys: { getDataKey: GetDataKey<D>; getParamsKey: GetParamsKey<P> },
        state: State<D, P>,
        request?: RefetchRequest<D, P>
    ): RefetchAction<P> =>
    (params) => {
        if (!request) return

        const addItem = useAddItem(getKeys)
        const addStatus = useAddStatus(getKeys)

        state.statuses = addStatus(
            makeStatusFromPartial({ params, status: 'fetching' }),
            state.statuses
        )

        request(params)
            .then((datas) => {
                state.items = reduceRight(
                    addItem,
                    state.items,
                    map(makeItemFromData, datas)
                )

                state.statuses = addStatus(
                    makeStatusFromPartial({ params, status: 'fetched' }),
                    state.statuses
                )
            })
            .catch((error: any) => {
                state.statuses = addStatus(
                    makeStatusFromPartial({ params, status: Error(error) }),
                    state.statuses
                )
            })
    }
