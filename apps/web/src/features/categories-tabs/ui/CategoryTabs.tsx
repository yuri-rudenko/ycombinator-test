'use client'

import React, {Suspense, useMemo} from 'react'
import {Card, CardBody, Tab, Tabs} from '@heroui/react'
import {useCategories} from '@/src/entities/category/api/categories.hook'
import {useLocationStore} from '@/src/entities/location/store/use-location-store'
import {useRouter, useSearchParams} from 'next/navigation'
import MenuItems from '@/src/features/menu-items/ui/MenuItems'
import {useMenuItems} from '@/src/entities/menu-item/api/menu-items.hook'
import {CategoryGroupDTO} from '@per-diem/types'
import MenuItemsLoadingComponent from '@/src/shared/ui/MenuItemsLoadingComponent'
import TabsLoadingComponent from '@/src/features/categories-tabs/ui/TabsLoadingComponent'
import TabsErrorComponent from '@/src/features/categories-tabs/ui/TabsErrorComponent'

interface ICategoryTabsProps {
  className?: string
}

/**
 * CategoryTabsContent handles the business logic for displaying menu categories.
 * It synchronizes the selected tab with the URL '?category=' parameter to enable
 * deep-linking and persistent navigation on page refresh.
 */
const CategoryTabsContent: React.FC<ICategoryTabsProps> = ({className}) => {
  const locationId = useLocationStore((state) => state.selectedLocationId)
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch: refetchCategories
  } = useCategories({location_id: locationId})
  const items = useMemo(() => data || [], [data])

  const {
    data: menuItemsData,
    isLoading: isMenuItemsLoading,
    isError: isMenuItemsError,
    isFetching: isMenuItemsFetching,
    refetch
  } = useMenuItems({location_id: locationId ?? ''})

  /**
   * Transforms the flat catalog data into a lookup record.
   * This optimization allows O(1) access to menu items during tab rendering,
   * preventing unnecessary array traversals on every re-render.
   */
  const menuItemsByLocation = useMemo(() => {
    if (!menuItemsData) return {}

    return menuItemsData.reduce((acc, group) => {
      acc[group.category_name] = group
      return acc
    }, {} as Record<string, CategoryGroupDTO>)
  }, [menuItemsData])

  const categoryFromUrl = searchParams?.get('category')
  const activeTab = categoryFromUrl || (items.length > 0 ? String(items[0].id) : undefined)

  /**
   * Updates the URL search parameter when a user selects a different category.
   * Using { scroll: false } to maintain the user's vertical position while switching tabs.
   */
  const handleTabChange = (key: React.Key) => {
    const nextKey = key.toString()

    if (nextKey === activeTab) return

    router.push(`?category=${nextKey}`, {scroll: false})
  }

  // Early return: Handle initial loading states or background refetching
  // when no data is available in the cache yet.
  if ((isLoading || isFetching) && !items.length) {
    return (
      <div className={'flex items-center justify-center flex-col gap-2'}>
        <TabsLoadingComponent />
        <MenuItemsLoadingComponent />
      </div>
    )
  }

  if (isError) {
    return <TabsErrorComponent refetch={refetchCategories} />
  }

  if (!items.length) return (<div>
    <p>There are no categories yet</p>
  </div>)

  return (
    <Tabs
      aria-label="categoryTabs"
      onSelectionChange={handleTabChange}
      selectedKey={activeTab}
    >
      {items.map((category) => {
        const currentGroup = menuItemsByLocation[category.name]

        return (
          <Tab key={category.id}
               title={category.name}>
            <Card shadow="none"
                  className="bg-transparent border-none">
              <CardBody className="p-0">
                <MenuItems
                  menuItems={currentGroup}
                  isLoading={isMenuItemsLoading}
                  isError={isMenuItemsError}
                  isFetching={isMenuItemsFetching}
                  refetch={refetch}
                />
              </CardBody>
            </Card>
          </Tab>
        )
      })}
    </Tabs>
  )
}

/**
 * Main CategoryTabs entry point.
 * Wrapped in <Suspense> because useSearchParams() hook triggers client-side
 * rendering and requires a fallback boundary during the hydration process.
 */
const CategoryTabs: React.FC<ICategoryTabsProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className={'flex items-center justify-center flex-col gap-2'}>
          <TabsLoadingComponent />
          <MenuItemsLoadingComponent />
        </div>
      }
    >
      <CategoryTabsContent {...props} />
    </Suspense>
  )
}

export default CategoryTabs