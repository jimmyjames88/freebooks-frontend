import { _Address } from '@jimmyjames88/freebooks-types'

export default class Address implements _Address {
  public line1!: string
  public line2!: string
  public city!: string
  public state!: string
  public postal!: string
  public country!: string

  constructor(attrs?: Partial<Address>) {
    if (attrs) Object.assign(this, attrs)
  }
}