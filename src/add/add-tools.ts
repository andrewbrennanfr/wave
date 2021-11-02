import {
    makeAddItem,
    makeItemFromData,
    makeItemFromPartial,
    makeRemoveItem,
} from '../item/item-tools'
import { GetKeys } from '../module/module-types'
import { UseState } from '../state/state-types'
import { AddAction, AddRequest } from './add-types'
import * as R from 'ramda'

//==============================================================================

export const makeAdd =
    <D, P>(
        useState: UseState<D, P>,
        getKeys: GetKeys<D, P>,
        request: AddRequest<D>
    ): AddAction<D> =>
    (data) => {
        const addItem = makeAddItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        const item = makeItemFromPartial({ data, status: 'adding' })

        setState(
            R.assoc(
                'items',
                addItem(item, R.prop('items', getState())),
                getState()
            )
        )

        request(data)
            .then((newData) => {
                setState(
                    R.assoc(
                        'items',
                        addItem(
                            makeItemFromData(newData),
                            removeItem(item, R.prop('items', getState()))
                        ),
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
