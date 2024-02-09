import { _Address, _Client, _Invoice } from '@jimmyjames88/freebooks-types'
import Invoice from './Invoice'

export default class Client implements _Client {
  public id?: number
  public name!: string
  public email!: string
  public phone?: string
  public website?: string
  public address?: _Address
  public Invoices?: _Invoice[]

  constructor(attrs: Partial<_Client>) {
    if (attrs.Invoices) 
      attrs.Invoices = attrs.Invoices.map((invoice: _Invoice) => new Invoice(invoice))
    
    Object.assign(this, attrs)
  }
}