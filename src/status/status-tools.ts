import { GetParamsKey, Status, Statuses } from './status-types'
import { assoc, mergeRight, omit, prop } from 'ramda'

export const makeStatusFromParams = <P>(params: P): Status<P> => ({
    params,
    status: null,
})

export const makeStatusFromPartial = <P>(
    partial: Pick<Status<P>, 'params'> & Partial<Omit<Status<P>, 'params'>>
): Status<P> =>
    mergeRight(
        makeStatusFromParams(prop('params', partial)),
        omit(['params'], partial)
    )

export const useAddStatus =
    <P>(getKeys: {
        getParamsKey: GetParamsKey<P>
    }): ((status: Status<P>, statuses: Statuses<P>) => Statuses<P>) =>
    (status, statuses) =>
        assoc(
            prop('getParamsKey', getKeys)(prop('params', status)),
            status,
            statuses
        )
