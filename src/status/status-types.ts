export type Status<P> = {
    status: 'fetched' | 'fetching' | 'refetched' | 'refetching' | Error | null
    params: P
}

export type GetParamsKey<P> = (params: P) => string

export type Statuses<P> = Partial<
    Record<ReturnType<GetParamsKey<P>>, Status<P>>
>
