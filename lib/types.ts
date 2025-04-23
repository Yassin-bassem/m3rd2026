export interface Product {
  id: string
  code: string
  name: string
  description: string
  price: number
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id?: string
  name: string
  phone: string
  email?: string
  location: string
  created_at?: string
}

export interface OrderItem {
  id?: string
  order_id?: string
  product_id: string
  product_code: string
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
  created_at?: string
}

export interface Order {
  id?: string
  customer_id?: string
  customer?: Customer
  total_amount: number
  deposit_amount?: number
  status?: string
  items?: OrderItem[] // Make items optional since it's not stored in the orders table
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
}
