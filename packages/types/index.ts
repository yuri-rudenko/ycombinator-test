export interface LocationDTO {
  id: string;
  name: string;
  address?: string;
  timezone?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MenuItemVariation {
  id: string;
  name: string;
  price: string;
}

export interface MenuItemDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  variations: MenuItemVariation[];
}

export interface CategoryGroupDTO {
  category_name: string;
  items: MenuItemDTO[];
}

export interface CategoryListDTO {
  id: string;
  name: string;
  item_count: number;
}