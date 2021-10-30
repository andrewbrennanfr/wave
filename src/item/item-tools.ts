import { GetDataKey, ImpartialItems, Item, Items } from './item-types'
import * as R from 'ramda'

//==============================================================================

export const makeItemFromData = <D>(data: D): Item<D> => ({
    data,
    status: null,
})

export const makeItemFromPartial = <D>(
    partial: Pick<Item<D>, 'data'> & Partial<Omit<Item<D>, 'data'>>
): Item<D> =>
    R.mergeRight(
        makeItemFromData(R.prop('data', partial)),
        R.omit(['data'], partial)
    )

//==============================================================================

export const filterItems = <D>(items: Items<D>): ImpartialItems<D> =>
    R.filter(Boolean, items) as ImpartialItems<D>

export const groupItems = <D>(
    fn: (item: Item<D>) => string,
    items: Items<D>
): Partial<Record<ReturnType<typeof fn>, Items<D>>> =>
    R.map(
        R.fromPairs,
        R.groupBy(R.pipe(R.last, fn), R.toPairs(filterItems(items)))
    )

export const sortItems = <D>(
    fn: (item: Item<D>) => number | string,
    items: Items<D>
): Array<Item<D>> => R.sortBy(fn, R.values(filterItems(items)))

//==============================================================================

export const makeAddItem =
    <D>(getKeys: {
        getDataKey: GetDataKey<D>
    }): ((item: Item<D>, items: Items<D>) => Items<D>) =>
    (item, items) =>
        R.assoc(
            R.prop('getDataKey', getKeys)(R.prop('data', item)),
            item,
            items
        )

export const makeGetItem =
    <D>(getKeys: {
        getDataKey: GetDataKey<D>
    }): ((data: D, items: Items<D>) => Item<D> | undefined) =>
    (data, items) =>
        R.prop(R.prop('getDataKey', getKeys)(data), items)

export const makeRemoveItem =
    <D>(getKeys: {
        getDataKey: GetDataKey<D>
    }): ((item: Item<D>, items: Items<D>) => Items<D>) =>
    (item, items) =>
        R.reject(
            R.pipe(
                R.prop('data'),
                R.prop('getDataKey', getKeys),
                R.equals(R.prop('getDataKey', getKeys)(R.prop('data', item)))
            ),
            filterItems(items)
        )
