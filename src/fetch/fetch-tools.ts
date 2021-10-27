import type { Fetch, Fetches } from './fetch-types'

export const makeFetchFromParams = <P>(params: P): Fetch<P> => ({
    params,
    status: null,
})

export const makeFetchFromPartial = <P>({
    params,
    ...partial
}: Partial<Fetch<P>> & Pick<Fetch<P>, 'params'>): Fetch<P> => ({
    ...makeFetchFromParams(params),
    ...partial,
})

export const useAddFetch =
    <P>(getParamsKey: (params: P) => string) =>
    (fetches: Fetches<P>, fetch: Fetch<P>): Fetches<P> => ({
        ...fetches,
        [getParamsKey(fetch.params)]: fetch,
    })

export const useGetFetch =
    <P>(getParamsKey: (params: P) => string) =>
    (fetches: Fetches<P>, params: P): Fetch<P> | null =>
        fetches[getParamsKey(params)] || null

export const useRemoveFetch =
    <P>(getParamsKey: (params: P) => string) =>
    (fetches: Fetches<P>, fetch: Fetch<P>): Fetches<P> =>
        (Object.values(fetches).filter(Boolean) as Array<Fetch<P>>)
            .filter(
                ({ params }) =>
                    getParamsKey(params) !== getParamsKey(fetch.params)
            )
            .reduce(useAddFetch(getParamsKey), {})
