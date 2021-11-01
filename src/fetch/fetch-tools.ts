import { FetchAction, FetchRequest } from '../fetch/fetch-types'
import { makeItemFromData, makeAddItem } from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { makeStatusFromPartial, makeAddStatus } from '../status/status-tools'
import * as R from 'ramda'

//==============================================================================

export const makeFetch =
    <D, P>(
        getKeys: GetKeys<D, P>,
        request: FetchRequest<D, P>
    ): FetchAction<D, P> =>
    (useState, params) => {
        const addItem = makeAddItem(getKeys)
        const addStatus = makeAddStatus(getKeys)

        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        setState(
            R.assoc(
                'statuses',
                addStatus(
                    makeStatusFromPartial({ params, status: 'fetching' }),
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
                            R.prop('items', getState()),
                            R.map(makeItemFromData, datas)
                        ),
                        statuses: addStatus(
                            makeStatusFromPartial({
                                params,
                                status: 'fetched',
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
