import { _Payment } from '@jimmyjames88/freebooks-types'

export default class Payment implements Partial<_Payment> {
  public id!: number
  public UserId!: number
  public ClientId?: number
  public InvoiceId!: number
  public paymentTypeId!: number
  public date!: Date
  public description!: string
  public amount!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(payment: Partial<_Payment>) {
    Object.assign(this, payment)
  }
}