import type { GetDataKey, Item, Items, PublicItems } from './item-types'

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

export const groupItems = <D, P>(
    items: PublicItems<D>,
    grouper: (item: Item<D>) => string
): Partial<Record<ReturnType<typeof grouper>, PublicItems<D>>> =>
    Object.fromEntries(
        Object.entries(
            (
                Object.entries(items) as Array<
                    [ReturnType<GetDataKey<D>>, Item<D>]
                >
            ).reduce<
                Record<
                    ReturnType<typeof grouper>,
                    Array<[ReturnType<GetDataKey<D>>, Item<D>]>
                >
            >(
                (groupedEntries, [key, value]) => ({
                    ...groupedEntries,
                    [grouper(value)]: [
                        ...(groupedEntries[grouper(value)] || []),
                        [key, value],
                    ],
                }),
                {}
            )
        ).map(([key, group]) => [key, Object.fromEntries(group)])
    )

export const sortItems = <D, P>(
    items: PublicItems<D>,
    comparator: (item: Item<D>) => number | string
): Array<Item<D>> =>
    (Object.values(items) as Array<Item<D>>).sort((itemA, itemB) =>
        comparator(itemA) > comparator(itemB)
            ? 1
            : comparator(itemA) < comparator(itemB)
            ? -1
            : 0
    )

export const useItem = <D>({
    getDataKey,
}: {
    getDataKey: GetDataKey<D>
}): {
    addItem: (items: Items<D>, item: Item<D>) => Items<D>
    getItem: (items: Items<D>, data: D) => Item<D>
    removeItem: (items: Items<D>, item: Item<D>) => Items<D>
} => ({
    addItem: (items, item) => ({ ...items, [getDataKey(item.data)]: item }),

    getItem: (items, data) => items[getDataKey(data)],

    removeItem: (items, item) =>
        Object.fromEntries(
            Object.entries(items).filter(
                ([_, { data }]) => getDataKey(data) !== getDataKey(item.data)
            )
        ),
})
