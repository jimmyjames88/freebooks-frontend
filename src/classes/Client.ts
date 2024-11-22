import {
  _Client, _ClientInputCreate, _ClientInputUpdate, _Invoice, _InvoiceInputCreate,
  _InvoiceInputUpdate,
  _InvoiceStatus
} from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { Address, Invoice, User } from './'

export default class Client implements _Client {
  public id!: number
  public name!: string
  public email!: string
  public phone!: string
  public website!: string
  public address!: Address
  public Invoices!: Invoice[]
  public User!: User
  public UserId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs?: Partial<_Client>) {
    console.log('Client constructor', attrs)
    attrs = attrs || {} as _Client
    attrs.Invoices = attrs.Invoices
      ? attrs.Invoices.map((invoice: Partial<_Invoice>) => new Invoice(invoice))
      : []
    attrs.address = attrs.address ? new Address(attrs.address) : new Address()
    
    if (attrs.User)
      attrs.User = new User(attrs.User)

    Object.assign(this, attrs)
    console.log('this:', this)
  }

  async get(id: number, params?: any) {
    const response = await API.clients.show(id, params)
    Object.assign(this, new Client(response?.data))
    return this
  }

  async save() {
    const response = this.id
      ? await API.clients.update(this)
      : await API.clients.store(this)
    
    if (response) Object.assign(this, response.data)
    return this
  }

  async destroy() {
    return this.id
      ? await API.clients.destroy(this.id)
      : false
  }
}