import { _User } from '@jimmyjames88/freebooks-types'

interface IUser extends _User {}

export default class User implements IUser {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: Partial<User>) {
    Object.assign(this, attrs)
  }
}