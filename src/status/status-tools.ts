import { GetKeys } from '../module/module-types'
import { Status, Statuses } from './status-types'
import * as R from 'ramda'

//==============================================================================

export const makeStatusFromParams = <P>(params: P): Status<P> => ({
    params,
    status: null,
})

export const makeStatusFromPartial = <P>(
    partial: Pick<Status<P>, 'params'> & Partial<Omit<Status<P>, 'params'>>
): Status<P> =>
    R.mergeRight(
        makeStatusFromParams(R.prop('params', partial)),
        R.omit(['params'], partial)
    )

//==============================================================================

export const makeAddStatus =
    <D, P>(
        getKeys: GetKeys<D, P>
    ): ((status: Status<P>, statuses: Statuses<P>) => Statuses<P>) =>
    (status, statuses) =>
        R.assoc(
            R.prop('getParamsKey', getKeys)(R.prop('params', status)),
            status,
            statuses
        )
