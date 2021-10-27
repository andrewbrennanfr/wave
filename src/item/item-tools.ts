import type { Item, Items } from './item-types'

export const makeItemFromData = <D>(data: D): Item<D> => ({
    data,
    status: null,
})

export const makeItemFromPartial = <D>({
    data,
    ...partial
}: Partial<Item<D>> & Pick<Item<D>, 'data'>): Item<D> => ({
    ...makeItemFromData(data),
    ...partial,
})

export const useAddItem =
    <D>(getDataKey: (data: D) => string) =>
    (items: Items<D>, item: Item<D>): Items<D> => ({
        ...items,
        [getDataKey(item.data)]: item,
    })

export const useGetItem =
    <D>(getDataKey: (data: D) => string) =>
    (items: Items<D>, data: D): Item<D> | null =>
        items[getDataKey(data)] || null

export const useRemoveItem =
    <D>(getDataKey: (data: D) => string) =>
    (items: Items<D>, item: Item<D>): Items<D> =>
        (Object.values(items).filter(Boolean) as Array<Item<D>>)
            .filter(({ data }) => getDataKey(data) !== getDataKey(item.data))
            .reduce(useAddItem(getDataKey), {})

export const sortItems = <D>(
    items: Items<D>,
    comparator: (item: Item<D>) => number | string
): Array<Item<D>> =>
    (Object.values(items).filter(Boolean) as Array<Item<D>>).sort(
        (itemA, itemB) =>
            comparator(itemA) > comparator(itemB)
                ? 1
                : comparator(itemA) < comparator(itemB)
                ? -1
                : 0
    )
