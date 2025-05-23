export interface FeeModel {
  id?: string
  fee_type: string;
  percentage: number;
  min_amount: number;
  max_amount: number;
  currency: string;
  is_active: boolean;
}