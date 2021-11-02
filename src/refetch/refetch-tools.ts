import { makeItemFromData, makeAddItem } from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { makeStatusFromPartial, makeAddStatus } from '../status/status-tools'
import { RefetchAction, RefetchRequest } from './refetch-types'
import * as R from 'ramda'

//==============================================================================

export const makeRefetch =
    <D, P>(
        useState: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: RefetchRequest<D, P>
    ): RefetchAction<P> =>
    (params) => {
        const addItem = makeAddItem(getKeys)
        const addStatus = makeAddStatus(getKeys)

        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        setState(
            R.assoc(
                'statuses',
                addStatus(
                    makeStatusFromPartial({ params, status: 'refetching' }),
                    R.prop('statuses', getState())
                ),
                getState()
            )
        )

        request(params)
            .then((datas) => {
                setState(
                    R.mergeRight(getState(), {
                        items: R.reduceRight(
                            addItem,
                            {},
                            R.map(makeItemFromData, datas)
                        ),
                        statuses: addStatus(
                            makeStatusFromPartial({
                                params,
                                status: 'refetched',
                            }),
                            R.prop('statuses', getState())
                        ),
                    })
                )
            })
            .catch((error: any) => {
                setState(
                    R.assoc(
                        'statuses',
                        addStatus(
                            makeStatusFromPartial({
                                params,
                                status: Error(error),
                            }),
                            R.prop('statuses', getState())
                        ),
                        getState()
                    )
                )
            })
    }
