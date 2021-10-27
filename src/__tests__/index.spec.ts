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
            fetches: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            fetches: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.edit('added wave', 'tsunami')

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            fetches: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { e: { data: 'edited tsunami', status: null } },
            fetches: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            fetches: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {
                a: { data: 'added wave', status: null },
                f: { data: 'fetched tsunami', status: null },
            },
            fetches: { i: { params: 'tsunami', status: 'fetched' } },
        })
    })

    test('refetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            fetches: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {
                r: { data: 'refetched tsunami', status: null },
            },
            fetches: { i: { params: 'tsunami', status: 'refetched' } },
        })
    })

    test('remove', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.remove('added wave')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: 'removing' } },
            fetches: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {},
            fetches: {},
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
            fetches: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            fetches: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.edit('wave', 'tsunami')

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            fetches: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: Error('edited tsunami') } },
            fetches: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            fetches: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            fetches: {
                i: { params: 'tsunami', status: Error('fetched tsunami') },
            },
        })
    })

    test('refetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            fetches: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            fetches: {
                i: { params: 'tsunami', status: Error('refetched tsunami') },
            },
        })
    })

    test('remove', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.remove('wave')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: 'removing' } },
            fetches: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('removed wave') } },
            fetches: {},
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
