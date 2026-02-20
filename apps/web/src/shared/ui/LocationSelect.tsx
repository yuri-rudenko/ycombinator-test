'use client'

import React, {useEffect, useMemo} from 'react'
import {Button, cn, Select, SelectItem} from '@heroui/react'
import {useLocations} from '@/src/entities/location/api/locations.hook'
import {useLocationStore} from '@/src/entities/location/store/use-location-store'
import {RefreshCcw} from 'lucide-react'

interface ILocationSelectProps {
  className?: string
}

/**
 * LocationSelect provides a global entry point for switching between business locations.
 * It integrates with the centralized 'useLocationStore' to ensure that all catalog
 * and category data stays synchronized with the selected ID.
 */
export const LocationSelect: React.FC<ILocationSelectProps> = ({className}) => {
  const {data, isLoading, isFetching, refetch} = useLocations()
  const {selectedLocationId, setLocationId} = useLocationStore()

  const items = useMemo(() => data || [], [data])

  /**
   * Updates the global store when a user manually selects a different location.
   * This will trigger a cascade of refetches in dependent hooks like useCategories.
   */
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationId(e.target.value)
  }

  const handleRefetchClick = async () => {
    await refetch()
  }

  /**
   * Auto-selection Logic:
   * If the app loads and no location is selected (e.g., first visit),
   * we automatically pick the first available active location from the Square API.
   */
  useEffect(() => {
    if (!isLoading && items.length > 0 && !selectedLocationId) {
      setLocationId(items[0].id)
    }
  }, [isLoading, items, selectedLocationId, setLocationId])

  return (
    <div className={'flex gap-2 items-center w-full justify-end'}>
      <Select isLoading={isLoading || isFetching}
              selectedKeys={selectedLocationId ? [selectedLocationId] : []}
              onChange={handleSelectionChange}
              className={cn('max-w-xs', className)}
              label="Chosen location"
              variant={'bordered'}
              placeholder={'Select a location'}>
        {items.map((item) => (
          <SelectItem key={item.id}>{item.name}</SelectItem>
        ))}
      </Select>
      <Button isIconOnly onPress={handleRefetchClick}>
        <RefreshCcw />
      </Button>
    </div>
  )
}

export default LocationSelect
