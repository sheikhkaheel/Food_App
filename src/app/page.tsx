import { getOrders } from "./actions"
import OrderButton from "./components/order-button"

export default async function App(){
  const posts = await getOrders()

  return (
    <>
      <div className="p-4 lg:p-8 flex flex-col lg:flex-row  justify-center lg:justify-between">
        {posts.map((order)=>(
          <div className="lg:px-4 w-full lg:py-2 lg:h-80 mb-10 lg:mb-0 lg:w-80 rounded-lg" key={order.order.id}>
            <img className="lg:h-44 lg:w-80 h-72 w-full rounded-lg object-cover" src={order.food?.img} alt="" />
            <div className="flex justify-between py-4">
              <div>{order.food?.name}</div>
              <div><span>{order.order.amount}</span> {order.order.currency}</div>
            </div>
            <OrderButton order={order}/>
          </div>
        ))}
      </div>
    </>
  )
}