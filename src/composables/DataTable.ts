import { ref } from 'vue'

async function apiEndpointWarning() {
  console.error(`Provide api function reference as parameter on DataTableComposable in the setup()
  hook. Example: DataTableComposable(API.clients.index)`)
  return false
}

export default function DataTableComposable(apiEndpoint: Function = apiEndpointWarning) {
  const loading = ref(true)
  const itemsLength = ref(0)
  const sortBy = ref([{
    key: 'updatedAt',
    order: 'desc'
  }])
  const items = ref([])
  const currentFilters = ref({})
  const currentSearch = ref('')

  const loadItems = async (filters: any = undefined, search: string = '') => {
    loading.value = true
    currentFilters.value = filters
    currentSearch.value = search
    try {
      const response = await apiEndpoint({ ...filters, search })
      itemsLength.value = response.total
      items.value = response.items
    } catch(err: any) {
      console.warn(err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    itemsLength,
    sortBy,
    items,
    apiEndpoint,
    loadItems,
    currentFilters,
    currentSearch
  }
}