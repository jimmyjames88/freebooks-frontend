import { _LineItem } from '@jimmyjames88/freebooks-types'

export default class LineItem implements _LineItem {
  public description!: string
  public quantity!: number
  public rate!: number

  constructor(attrs?: _LineItem) {
    attrs = attrs || {} as _LineItem
    attrs.quantity = attrs.quantity || 1
    attrs.rate = attrs.rate || 0
    attrs.description = attrs.description || ''
    Object.assign(this, attrs)
  }
}
