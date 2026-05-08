import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order) || []
  const hasOrders = Array.isArray(orders) && orders.length > 0

  const handleDownloadReceipt = async (order) => {
    try {
      const response = await Axios({
        method: SummaryApi.downloadReceipt.method,
        url: `${SummaryApi.downloadReceipt.url}/${order._id}`,
        responseType: 'blob'
      })

      const blobUrl = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `receipt-${order.orderId || order._id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className="w-full">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-amber-50/60 p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">My Orders</h1>
            <p className="mt-2 text-sm text-slate-600">
              Track your recent purchases and download receipts.
            </p>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {hasOrders ? `${orders.length} orders` : "No orders yet"}
          </div>
        </div>
      </div>

      {!hasOrders && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <NoData />
        </div>
      )}

      {hasOrders && (
        <div className="mt-8 grid gap-6">
          {orders.map((order, index) => {
            const image = order?.product_details?.image?.[0]
            const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""
            return (
              <div
                key={order._id + index + "order"}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order</p>
                    <p className="text-sm font-semibold text-slate-900">{order?.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      {DisplayPriceInRupees(order?.totalAmt || 0)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
                    {image ? (
                      <img src={image} alt={order?.product_details?.name || "Product"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-slate-900">
                      {order?.product_details?.name || "Item"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        {order?.payment_status || "Pending"}
                      </span>
                      {createdAt && <span>Placed on {createdAt}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadReceipt(order)}
                    className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Download receipt
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MyOrders