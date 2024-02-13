import { _Address, _Client, _Invoice } from '@jimmyjames88/freebooks-types'
import Invoice from './Invoice'
import User from './User'

interface IClient extends Omit<_Client, 'User' | 'Invoices'> {
  User?: User
  Invoices?: Invoice[]
}

export default class Client implements IClient {
  public id!: number
  public name!: string
  public email!: string
  public phone?: string
  public website?: string
  public address!: _Address
  public Invoices?: Invoice[]
  public User?: User

  constructor(attrs: Partial<Client>) {
    if (attrs.Invoices) 
      attrs.Invoices = attrs.Invoices.map((invoice: Invoice) => new Invoice(invoice))
    
    Object.assign(this, attrs)
  }
}