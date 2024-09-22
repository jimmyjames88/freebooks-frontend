import {
  _PaymentType, _PaymentTypeInputCreate, _PaymentTypeInputUpdate
} from '@jimmyjames88/freebooks-types'

export default class PaymentType implements _PaymentType {
  public id!: number
  public name!: string
  public icon!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: _PaymentTypeInputCreate | _PaymentTypeInputUpdate) {
    Object.assign(this, attrs)
  }
}