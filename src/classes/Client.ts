import {
  _Address, _Client, _ClientInputCreate, _ClientInputUpdate, _Invoice, _InvoiceInputCreate,
  _InvoiceInputUpdate
} from '@jimmyjames88/freebooks-types'
import Invoice from './Invoice'
import User from './User'

export default class Client implements _Client {
  public id!: number
  public name!: string
  public email!: string
  public phone!: string
  public website!: string
  public address!: _Address
  public Invoices!: Invoice[]
  public User!: User
  public UserId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs: _ClientInputCreate | _ClientInputUpdate) {
    attrs.Invoices = attrs.Invoices
      ? attrs.Invoices.map((invoice: _InvoiceInputCreate | _InvoiceInputUpdate) => new Invoice(invoice))
      : []
    
    if (attrs.User)
      attrs.User = new User(attrs.User)

    Object.assign(this, attrs)
  }
}