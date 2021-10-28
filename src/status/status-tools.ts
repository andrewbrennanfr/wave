import { GetParamsKey, Status, Statuses } from './status-types'

export const makeStatusFromParams = <P>(params: P): Status<P> => ({
    params,
    status: null,
})

export const makeStatusFromPartial = <P>({
    params,
    ...partial
}: Partial<Status<P>> & Pick<Status<P>, 'params'>): Status<P> => ({
    ...makeStatusFromParams(params),
    ...partial,
})

export const useStatus = <P>({
    getParamsKey,
}: {
    getParamsKey: GetParamsKey<P>
}): {
    addStatus: (statuses: Statuses<P>, status: Status<P>) => Statuses<P>
} => ({
    addStatus: (statuses, status) => ({
        ...statuses,
        [getParamsKey(status.params)]: status,
    }),
})
