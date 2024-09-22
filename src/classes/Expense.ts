import { _Expense, _Tax } from '@jimmyjames88/freebooks-types'
import { PaymentType } from '@/classes'

export default class Expense implements _Expense {
  public id!: number
  public UserId!: number
  public InvoiceId!: number
  public PaymentType!: PaymentType
  public PaymentTypeId!: number
  public date!: Date
  public description!: string
  public subtotal!: number
  public Taxes!: _Tax[]
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: Partial<_Expense>) {
    attrs.Taxes = []  // tempfix todo
    attrs.date = attrs.date ? new Date(attrs.date) : new Date()
    Object.assign(this, attrs)
  }
}