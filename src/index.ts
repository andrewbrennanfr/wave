import { makeModule } from './module/module-tools'
import { Module as _Module } from './module/module-types'

//==============================================================================

export type Module<D, P> = _Module<D, P>

export default makeModule
