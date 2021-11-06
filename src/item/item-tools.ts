import { GetKeys } from '../module/module-types'
import { ImpartialItems, Item, Items } from './item-types'
import {
    equals,
    filter,
    fromPairs,
    groupBy,
    last,
    map,
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

export const makeItemFromPartial = <D>({
    data,
    ...partial
}: Pick<Item<D>, 'data'> & Partial<Omit<Item<D>, 'data'>>): Item<D> => ({
    ...makeItemFromData(data),
    ...partial,
})

export const filterItems = <D>(items: Items<D>): ImpartialItems<D> =>
    filter(Boolean, items) as ImpartialItems<D>

export const groupItems = <D>(
    fn: (item: Item<D>) => string,
    items: Items<D>
): Partial<Record<ReturnType<typeof fn>, Items<D>>> =>
    map(fromPairs, groupBy(pipe(last, fn), toPairs(filterItems(items))))

export const sortItems = <D>(
    fn: (item: Item<D>) => number | string,
    items: Items<D>
): Array<Item<D>> => sortBy(fn, values(filterItems(items)))

export const makeAddItem =
    <D, P>({
        getDataKey,
    }: GetKeys<D, P>): ((item: Item<D>, items: Items<D>) => Items<D>) =>
    ({ data, ...partial }, items) => ({
        ...items,
        [getDataKey(data)]: { ...partial, data },
    })

export const makeGetItem =
    <D, P>({
        getDataKey,
    }: GetKeys<D, P>): ((data: D, items: Items<D>) => Item<D> | undefined) =>
    (data, items) =>
        items[getDataKey(data)]

export const makeRemoveItem =
    <D, P>({
        getDataKey,
    }: GetKeys<D, P>): ((item: Item<D>, items: Items<D>) => Items<D>) =>
    ({ data }, items) =>
        reject(
            pipe(prop('data'), getDataKey, equals(getDataKey(data))),
            filterItems(items)
        )
