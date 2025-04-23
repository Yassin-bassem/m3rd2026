"use client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { useCart } from "./cart-provider"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, totalAmount } = useCart()

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Invoice</CardTitle>
          <CardDescription>Review your items before checkout</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your invoice is empty</p>
              <Button className="mt-4" variant="outline" onClick={() => router.push("/customer/scan")}>
                Scan Products
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">Code: {item.product.code}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.product.price)}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalAmount)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
        {items.length > 0 && (
          <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={() => router.push("/customer/scan")}>
              Add More Items
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
              onClick={() => router.push("/customer/checkout")}
            >
              Proceed to Checkout
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
