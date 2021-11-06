import { makeItemFromData, makeAddItem } from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { makeStatusFromPartial, makeAddStatus } from '../status/status-tools'
import { RefetchAction, RefetchRequest } from './refetch-types'
import { map, reduceRight } from 'ramda'

//==============================================================================

export const makeRefetch =
    <D, P>(
        { getState, setState }: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: RefetchRequest<D, P>
    ): RefetchAction<P> =>
    (params) => {
        const addItem = makeAddItem(getKeys)
        const addStatus = makeAddStatus(getKeys)

        setState({
            statuses: addStatus(
                makeStatusFromPartial({ params, status: 'refetching' }),
                getState().statuses
            ),
        })

        request(params)
            .then((datas) => {
                setState({
                    items: reduceRight(
                        addItem,
                        {},
                        map(makeItemFromData, datas)
                    ),
                    statuses: addStatus(
                        makeStatusFromPartial({ params, status: 'refetched' }),
                        getState().statuses
                    ),
                })
            })
            .catch((error: any) => {
                setState({
                    statuses: addStatus(
                        makeStatusFromPartial({ params, status: Error(error) }),
                        getState().statuses
                    ),
                })
            })
    }
