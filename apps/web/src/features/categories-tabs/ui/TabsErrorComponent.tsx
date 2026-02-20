import React from 'react'
import {AlertCircle} from 'lucide-react'
import {Button} from '@heroui/react'

interface ITabsErrorComponentProps {
  refetch: () => void,
}

const TabsErrorComponent: React.FC<ITabsErrorComponentProps> = ({refetch}) => {
  return <div className="w-full py-4 flex flex-col items-center justify-center text-center gap-2 bg-danger-50 rounded-xl border border-danger-100">
    <AlertCircle className="w-10 h-10 text-danger" />
    <div>
      <h3 className="text-lg font-semibold text-danger-600">Couldn't get the categories</h3>
      <p className="text-small text-danger-400">Try update the page</p>
    </div>
    <Button size="sm"
            color="danger"
            variant="flat"
            onPress={() => refetch()}>
      Try again
    </Button>
  </div>
}

export default TabsErrorComponent