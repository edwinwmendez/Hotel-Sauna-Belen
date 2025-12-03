import { getTodayCheckIns } from '@/lib/queries/reception'
import CheckInsListClient from '@/components/reception/check-ins-list-client'

export default async function CheckInsListPage() {
  const checkIns = await getTodayCheckIns()

  return <CheckInsListClient checkIns={checkIns} />
}

