export type Status<P> = {
    status: 'fetched' | 'fetching' | 'refetched' | 'refetching' | Error | null
    params: P
}

export type GetParamsKey<P> = (params: P) => string

export type Statuses<P> = Record<ReturnType<GetParamsKey<P>>, Status<P>>

export type PublicStatuses<P> = Partial<Statuses<P>>
