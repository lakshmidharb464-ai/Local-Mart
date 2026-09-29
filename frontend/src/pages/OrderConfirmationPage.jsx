import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShoppingBag, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { OrderStatusTimeline } from '../components/order/OrderStatusTimeline';

/**
 * Order Confirmation Page — /order-confirmation/:id
 * 
 * Shown immediately after a successful order placement.
 * Reduces post-purchase anxiety by clearly confirming:
 * - Order number
 * - What happens next (status timeline)
 * - How to track (authenticated vs guest)
 * - Path back to shopping
 */
export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const orderData = location.state?.order;
  const fulfillmentType = orderData?.fulfillmentType || 'delivery';

  return (
    <>
      <SEOHead
        title={`Order Confirmed — ${id} — LocalFarm`}
        description="Your LocalFarm order has been confirmed. Track your fresh produce delivery."
      />

      <div className="min-h-screen bg-farmBg">
        {/* Minimal header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/" aria-label="LocalFarm — return to homepage">
              <span className="text-xl font-extrabold text-farmGreen-700 font-display">LocalFarm</span>
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Green top banner */}
            <div className="bg-farmGreen-600 px-6 py-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-extrabold text-white font-display">Order Confirmed!</h1>
              <p className="text-farmGreen-100 text-sm mt-1">
                Thank you for your order. Your fresh produce is on its way.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {/* Order number */}
              <div className="flex items-center justify-between gap-3 bg-farmGreen-50 border border-farmGreen-100 rounded-xl px-4 py-3 mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-farmGreen-600 shrink-0" aria-hidden="true" />
                  <span className="text-sm text-farmMuted font-medium">Order number</span>
                </div>
                <span className="text-base font-extrabold text-farmGreen-800 font-display">{id}</span>
              </div>

              {/* What happens next */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Timeline */}
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-farmText uppercase tracking-wider mb-4">
                    What happens next
                  </h2>
                  <OrderStatusTimeline status="Pending" fulfillmentType={fulfillmentType} />
                </div>

                {/* Info panel */}
                <div className="sm:w-56 shrink-0 flex flex-col gap-4">
                  <div className="bg-farmGold-50 border border-farmGold-100 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-farmGold-800 mb-1">Confirmation email</h3>
                    <p className="text-xs text-farmGold-700 leading-relaxed">
                      We've sent your order details to your email address. Check your inbox for tracking updates.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-blue-800 mb-1">Estimated timing</h3>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      {fulfillmentType === 'pickup'
                        ? 'Pickup orders are typically ready within 2 hours at the designated farm.'
                        : 'Most local farm orders are delivered within 4–6 hours of acceptance.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
                {isAuthenticated ? (
                  <Link
                    to="/customer/orders"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-farmGreen-600 hover:bg-farmGreen-700 text-white font-bold rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                  >
                    <Package className="w-4 h-4" aria-hidden="true" />
                    Track my order
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    to="/customer/orders"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-farmGreen-600 hover:bg-farmGreen-700 text-white font-bold rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                  >
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    Sign in to track orders
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 py-3 px-5 border border-gray-200 bg-white text-farmText font-semibold rounded-xl hover:border-gray-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

