import { 
  _User, _UserInputCreate, _UserInputUpdate, Optional
} from '@jimmyjames88/freebooks-types'
import Profile from './Profile'

export default class User implements Optional<_User, 'password'> {
  public id!: number
  public password?: string
  public name!: string
  public email!: string
  public Profile!: Profile
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: _UserInputCreate | _UserInputUpdate) {
    Object.assign(this, attrs)
  }
}