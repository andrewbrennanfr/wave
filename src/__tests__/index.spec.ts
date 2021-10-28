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
                edit: (_, newData) => Promise.resolve(`edited ${newData}`),
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
            statuses: {},
        })

        await flushPromises()

        // expect(module.state).toEqual({
        //     items: { a: { data: 'added wave', status: null } },
        //     statuses: {},
        // })
    })

    test('edit', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.edit('added wave', 'tsunami')

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { e: { data: 'edited tsunami', status: null } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: {
                a: { data: 'added wave', status: null },
                f: { data: 'fetched tsunami', status: null },
            },
            statuses: { i: { params: 'tsunami', status: 'fetched' } },
        })
    })

    test('refetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.refetch('tsunami')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { r: { data: 'refetched tsunami', status: null } },
            statuses: { i: { params: 'tsunami', status: 'refetched' } },
        })
    })

    test('remove', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.remove('added wave')

        expect(module.state).toEqual({
            items: { a: { data: 'added wave', status: 'removing' } },
            statuses: {},
        })

        await flushPromises()

        expect(module.state).toEqual({ items: {}, statuses: {} })
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
                edit: (_, newData) => Promise.reject(`edited ${newData}`),
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
            statuses: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {},
        })
    })

    test('edit', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.edit('wave', 'tsunami')

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: 'editing' } },
            statuses: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { t: { data: 'tsunami', status: Error('edited tsunami') } },
            statuses: {},
        })
    })

    test('fetch', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.fetch('tsunami')

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: { i: { params: 'tsunami', status: 'fetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
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
            statuses: { i: { params: 'tsunami', status: 'refetching' } },
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('added wave') } },
            statuses: {
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
            statuses: {},
        })

        await flushPromises()

        expect(module.state).toEqual({
            items: { w: { data: 'wave', status: Error('removed wave') } },
            statuses: {},
        })
    })
})

describe('tools', () => {
    const makeModule = () =>
        wave<string, string>(
            {
                getDataKey: (data) => data.split(' ')[1],
                getParamsKey: (data) => data.split(' ')[1],
            },
            { add: (data) => Promise.resolve(`added ${data}`) }
        )

    test('group', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.add('tsunami')

        await flushPromises()

        module.add('tide')

        await flushPromises()

        expect(
            module.groupItems(module.state.items, (item) =>
                item.data.slice(6, 7)
            )
        ).toEqual({
            t: {
                tsunami: { data: 'added tsunami', status: null },
                tide: { data: 'added tide', status: null },
            },
            w: { wave: { data: 'added wave', status: null } },
        })
    })

    test('sort', async () => {
        const module = makeModule()

        module.add('wave')

        await flushPromises()

        module.add('tsunami')

        await flushPromises()

        module.add('tide')

        await flushPromises()

        expect(
            module.sortItems(module.state.items, (item) => item.data.slice(-4))
        ).toEqual([
            { data: 'added tsunami', status: null },
            { data: 'added tide', status: null },
            { data: 'added wave', status: null },
        ])
    })
})
