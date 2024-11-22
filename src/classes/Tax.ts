import { _Tax, _TaxInputCreate, _TaxInputUpdate, _TaxType } from '@jimmyjames88/freebooks-types'
import { formatCurrency } from '@/utils'

export default class Tax implements _Tax {
  public id!: number
  public UserId!: number
  public type!: _TaxType
  public name!: string
  public rate!: number
  public default!: boolean
  public description!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  constructor(attrs?: _TaxInputCreate | _TaxInputUpdate) {
    if (attrs) Object.assign(this, attrs)
  }

  public label() {
    if (this.type === _TaxType.PERCENTAGE) {
      return `${this.name} (${this.rate * 100}%)`
    }
    return `${this.name} (${formatCurrency(this.rate)})`
  }
}