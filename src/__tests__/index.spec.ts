import wave from '../'
import { ImpartialItems, Item } from '../item/item-types'
import { Module } from '../module/module-types'
import { UseState } from '../state/state-types'
import * as R from 'ramda'

//==============================================================================

const flushAsync = () =>
    new Promise((resolve) => {
        setTimeout(resolve)
    })

const makeUseState = <D, P>(module: Module<D, P>): UseState<D, P> => ({
    getState: () => R.prop('state', module),
    setState: (state) => {
        module.state = state
    },
})

//==============================================================================

describe('success', () => {
    const makeModule = (): Module<string, string> =>
        wave<string, string>(
            { getDataKey: R.head, getParamsKey: R.last },
            {
                add: (data) => Promise.resolve(`added ${data}`),
                edit: (_, newData) => Promise.resolve(`edited ${newData}`),
                fetch: (params) => Promise.resolve([`fetched ${params}`]),
                refetch: (params) => Promise.resolve([`refetched ${params}`]),
                remove: () => Promise.resolve(),
            }
        )

    test('add', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            statuses: {},
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: {},
        })
    })

    test('clear', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.add(useState, 'tsunami')

        module.clear(useState, R.propEq('data', 'added wave'))

        expect(getState()).toEqual({
            items: { t: { data: 'tsunami', status: 'adding' } },
            statuses: {},
        })

        await flushAsync()
    })

    test('edit', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.edit(useState, 'added wave', 'tsunami')

        expect(getState()).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { e: { data: 'edited tsunami', status: null } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.fetch(useState, 'tsunami')

        expect(getState()).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: {
                a: { data: 'added wave', status: null },
                f: { data: 'fetched tsunami', status: null },
            },
            statuses: { i: { params: 'tsunami', status: 'fetched' } },
        })
    })

    test('refetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.refetch(useState, 'tsunami')

        expect(getState()).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { r: { data: 'refetched tsunami', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetched' } },
        })
    })

    test('remove', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.remove(useState, 'added wave')

        expect(getState()).toEqual({
            items: { a: { data: 'added wave', status: 'removing' } },
            statuses: {},
        })

        await flushAsync()

        expect(getState()).toEqual({ items: {}, statuses: {} })
    })
})

//==============================================================================

describe('error', () => {
    const makeModule = (): Module<string, string> =>
        wave<string, string>(
            { getDataKey: R.head, getParamsKey: R.last },
            {
                add: (data) => Promise.reject(`added ${data}`),
                edit: (_, newData) => Promise.reject(`edited ${newData}`),
                fetch: (params) => Promise.reject(`fetched ${params}`),
                refetch: (params) => Promise.reject(`refetched ${params}`),
                remove: (data) => Promise.reject(`removed ${data}`),
            }
        )

    test('add', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            statuses: {},
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.edit(useState, 'wave', 'tsunami')

        expect(getState()).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { t: { data: 'tsunami', status: Error('edited tsunami') } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.fetch(useState, 'tsunami')

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
                i: { params: 'tsunami', status: Error('fetched tsunami') },
            },
        })
    })

    test('refetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.refetch(useState, 'tsunami')

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
                i: { params: 'tsunami', status: Error('refetched tsunami') },
            },
        })
    })

    test('remove', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        module.remove(useState, 'wave')

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: 'removing' } },
            statuses: {},
        })

        await flushAsync()

        expect(getState()).toEqual({
            items: { w: { data: 'wave', status: Error('removed wave') } },
            statuses: {},
        })
    })
})

//==============================================================================

describe('tools', () => {
    const makeModule = (): Module<string, string> =>
        wave<string, string>(
            {
                getDataKey: R.replace('added ', ''),
                getParamsKey: R.replace('added ', ''),
            },
            {
                add: (data) => Promise.resolve(`added ${data}`),
                edit: (_, newData) => Promise.resolve(`edited ${newData}`),
                fetch: (params) => Promise.resolve([`fetched ${params}`]),
                refetch: (params) => Promise.resolve([`refetched ${params}`]),
                remove: () => Promise.resolve(),
            }
        )

    test('filter', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        module.add(useState, 'wave')

        await flushAsync()

        setState(
            R.assoc(
                'items',
                R.assoc<undefined, Partial<ImpartialItems<string>>, 'test'>(
                    'test',
                    undefined,
                    R.prop('items', getState())
                ),
                getState()
            )
        )

        expect(R.includes('test', R.keys(R.prop('items', getState())))).toEqual(
            true
        )

        expect(
            R.includes(
                'test',
                R.keys(module.filterItems(R.prop('items', getState())))
            )
        ).toEqual(false)
    })

    test('group', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')
        module.add(useState, 'tsunami')

        await flushAsync()

        module.add(useState, 'tide')

        expect(
            module.groupItems(
                R.pipe<Item<string>, Item<string>['status'], string>(
                    R.prop('status'),
                    String
                ),
                R.prop('items', getState())
            )
        ).toEqual({
            adding: { tide: { data: 'tide', status: 'adding' } },
            null: {
                tsunami: { data: 'added tsunami', status: null },
                wave: { data: 'added wave', status: null },
            },
        })

        await flushAsync()
    })

    test('sort', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        const getState = R.prop('getState', useState)

        module.add(useState, 'wave')
        module.add(useState, 'tsunami')

        await flushAsync()

        module.add(useState, 'tide')

        expect(
            module.sortItems(
                R.pipe<Item<string>, Item<string>['status'], string>(
                    R.prop('status'),
                    String
                ),
                R.prop('items', getState())
            )
        ).toEqual([
            { data: 'tide', status: 'adding' },
            { data: 'added wave', status: null },
            { data: 'added tsunami', status: null },
        ])

        await flushAsync()
    })
})
