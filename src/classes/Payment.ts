import { 
  _Payment, _PaymentInputCreate, _PaymentInputUpdate
} from '@jimmyjames88/freebooks-types'
import { PaymentType } from './'

export default class Payment implements _Payment {
  public id!: number
  public UserId!: number
  public ClientId!: number
  public InvoiceId!: number
  public PaymentTypeId!: number
  public PaymentType!: PaymentType
  public date!: Date
  public description!: string
  public amount!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs?: _PaymentInputCreate | _PaymentInputUpdate) {
    attrs = attrs || {} as _PaymentInputCreate | _PaymentInputUpdate
    Object.assign(this, attrs)
  }
}