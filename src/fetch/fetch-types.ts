export type Fetch<P> = {
    status: 'fetched' | 'fetching' | 'refetched' | 'refetching' | Error | null
    params: P
}

export type Fetches<P> = Partial<Record<string, Fetch<P>>>
