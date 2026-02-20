'use client'

import React, {useState} from 'react'
import {Card, CardBody, CardFooter, Chip, cn, Image} from '@heroui/react'
import {ChevronDown, ChevronUp, ImageOff} from 'lucide-react'
import {MenuItemDTO} from '@per-diem/types'

interface IMenuItemCardProps {
  item: MenuItemDTO
  className?: string
}

/**
 * MenuItemCard renders individual product details including image, price, and description.
 * It intelligently handles multiple price variations and provides an expandable
 * interface for long descriptions to maintain grid consistency.
 */
export const MenuItemCard: React.FC<IMenuItemCardProps> = ({ item, className }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const mainVariation = item?.variations[0]
  const hasMultipleVariations = item.variations.length > 1

  const isDescriptionLong = (item.description?.length || 0) > 100

  return (
    <Card className={cn("w-full h-full", className)} shadow="sm" isPressable onPress={() => console.log('Open item modal')}>
      <CardBody className="p-0 overflow-visible">
        <div className="relative w-full aspect-[4/3] bg-default-100 flex items-center justify-center overflow-hidden">
          {item.image_url ? (
            <Image
              alt={item.name}
              className="w-full h-full object-cover rounded-b-none"
              radius="lg"
              src={item.image_url}
              width="100%"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-default-400">
              <ImageOff size={32} strokeWidth={1.5} />
              <span className="text-tiny font-medium uppercase tracking-wider">No Image</span>
            </div>
          )}

          <Chip
            className="absolute top-3 right-3 z-10 shadow-md backdrop-blur-md bg-background/80"
            size="sm"
            variant="flat"
          >
            {mainVariation.price}
          </Chip>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
          </div>

          {item.description && (
            <div className="text-small text-default-500">
              <p className={cn(
                "transition-all duration-300",
                !isExpanded && "line-clamp-2"
              )}>
                {item.description}
              </p>
              {isDescriptionLong && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                  className="text-tiny font-medium text-primary mt-1 hover:underline flex items-center gap-0.5"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                  {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>
              )}
            </div>
          )}
        </div>
      </CardBody>

      {hasMultipleVariations && (
        <CardFooter className="pt-0 px-4 pb-4 block">
          <div className="pt-3 border-t border-default-100 w-full">
            <p className="text-tiny font-bold text-default-400 uppercase mb-2">Options</p>
            <div className="flex flex-wrap gap-x-1 gap-y-1 text-small text-default-700">
              {item.variations.map((variant, index) => (
                <React.Fragment key={variant.id}>
                  <span className="whitespace-nowrap">
                    {variant.name} <span className="font-semibold text-primary">{variant.price}</span>
                  </span>
                  {index < item.variations.length - 1 && (
                    <span className="text-default-300 select-none mx-1">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default MenuItemCard