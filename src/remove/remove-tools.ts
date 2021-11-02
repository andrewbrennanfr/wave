import {
    makeAddItem,
    makeItemFromPartial,
    makeRemoveItem,
} from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { RemoveAction, RemoveRequest } from './remove-types'
import * as R from 'ramda'

//==============================================================================

export const makeRemove =
    <D, P>(
        useState: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: RemoveRequest<D>
    ): RemoveAction<D> =>
    (data) => {
        const addItem = makeAddItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        const item = makeItemFromPartial({ data, status: 'removing' })

        setState(
            R.assoc(
                'items',
                addItem(item, R.prop('items', getState())),
                getState()
            )
        )

        request(data)
            .then(() => {
                setState(
                    R.assoc(
                        'items',
                        removeItem(item, R.prop('items', getState())),
                        getState()
                    )
                )
            })
            .catch((error: any) => {
                setState(
                    R.assoc(
                        'items',
                        addItem(
                            makeItemFromPartial({ data, status: Error(error) }),
                            R.prop('items', getState())
                        ),
                        getState()
                    )
                )
            })
    }
