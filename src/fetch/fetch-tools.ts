import { FetchAction, FetchRequest } from '../fetch/fetch-types'
import { makeItemFromData, makeAddItem } from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { makeStatusFromPartial, makeAddStatus } from '../status/status-tools'
import { map, reduceRight } from 'ramda'

export const makeFetch =
    <D, P>(
        { getState, setState }: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: FetchRequest<D, P>
    ): FetchAction<P> =>
    (params) => {
        const addItem = makeAddItem(getKeys)
        const addStatus = makeAddStatus(getKeys)

        setState({
            statuses: addStatus(
                makeStatusFromPartial({ params, status: 'fetching' }),
                getState().statuses
            ),
        })

        request(params)
            .then((datas) => {
                setState({
                    items: reduceRight(
                        addItem,
                        getState().items,
                        map(makeItemFromData, datas)
                    ),
                    statuses: addStatus(
                        makeStatusFromPartial({ params, status: 'fetched' }),
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
