import { _Profile } from '@jimmyjames88/freebooks-types'
import Address from './Address'

export default class Profile implements _Profile {
  public UserId!: number
  public displayName!: string
  public displayEmail!: string
  public phone!: string
  public address!: Address
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: Partial<Profile>) {
    // assign attributes or set defaults
    if (!attrs.address)
      this.address = new Address()
    // todo: address as a class
    Object.assign(this, attrs)
  }
}