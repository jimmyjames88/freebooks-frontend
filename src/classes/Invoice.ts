import { 
  _InvoiceInputCreate, _InvoiceInputUpdate, _InvoiceStatus, _Expense, _Payment, _Invoice, _TaxType,
  _Tax,
  _LineItem
} from '@jimmyjames88/freebooks-types'
import { Client, Expense, LineItem, Payment, Tax, User } from '@/classes'
import API from '@/api'

export default class Invoice implements _Invoice {
  public id! : number
  public refNo!: string
  public issueDate!: Date
  public dueDate!: Date
  public status!: _InvoiceStatus
  public notes!: string
  public LineItems!: LineItem[]
  public total!: number
  public Taxes!: Tax[]
  public Expenses!: Expense[]
  public Payments!: Payment[]
  public User!: User
  public UserId!: number
  public Client!: Client
  public ClientId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs?: Partial<_Invoice>) {
    console.log('Invoice constructor', attrs)
    attrs = attrs || {} as _Invoice
    attrs.dueDate = attrs.dueDate ? new Date(attrs.dueDate) : new Date()
    attrs.issueDate = attrs.issueDate ? new Date(attrs.issueDate) : new Date()
    attrs.Client = attrs.Client ? new Client(attrs.Client) : new Client()
    attrs.Expenses = attrs.Expenses ? attrs.Expenses.map((expense: _Expense) => new Expense(expense)) : []
    attrs.Payments = attrs.Payments ? attrs.Payments.map((payment: _Payment) => new Payment(payment)) : []
    attrs.LineItems = attrs.LineItems ? attrs.LineItems.map((lineItem: _LineItem) => new LineItem(lineItem)) : []
    attrs.Taxes = attrs.Taxes ? attrs.Taxes.map((tax: _Tax) => new Tax(tax)) : []
    Object.assign(this, attrs)
    console.log('this:', this)
  }

  async get(id: number) {
    // get invoice from API then re-construct this instance
    const response = await API.invoices.show(id)
    Object.assign(this, new Invoice(response?.data))
    return this
  }

  async reset() {
    Object.assign(this, new Invoice())
    return this
  }

  async save() {
    const response = this.id
      ? await API.invoices.update(this)
      : await API.invoices.store(this)

    if (response) Object.assign(this, response.data)
    return this
  }

  async updateStatus(status: _InvoiceStatus) {
    await API.invoices.updateStatus(this.id, status)
    return this
  }

  async destroy() {
    return this.id
      ? await API.invoices.destroy(this.id)
      : false
  }

  expensesTotal(): number {
    return this.Expenses.reduce((acc: number, expense: Expense) => {
      const taxes = expense.taxesTotal()
      return acc + (expense.subtotal + taxes)
    }, 0)
  }

  paymentsTotal(): number {
    return this.Payments.reduce((acc: number, payment: Payment) => {
      return acc + +payment.amount
    }, 0)
  }

  taxesTotal(): number {
    return this.Taxes.reduce((acc: number, tax: Tax) => {
      return acc + (tax.type === _TaxType.PERCENTAGE ? (this.total * tax.rate) : tax.rate)
    }, 0)
  }

  subtotal(): number {
    return this.LineItems.reduce((acc: number, item: LineItem) => {
      return acc + ((item.rate || 0) * (item.quantity || 1))
    }, 0)
  }

  grandTotal(): number {
    // calculate grand total minus payments and plus expenses
    return this.subtotal() + this.taxesTotal() + this.expensesTotal() - this.paymentsTotal()
  }

  isPastDue(): boolean {
    const dueDate = new Date(this.dueDate)
    const today = new Date()
    return dueDate < today
  }

  isSent(): boolean {
    return this.status !== _InvoiceStatus.DRAFT
  }
}