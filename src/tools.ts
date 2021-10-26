import type { Item, Items, State, Status } from './types'

export const makeState = <D>(): State<D> => ({ items: {}, status: {} })

export const makeItemFromData = <D>(data: D) => ({ data, status: null })

export const makeItemFromPartial = <D>(
    partial: Partial<Item<D>> & Pick<Item<D>, 'data'>
): Item<D> => ({ ...makeItemFromData(partial.data), ...partial })

export const makeItems = <D>(
    getDataKey: (data: D) => string,
    datas: Array<D>
): Items<D> =>
    Object.fromEntries(
        datas.map((data) => [getDataKey(data), makeItemFromData(data)])
    )

export const addItems = <D>(
    entries: Array<[string, Item<D>]>,
    items: Items<D>
): Items<D> => ({ ...items, ...Object.fromEntries(entries) })

export const removeItems = <D>(
    keys: Array<string>,
    items: Items<D>
): State<D>['items'] =>
    Object.fromEntries(
        Object.entries(items).filter(([key]) => !keys.includes(key))
    )

export const sortItems = <D>(
    comparator: (item: Item<D>) => number | string,
    items: Items<D>
): Array<Item<D>> =>
    Object.values(items).sort((itemA, itemB) =>
        comparator(itemA) > comparator(itemB)
            ? 1
            : comparator(itemA) < comparator(itemB)
            ? -1
            : 0
    )

export const addStatuses = (
    entries: Array<[string, Status[string]]>,
    status: Status
): Status => ({ ...status, ...Object.fromEntries(entries) })
