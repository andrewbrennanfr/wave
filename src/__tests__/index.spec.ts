import wave from '../'
import { Module } from '../module/module-types'
import { UseState } from '../state/state-types'
import * as R from 'ramda'

//==============================================================================

const flushPromises = () =>
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

        module.add(useState, 'wave')

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            statuses: {},
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.edit(useState, 'added wave', 'tsunami')

        expect(R.prop('state', module)).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { e: { data: 'edited tsunami', status: null } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.fetch(useState, 'tsunami')

        expect(R.prop('state', module)).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
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

        module.add(useState, 'wave')

        await flushPromises()

        module.refetch(useState, 'tsunami')

        expect(R.prop('state', module)).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { r: { data: 'refetched tsunami', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetched' } },
        })
    })

    test('remove', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.remove(useState, 'added wave')

        expect(R.prop('state', module)).toEqual({
            items: { a: { data: 'added wave', status: 'removing' } },
            statuses: {},
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({ items: {}, statuses: {} })
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

        module.add(useState, 'wave')

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            statuses: {},
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.edit(useState, 'wave', 'tsunami')

        expect(R.prop('state', module)).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { t: { data: 'tsunami', status: Error('edited tsunami') } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.fetch(useState, 'tsunami')

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
                i: { params: 'tsunami', status: Error('fetched tsunami') },
            },
        })
    })

    test('refetch', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.refetch(useState, 'tsunami')

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
                i: { params: 'tsunami', status: Error('refetched tsunami') },
            },
        })
    })

    test('remove', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')

        await flushPromises()

        module.remove(useState, 'wave')

        expect(R.prop('state', module)).toEqual({
            items: { w: { data: 'wave', status: 'removing' } },
            statuses: {},
        })

        await flushPromises()

        expect(R.prop('state', module)).toEqual({
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

    test('group', async () => {
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')
        module.add(useState, 'tsunami')

        await flushPromises()

        module.add(useState, 'tide')

        expect(
            module.groupItems<string>(
                R.pipe(R.prop('status'), String),
                R.path(['state', 'items'], module)
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
        const module = makeModule()
        const useState = makeUseState(module)

        module.add(useState, 'wave')
        module.add(useState, 'tsunami')

        await flushPromises()

        module.add(useState, 'tide')

        expect(
            module.sortItems<string>(
                R.prop('data'),
                R.path(['state', 'items'], module)
            )
        ).toEqual([
            { data: 'added tsunami', status: null },
            { data: 'added wave', status: null },
            { data: 'tide', status: 'adding' },
        ])
    })
})
