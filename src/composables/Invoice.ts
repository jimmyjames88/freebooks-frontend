import { computed, ref } from 'vue'
import { _InvoiceStatus, _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import InvoiceClass from '@/classes/Invoice'
import Client from '@/classes/Client'
import User from '@/classes/User'
import Expense from '@/classes/Expense'

const initialState: InvoiceClass = {
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
  User: {} as User,
  Client: {} as Client
} 

const Invoice = ref<InvoiceClass>(initialState)

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
    return Invoice.value.Expenses?.reduce((acc: number, expense: Expense) => {
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