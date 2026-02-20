import React from 'react'
import {Annoyed} from 'lucide-react'
import {cn} from '@heroui/react'

interface IMenuItemsEmptyComponentProps {
  className?: string
}

const MenuItemsEmptyComponent: React.FC<IMenuItemsEmptyComponentProps> = ({className}) => {
  return <div className={cn("w-full py-10 flex flex-col items-center justify-center text-center gap-4 bg-gray-50 rounded-xl border border-gray-100", className)}>
    <Annoyed className="w-10 h-10" />
    <div>
      <h3 className="text-lg font-semibold text-danger-600">There are no items yet</h3>
    </div>
  </div>
}

export default MenuItemsEmptyComponent