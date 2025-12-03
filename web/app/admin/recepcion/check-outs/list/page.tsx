import { getTodayCheckOuts } from '@/lib/queries/reception'
import CheckOutsListClient from '@/components/reception/check-outs-list-client'

export default async function CheckOutsListPage() {
  const checkOuts = await getTodayCheckOuts()

  return <CheckOutsListClient checkOuts={checkOuts} />
}

