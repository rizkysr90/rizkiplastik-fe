export interface ProductCardProps {
  id: string;
  name: string;
  costPrice: number;
  shopeePrice: number;
  shopeeCategory: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
