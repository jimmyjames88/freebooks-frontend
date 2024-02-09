import { 
  _Client, _Expense, _Invoice, _InvoiceStatus, _LineItem, _Payment, _Tax, _User
} from '@jimmyjames88/freebooks-types'
import Client from './Client'
// import User from './User'
// import Tax from './Tax'
import Expense from './Expense'
// import Payment from './Payment'

export default class Invoice implements _Invoice {
  public id!: number
  public refNo!: string
  public issueDate?: Date
  public dueDate?: Date
  public status!: _InvoiceStatus
  public notes!: string
  public lineItems!: _LineItem[]
  public total!: number
  public Taxes!: _Tax[]
  public Expenses!: _Expense[]
  public Payments!: _Payment[]
  public User!: _User
  public Client!: _Client
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  constructor(attrs: Partial<_Invoice>) {
    if (attrs.dueDate) attrs.dueDate = new Date(attrs.dueDate)
    if (attrs.issueDate) attrs.issueDate = new Date(attrs.issueDate)
    if (attrs.Client) attrs.Client = new Client(attrs.Client)
    if (attrs.Expenses) attrs.Expenses = attrs.Expenses.map((expense: _Expense) => new Expense(expense))
    Object.assign(this, attrs)
  }
}