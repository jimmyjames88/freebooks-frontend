import { 
  _Client, _Expense, _Invoice, _InvoiceStatus, _LineItem, _Payment, _Tax, _User
} from '@jimmyjames88/freebooks-types'
import Client from './Client'
import Expense from './Expense'
import Payment from './Payment'
import User from './User'
import API from '@/api'

interface IInvoice extends Omit<
  _Invoice,
  'Expenses'  | 'Payments' | 'User' | 'Client' | 'id'
> {}
export default class Invoice implements IInvoice {
  public id!: number | null
  public refNo!: string
  public issueDate?: Date
  public dueDate?: Date
  public status!: _InvoiceStatus
  public notes!: string
  public lineItems!: _LineItem[]
  public total!: number
  public Taxes?: _Tax[]
  public Expenses?: Expense[]
  public Payments?: Payment[]
  public User!: User
  public Client!: Client
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  constructor(attrs: Partial<Invoice>) {
    if (attrs.dueDate) attrs.dueDate = new Date(attrs.dueDate)
    if (attrs.issueDate) attrs.issueDate = new Date(attrs.issueDate)
    if (attrs.Client) attrs.Client = new Client(attrs.Client)
    if (attrs.Expenses) attrs.Expenses = attrs.Expenses.map((expense: _Expense) => new Expense(expense))
    if (attrs.Payments) attrs.Payments = attrs.Payments.map((payment: _Payment) => new Payment(payment))
    Object.assign(this, attrs)
  }

  async loadClient(id: number) {
    this.Client = await API.clients.show(id)
  }
}