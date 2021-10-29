import { GetDataKey, Item, Items, PublicItems } from './item-types'
import {
    assoc,
    equals,
    fromPairs,
    groupBy,
    map,
    mergeRight,
    nth,
    omit,
    pipe,
    prop,
    reject,
    sortBy,
    toPairs,
    values,
} from 'ramda'

export const makeItemFromData = <D>(data: D): Item<D> => ({
    data,
    status: null,
})

export const makeItemFromPartial = <D>(
    partial: Pick<Item<D>, 'data'> & Partial<Omit<Item<D>, 'data'>>
): Item<D> =>
    mergeRight(makeItemFromData(prop('data', partial)), omit(['data'], partial))

export const groupItems = <D>(
    grouper: (item: Item<D>) => string,
    items: PublicItems<D>
): Partial<Record<ReturnType<typeof grouper>, PublicItems<D>>> =>
    map(
        fromPairs,
        groupBy(
            pipe(nth(1) as (pair: [string, Item<D>]) => Item<D>, grouper),
            toPairs(items) as Array<[string, Item<D>]>
        )
    )

export const sortItems = <D, P>(
    comparator: (item: Item<D>) => number | string,
    items: PublicItems<D>
): Array<Item<D>> => sortBy(comparator, values(items) as Array<Item<D>>)

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
