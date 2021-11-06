import { GetKeys } from '../module/module-types'
import { Status, Statuses } from './status-types'

//==============================================================================

export const makeStatusFromParams = <P>(params: P): Status<P> => ({
    params,
    status: null,
})

export const makeStatusFromPartial = <P>({
    params,
    ...partial
}: Pick<Status<P>, 'params'> &
    Partial<Omit<Status<P>, 'params'>>): Status<P> => ({
    ...makeStatusFromParams(params),
    ...partial,
})

//==============================================================================

export const makeAddStatus =
    <D, P>({
        getParamsKey,
    }: GetKeys<D, P>): ((
        status: Status<P>,
        statuses: Statuses<P>
    ) => Statuses<P>) =>
    (status, statuses) => ({
        ...statuses,
        [getParamsKey(status.params)]: status,
    })
