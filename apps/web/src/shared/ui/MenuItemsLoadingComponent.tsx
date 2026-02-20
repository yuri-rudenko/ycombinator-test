import React from 'react'
import {Skeleton} from '@heroui/react'

interface IMenuItemsLoadingComponentProps {
 className?: string
}

const MenuItemsLoadingComponent: React.FC<IMenuItemsLoadingComponentProps> = ({className}) => {
  return  <div className={`w-full py-6 ${className}`}>
    <div className="mb-4 space-y-2">
      <Skeleton className="w-1/3 h-8 rounded-lg" />
      <Skeleton className="w-2/4 h-4 rounded-lg" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({length: 4}).map((_, idx) => (
        <div key={idx}
             className="h-[300px] rounded-2xl bg-default-100 animate-pulse" />
      ))}
    </div>
  </div>
}

export default MenuItemsLoadingComponent