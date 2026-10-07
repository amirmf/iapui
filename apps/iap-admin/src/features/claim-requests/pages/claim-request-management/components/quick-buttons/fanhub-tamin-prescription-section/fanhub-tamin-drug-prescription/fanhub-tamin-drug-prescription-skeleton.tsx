import { Card, CardContent, CardHeader } from '@iap/ui'
import { Skeleton } from '@iap/ui'

export function FanhubTaminDrugPrescriptionSkeleton() {
  return (
    <Card className='gap-4 py-5 shadow-none'>
      <CardHeader className='gap-3 px-4 sm:px-6'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-4 w-64 max-w-full' />
      </CardHeader>
      <CardContent className='space-y-5 px-4 sm:px-6'>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className='space-y-3'>
            <Skeleton className='h-5 w-3/4' />
            <div className='grid gap-2 sm:grid-cols-2'>
              {Array.from({ length: 4 }).map((__, valueIndex) => (
                <Skeleton key={valueIndex} className='h-10 w-full' />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
