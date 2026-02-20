import React from 'react'
import {AlertCircle} from 'lucide-react'
import {Button} from '@heroui/react'

interface IMenuItemErrorComponentProps {
  refetch: () => void;
  isFetching: boolean;
}

const MenuItemErrorComponent: React.FC<IMenuItemErrorComponentProps> = ({refetch, isFetching}) => {
  return (<div className="w-full py-10 flex flex-col items-center justify-center text-center gap-4 bg-danger-50 rounded-xl border border-danger-100">
    <AlertCircle className="w-10 h-10 text-danger" />
    <div>
      <h3 className="text-lg font-semibold text-danger-600">Couldn't get the menu items</h3>
      <p className="text-small text-danger-400">Try update the page</p>
    </div>
    <Button size="sm"
            color="danger"
            variant="flat"
            isLoading={isFetching}
            onPress={() => refetch()}>
      Try again
    </Button>
  </div>)
}

export default MenuItemErrorComponent