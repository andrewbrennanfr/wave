import wave from '../'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('success', () => {
    const makeModule = () =>
        wave<string, string>(
            {
                getDataKey: (data) => data.slice(0, 1),
                getParamsKey: (data) => data.slice(-1),
            },
            {
                add: (data) => Promise.resolve(`added ${data}`),
                edit: (oldData, newData) =>
                    Promise.resolve(`edited ${newData}`),
                fetch: (params) => Promise.resolve([`fetched ${params}`]),
                refetch: (params) => Promise.resolve([`refetched ${params}`]),
                remove: () => Promise.resolve(),
            }
        )

    test('add', async () => {
        const module = makeModule()

        module.add('wave')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            status: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            status: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.edit('added wave', 'tsunami')

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            status: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { e: { data: 'edited tsunami', status: null } },
            status: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            status: { i: 'fetching' },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {
                a: { data: 'added wave', status: null },
                f: { data: 'fetched tsunami', status: null },
            },
            status: { i: 'fetched' },
        })
    })

    test('refetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            status: { i: 'refetching' },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {
                r: { data: 'refetched tsunami', status: null },
            },
            status: { i: 'refetched' },
        })
    })

    test('remove', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.remove('added wave')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: 'removing' } },
            status: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {},
            status: {},
        })
    })
})

describe('error', () => {
    const makeModule = () =>
        wave<string, string>(
            {
                getDataKey: (data) => data.slice(0, 1),
                getParamsKey: (data) => data.slice(-1),
            },
            {
                add: (data) => Promise.reject(`added ${data}`),
                edit: (oldData, newData) => Promise.reject(`edited ${newData}`),
                fetch: (params) => Promise.reject([`fetched ${params}`]),
                refetch: (params) => Promise.reject([`refetched ${params}`]),
                remove: (data) => Promise.reject(`removed ${data}`),
            }
        )

    test('add', async () => {
        const module = makeModule()

        module.add('wave')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: 'adding' } },
            status: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            status: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.edit('wave', 'tsunami')

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            status: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: Error('edited tsunami') } },
            status: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            status: { i: 'fetching' },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            status: { i: Error('fetched tsunami') },
        })
    })

    test('refetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            status: { i: 'refetching' },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            status: { i: Error('refetched tsunami') },
        })
    })

    test('remove', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.remove('wave')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: 'removing' } },
            status: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('removed wave') } },
            status: {},
        })
    })
})

describe('get', () => {
    const makeModule = () =>
        wave<string, string>(
            {
                getDataKey: (data) => data,
                getParamsKey: (data) => data,
            },
            { add: (data) => Promise.resolve(`added ${data}`) }
        )

    test('list', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.add('tsunami')

        await flushPromises()

        module.add('tide')

        await flushPromises()

        expect(module.list((item) => item.data.slice(-4))).toEqual([
            { data: 'added tsunami', status: null },
            { data: 'added tide', status: null },
            { data: 'added wave', status: null },
        ])
    })
})
