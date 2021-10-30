import { GetDataKey, Item, Items, PartialItem, PublicItems } from './item-types'
import {
    assoc,
    equals,
    fromPairs,
    groupBy,
    last,
    map,
    mergeRight,
    omit,
    pipe,
    prop,
    reject,
    sortBy,
    toPairs,
    values,
} from 'ramda'

export const coerceToItems = <D>(items: PublicItems<D>): Items<D> =>
    items as Items<D>

export const makeItemFromData = <D>(data: D): Item<D> => ({
    data,
    status: null,
})

export const makeItemFromPartial = <D>(partial: PartialItem<D>): Item<D> =>
    mergeRight(makeItemFromData(prop('data', partial)), omit(['data'], partial))

export const groupItems = <D>(
    fn: (item: Item<D>) => string,
    items: PublicItems<D>
): Partial<Record<ReturnType<typeof fn>, PublicItems<D>>> =>
    map(fromPairs, groupBy(pipe(last, fn), toPairs(coerceToItems(items))))

export const sortItems = <D, P>(
    fn: (item: Item<D>) => number | string,
    items: PublicItems<D>
): Array<Item<D>> => sortBy(fn, values(coerceToItems(items)))

export const useAddItem =
    <D>(getKeys: {
        getDataKey: GetDataKey<D>
    }): ((item: Item<D>, items: Items<D>) => Items<D>) =>
    (item, items) =>
        assoc(prop('getDataKey', getKeys)(prop('data', item)), item, items)

export const useGetItem =
    <D>(getKeys: {
        getDataKey: GetDataKey<D>
    }): ((data: D, items: Items<D>) => Item<D>) =>
    (data, items) =>
        prop(prop('getDataKey', getKeys)(data), items)

export const useRemoveItem =
    <D>(getKeys: {
        getDataKey: GetDataKey<D>
    }): ((item: Item<D>, items: Items<D>) => Items<D>) =>
    (item, items) =>
        reject(
            pipe(
                prop('data'),
                prop('getDataKey', getKeys),
                equals(prop('getDataKey', getKeys)(prop('data', item)))
            ),
            items
        )
