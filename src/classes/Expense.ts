import { _Expense, _ExpenseInputCreate, _ExpenseInputUpdate, _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import { Invoice, PaymentType, Tax } from '@/classes'
import API from '@/api'

export default class Expense implements _Expense {
  public id!: number
  public UserId!: number
  public InvoiceId!: number | null
  public Invoice!: Invoice
  public PaymentType!: PaymentType
  public PaymentTypeId!: number
  public date!: Date
  public description!: string
  public subtotal!: number
  public Taxes!: Tax[]
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs?: Partial<_Expense>) {
    console.log('EXPENSE CONSTRUCTOR', attrs)
    attrs = attrs || {} as _ExpenseInputCreate | _Expense
    attrs.Invoice = attrs.Invoice ? new Invoice(attrs.Invoice) : new Invoice()
    attrs.Taxes = attrs.Taxes ? attrs.Taxes.map(tax => new Tax(tax)) : []
    attrs.date = attrs.date ? new Date(attrs.date) : new Date()
    Object.assign(this, attrs)
    console.log(this)
  }

  public total(): number {
    const tax = this.Taxes.reduce((acc: number, tax: _Tax) => {
      return acc + (tax.type === _TaxType.PERCENTAGE ? (this.subtotal * tax.rate) : tax.rate)
    }, 0)
    return this.subtotal + tax
  }

  public async get(id: number) {
    const response = await API.expenses.show(id)
    Object.assign(this, new Expense(response?.data))
    return this
  }

  public async save() {
    const response = this.id 
      ? await API.expenses.update(this)
      : await API.expenses.store(this)

    if (response) Object.assign(this, response.data)
    return this
  }

  public async destroy() {
    return this.id
      ? await API.expenses.destroy(this.id)
      : false
  }

  public taxesTotal(): number {
    return this.Taxes.reduce((acc: number, tax: _Tax) => {
      return acc + (tax.type === _TaxType.PERCENTAGE ? (this.subtotal * tax.rate) : tax.rate)
    }, 0)
  }
}