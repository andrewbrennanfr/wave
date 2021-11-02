export type Status<P> = {
    params: P
    status: 'fetched' | 'fetching' | 'refetched' | 'refetching' | Error | null
}

export type GetParamsKey<P> = (params: P) => string

export type ImpartialStatuses<P> = Record<
    ReturnType<GetParamsKey<P>>,
    Status<P>
>

export type Statuses<P> = Partial<ImpartialStatuses<P>>
