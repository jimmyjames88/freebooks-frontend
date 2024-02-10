import { _Expense, _Tax } from '@jimmyjames88/freebooks-types'

export default class Expense implements _Expense {
  public id?: number
  public UserId!: number
  public InvoiceId?: number
  public paymentTypeId!: number
  public date!: Date
  public description!: string
  public subtotal!: number
  public Taxes?: _Tax[]

  constructor(attrs: Partial<_Expense>) {
    attrs.Taxes = []  // tempfix todo
    Object.assign(this, attrs)
  }
}