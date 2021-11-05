import wave from '../'
import { Module } from '../module/module-types'
import { UseState } from '../state/state-types'
import flushPromises from 'flush-promises'
import { always, head, last, pipe, prop, propEq, split } from 'ramda'

//==============================================================================

const makeUseState = (): UseState<string, string> => {
    const state = { items: {}, statuses: {} }

    return {
        getState: always(state),
        setState: ({ items, statuses }) => {
            state.items = items || state.items
            state.statuses = statuses || state.statuses
        },
    }
}

//==============================================================================

describe('success', () => {
    const makeModule = (
        useState: UseState<string, string>
    ): Module<string, string> =>
        wave<string, string>(
            useState,
            { getDataKey: head, getParamsKey: last },
            {
                add: (data) => Promise.resolve(`added ${data}`),
                edit: (_, newData) => Promise.resolve(`edited ${newData}`),
                fetch: (params) => Promise.resolve([`fetched ${params}`]),
                refetch: (params) => Promise.resolve([`refetched ${params}`]),
                remove: () => Promise.resolve(),
            }
        )

    test('add', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        expect(useState.getState()).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            statuses: {},
        })

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: {},
        })
    })

    test('clear', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.add('tsunami')

        module.clear(propEq('data', 'added wave'))

        expect(useState.getState()).toEqual({
            items: { t: { data: 'tsunami', status: 'adding' } },
            statuses: {},
        })
    })

    test('edit', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.edit('added wave', 'tsunami')

        expect(useState.getState()).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { e: { data: 'edited tsunami', status: null } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(useState.getState()).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: {
                a: { data: 'added wave', status: null },
                f: { data: 'fetched tsunami', status: null },
            },
            statuses: { i: { params: 'tsunami', status: 'fetched' } },
        })
    })

    test('refetch', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        expect(useState.getState()).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { r: { data: 'refetched tsunami', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetched' } },
        })
    })

    test('remove', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.remove('added wave')

        expect(useState.getState()).toEqual({
            items: { a: { data: 'added wave', status: 'removing' } },
            statuses: {},
        })

        await flushPromises()

        expect(useState.getState()).toEqual({ items: {}, statuses: {} })
    })
})

//==============================================================================

describe('error', () => {
    const makeModule = (
        useState: UseState<string, string>
    ): Module<string, string> =>
        wave<string, string>(
            useState,
            { getDataKey: head, getParamsKey: last },
            {
                add: (data) => Promise.reject(`added ${data}`),
                edit: (_, newData) => Promise.reject(`edited ${newData}`),
                fetch: (params) => Promise.reject(`fetched ${params}`),
                refetch: (params) => Promise.reject(`refetched ${params}`),
                remove: (data) => Promise.reject(`removed ${data}`),
            }
        )

    test('add', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {},
        })
    })

    test('edit', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.edit('wave', 'tsunami')

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { t: { data: 'tsunami', status: Error('edited tsunami') } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
                i: { params: 'tsunami', status: Error('fetched tsunami') },
            },
        })
    })

    test('refetch', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        await flushPromises()

        expect(useState.getState()).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
                i: { params: 'tsunami', status: Error('refetched tsunami') },
            },
        })
    })

    test('remove', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        module.remove('wave')

        await flushPromises()

        expect(useState.getState()).toEqual({
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
                getDataKey: pipe(split(' '), last, String),
                getParamsKey: pipe(split(' '), last, String),
            },
            {
                add: (data) => Promise.resolve(`added ${data}`),
                edit: () => Promise.resolve(''),
                fetch: () => Promise.resolve(['']),
                refetch: () => Promise.resolve(['']),
                remove: () => Promise.resolve(),
            }
        )

    test('filter', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')

        await flushPromises()

        useState.setState({
            items: { ...useState.getState().items, test: undefined },
        })

        expect(useState.getState().items.hasOwnProperty('test')).toEqual(true)

        expect(
            module.filterItems(useState.getState().items).hasOwnProperty('test')
        ).toEqual(false)
    })

    test('group', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')
        module.add('tsunami')

        await flushPromises()

        module.add('tide')

        expect(
            module.groupItems(
                pipe(prop('status'), String),
                useState.getState().items
            )
        ).toEqual({
            adding: { tide: { data: 'tide', status: 'adding' } },
            null: {
                tsunami: { data: 'added tsunami', status: null },
                wave: { data: 'added wave', status: null },
            },
        })
    })

    test('sort', async () => {
        const useState = makeUseState()
        const module = makeModule(useState)

        module.add('wave')
        module.add('tsunami')

        await flushPromises()

        module.add('tide')

        expect(
            module.sortItems(
                pipe(prop('status'), String),
                useState.getState().items
            )
        ).toEqual([
            { data: 'tide', status: 'adding' },
            { data: 'added wave', status: null },
            { data: 'added tsunami', status: null },
        ])
    })
})
