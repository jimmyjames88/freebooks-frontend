import { 
  _Client, _Expense, _Invoice, _InvoiceInputCreate, _InvoiceInputUpdate, _InvoiceStatus, _LineItem,
  _Payment, _Tax, _User
} from '@jimmyjames88/freebooks-types'
import Client from './Client'
import Expense from './Expense'
import Payment from './Payment'
import User from './User'
import API from '@/api'

export default class Invoice implements _Invoice {
  public id! : number
  public refNo!: string
  public issueDate!: Date
  public dueDate!: Date
  public status!: _InvoiceStatus
  public notes!: string
  public LineItems!: _LineItem[]
  public total!: number
  public Taxes!: _Tax[]
  public Expenses!: Expense[]
  public Payments!: Payment[]
  public User!: User
  public UserId!: number
  public Client!: Client
  public ClientId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: _InvoiceInputCreate | _InvoiceInputUpdate) {
    attrs.dueDate = attrs.dueDate ? new Date(attrs.dueDate) : new Date()
    attrs.issueDate = attrs.issueDate ? new Date(attrs.issueDate) : new Date()
    attrs.Client = attrs.Client ? new Client(attrs.Client) : new Client({} as _Client)
    attrs.Expenses = attrs.Expenses ? attrs.Expenses.map((expense: _Expense) => new Expense(expense)) : []
    attrs.Payments = attrs.Payments ? attrs.Payments.map((payment: _Payment) => new Payment(payment)) : []
    attrs.LineItems = attrs.LineItems ? attrs.LineItems : []
    Object.assign(this, attrs)
  }

  async loadClient(id: number) {
    this.Client = await API.clients.show(id)
  }
}