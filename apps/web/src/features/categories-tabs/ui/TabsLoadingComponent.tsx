import React from 'react'
import {cn, Skeleton} from '@heroui/react'

interface ITabsLoadingComponentProps {
  className?: string
}

const TabsLoadingComponent: React.FC<ITabsLoadingComponentProps> = ({className}) => {
  return <div className={cn("flex w-full flex-col gap-4", className)}>
    <div className="flex gap-4">
      <Skeleton className="rounded-lg w-24 h-8" />
      <Skeleton className="rounded-lg w-24 h-8" />
      <Skeleton className="rounded-lg w-24 h-8" />
    </div>
  </div>
}

export default TabsLoadingComponent