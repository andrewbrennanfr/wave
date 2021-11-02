import wave from '../'
import { ImpartialItems, Item } from '../item/item-types'
import { Module } from '../module/module-types'
import { makeState, makeUseState } from '../state/state-tools'
import { UseState } from '../state/state-types'
import * as R from 'ramda'

//==============================================================================

const flushAsync = () =>
    new Promise((resolve) => {
        setTimeout(resolve)
    })

//==============================================================================

describe('success', () => {
    const makeModule = (
        useState: UseState<string, string>
    ): Module<string, string> =>
        wave<string, string>(
            useState,
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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.add('tsunami')

        module.clear(R.propEq('data', 'added wave'))

        expect(getState()).toEqual({
            items: { t: { data: 'tsunami', status: 'adding' } },
            statuses: {},
        })

        await flushAsync()
    })

    test('edit', async () => {
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.edit('added wave', 'tsunami')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.fetch('tsunami')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.refetch('tsunami')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.remove('added wave')

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
    const makeModule = (
        useState: UseState<string, string>
    ): Module<string, string> =>
        wave<string, string>(
            useState,
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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.edit('wave', 'tsunami')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.fetch('tsunami')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.refetch('tsunami')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')

        await flushAsync()

        module.remove('wave')

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
    const makeModule = (
        useState: UseState<string, string>
    ): Module<string, string> =>
        wave<string, string>(
            useState,
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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)
        const setState = R.prop('setState', useState)

        module.add('wave')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')
        module.add('tsunami')

        await flushAsync()

        module.add('tide')

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
        const state = makeState<string, string>()
        const useState = makeUseState(state)
        const module = makeModule(useState)
        const getState = R.prop('getState', useState)

        module.add('wave')
        module.add('tsunami')

        await flushAsync()

        module.add('tide')

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
