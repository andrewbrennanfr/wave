import {
    makeItemFromData,
    makeItemFromPartial,
    makeAddItem,
    makeGetItem,
    makeRemoveItem,
} from '../item/item-tools'
import { GetDataKey } from '../item/item-types'
import { EditAction, EditRequest } from './edit-types'
import * as R from 'ramda'

export const makeEdit =
    <D, P>(
        getKeys: { getDataKey: GetDataKey<D> },
        request: EditRequest<D>
    ): EditAction<D, P> =>
    (useState, oldData, newData) => {
        const addItem = makeAddItem(getKeys)
        const getItem = makeGetItem(getKeys)
        const removeItem = makeRemoveItem(getKeys)

        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        const oldItem = getItem(oldData, R.prop('items', getState()))
        const newItem = makeItemFromPartial({
            data: newData,
            status: 'editing',
        })

        setState(
            R.assoc(
                'items',
                addItem(
                    newItem,
                    oldItem
                        ? removeItem(oldItem, R.prop('items', getState()))
                        : R.prop('items', getState())
                ),
                getState()
            )
        )

        request(oldData, newData)
            .then((newestData) => {
                setState(
                    R.assoc(
                        'items',
                        addItem(
                            makeItemFromData(newestData),
                            removeItem(newItem, R.prop('items', getState()))
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
                            makeItemFromPartial({
                                data: newData,
                                status: Error(error),
                            }),
                            R.prop('items', getState())
                        ),
                        getState()
                    )
                )
            })
    }
