import { makeItemFromData, useAddItem } from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { State } from '../state/state-types'
import { makeStatusFromPartial, useAddStatus } from '../status/status-tools'
import { GetParamsKey } from '../status/status-types'
import { RefetchAction, RefetchRequest } from './refetch-types'
import { map, reduceRight } from 'ramda'

export const useRefetch =
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
            makeStatusFromPartial({ params, status: 'refetching' }),
            state.statuses
        )

        request(params)
            .then((datas) => {
                state.items = reduceRight(
                    addItem,
                    {},
                    map(makeItemFromData, datas)
                )

                state.statuses = addStatus(
                    makeStatusFromPartial({ params, status: 'refetched' }),
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
