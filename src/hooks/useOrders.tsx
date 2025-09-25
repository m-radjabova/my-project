import { db } from "../firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import type { Order, User } from "../types/types"

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const ordersRef = collection(db, "orders")
      const ordersSnap = await getDocs(ordersRef)
      const allOrders: Order[] = []

      for (const orderDoc of ordersSnap.docs) {
        const orderData = orderDoc.data()
        const orderId = orderDoc.id

        let user = null
        if (orderData.userId) {
          try {
            const userSnap = await getDoc(doc(db, "users", orderData.userId))
            user = userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null
          } catch (userError) {
            console.warn(`User ${orderData.userId} not found:`, userError)
            user = null
          }
        }

        let products: any[] = []
        try {
          const productsSnap = await getDocs(collection(db, "orders", orderId, "orderProducts"))
          products = productsSnap.docs.map(p => ({ 
            id: p.id,
            ...p.data()
          }))
        } catch (productsError) {
          console.warn(`Products for order ${orderId} not found:`, productsError)
          products = []
        }

        const order: Order = {
          id: orderId,
          userId: orderData.userId,
          user: user as User, 
          totalPrice: orderData.totalPrice || 0,
          products: products as any, 
          createdAt: orderData.createdAt,
          status: orderData.status || 'unknown',
          paymentMethod: orderData.paymentMethod || 'unknown',
          shippingAddress: orderData.shippingAddress || 'unknown',
          notes: orderData.notes || 'unknown',
          deliveryDate: orderData.deliveryDate || 'unknown'
        }
        
        allOrders.push(order)
      }
      setOrders(allOrders)
      console.log(`Jami ${allOrders.length} ta order topildi va bitta arrayga joylandi`)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getAllOrders = (): Order[] => {
    return orders
  }

  const getOrdersByStatus = (status: string): Order[] => {
    return orders.filter(order => order.status === status)
  }

  const getOrdersByUser = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  return { 
    orders, 
    loading, 
    error, 
    refetch: fetchOrders,
    getAllOrders,
    getOrdersByStatus,
    getOrdersByUser
  }
}
