import React, {useMemo} from 'react'
import {Button, Input} from '@heroui/react'
import {Search} from 'lucide-react'
import MenuItemCard from '@/src/features/menu-items/ui/MenuItemCard'
import {CategoryGroupDTO} from '@per-diem/types'
import MenuItemsLoadingComponent from '@/src/shared/ui/MenuItemsLoadingComponent'
import MenuItemErrorComponent from '@/src/features/menu-items/ui/MenuItemErrorComponent'
import MenuItemsEmptyComponent from '@/src/features/menu-items/ui/MenuItemsEmptyComponent'

interface IMenuItemsProps {
  className?: string
  menuItems?: CategoryGroupDTO
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  refetch: () => void
}

/**
 * MenuItems component handles the display and filtering of products within a specific category.
 * It implements high-performance client-side filtering to provide instantaneous feedback
 * while the user types in the search bar.
 */
const MenuItems: React.FC<IMenuItemsProps> = ({
                                                className,
                                                menuItems,
                                                isLoading,
                                                isError,
                                                isFetching,
                                                refetch
                                              }) => {
  const [searchQuery, setSearchQuery] = React.useState('')

  /**
   * Memoized filter logic.
   * Prevents heavy re-calculation of the items array on every parent re-render,
   * triggering only when 'menuItems' data or 'searchQuery' changes.
   */
  const filteredItems = useMemo(() => {
    if (!menuItems?.items) return []

    if (!searchQuery.trim()) {
      return menuItems.items
    }

    const lowerQuery = searchQuery.toLowerCase()

    return menuItems.items.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
    )
  }, [menuItems, searchQuery])

  const onClear = () => setSearchQuery("")

  // Render loading skeleton while fetching data.
  // We check for !isError to prevent the loader from overriding error states during background refetching.
  if (isLoading || (isFetching && !isError)) {
    return (
      <MenuItemsLoadingComponent/>
    )
  }

  // Error boundary: provides the user with a retry mechanism via the 'refetch' prop.
  if (isError) {
    return <MenuItemErrorComponent isFetching={isFetching} refetch={refetch}/>
  }

  if (!menuItems) {
    return <MenuItemsEmptyComponent/>
  }

  return (
    <section
      key={menuItems.category_name}
      className={`w-full py-4 ${className}`}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight shrink-0">
          {menuItems.category_name}
          <span className="text-default-400 text-sm ml-2 font-normal">({menuItems.items.length})</span>
        </h2>

        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[20rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-100 group-data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100",
          }}
          placeholder="Search items..."
          size="sm"
          startContent={<Search className="text-default-400 pointer-events-none flex-shrink-0" size={18} />}
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClear={onClear}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-appear">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-2 bg-default-50 rounded-xl border-2 border-dashed border-default-200">
          <Search className="w-10 h-10 text-default-300 mb-2" />
          <h3 className="text-base font-semibold text-default-700">No items found</h3>
          <p className="text-small text-default-500">
            We couldn't find anything matching "<span className="font-medium">{searchQuery}</span>"
          </p>
          <Button size="sm" variant="light" color="primary" className="mt-2" onPress={onClear}>
            Clear search
          </Button>
        </div>
      )}
    </section>
  )
}

export default MenuItems