import { computed, ref } from 'vue'
import { _Client, _Expense, _Invoice, _InvoiceStatus, _Tax, _TaxType, _User } from '@jimmyjames88/freebooks-types'
import API from '@/api'

const initialState: _Invoice = {
  id: 0,
  refNo: '',
  notes: '',
  lineItems: [{ description: '', quantity: undefined, rate: undefined }],
  status: _InvoiceStatus.DRAFT,
  issueDate: new Date(),
  dueDate: new Date(),
  Taxes: [],
  Expenses: [],
  Payments: [],
  total: 0,
  User: {} as _User,
  Client: {} as _Client
} 

const Invoice = ref<_Invoice>(initialState)

export default function InvoiceComposable() {

  const resetInvoice = () => {
    Invoice.value = initialState
  }

  const loadInvoice = async (id: number) => {
    resetInvoice()
    const invoice = await API.invoices.show(id)
    Invoice.value = invoice
  }

  const expensesTotal = computed(() => {
    return Invoice.value.Expenses?.reduce((acc: number, expense: _Expense) => {
      const tax = expense.Taxes?.reduce((acc: number, tax: _Tax) => {
        return acc + (tax.type === _TaxType.PERCENTAGE ? (expense.subtotal * tax.rate) : tax.rate)
      }, 0) || 0
      return acc + (expense.subtotal + tax)
    }, 0) || 0
  })

  const subtotal = computed(() => {
    return Invoice.value.lineItems?.reduce((acc: number, item) => {
      return acc + ((item.rate || 0) * (item.quantity || 1))
    }, 0)
  })

  const tax = computed(() => {
    return Invoice.value.Taxes?.reduce((acc: number, tax: _Tax) => {
      return acc + (tax.type === _TaxType.PERCENTAGE ? (subtotal.value * tax.rate) : tax.rate)
    }, 0) || 0
  })

  const total = computed(() => {
    return subtotal.value + tax.value
  })

  const isSent = computed(() => {
    return Invoice.value.status === _InvoiceStatus.DRAFT
  })

  const pastDue = computed(() => {
    if (!Invoice.value.dueDate) return false
    const dueDate = new Date(Invoice.value.dueDate)
    const today = new Date()
    return dueDate < today
  })

  const paymentsTotal = computed(() => {
    return Invoice.value.Payments?.reduce((acc, payment) => {
      return Number(acc + +payment.amount)
    }, 0) || 0
  })

  const amountDue = computed(() => {
    return Number(subtotal.value + tax.value + expensesTotal.value - paymentsTotal.value)
  })

  return {
    amountDue,
    expensesTotal,
    Invoice,
    isSent,
    loadInvoice,
    pastDue,
    paymentsTotal,
    resetInvoice,
    subtotal,
    tax,
    total
  }
}