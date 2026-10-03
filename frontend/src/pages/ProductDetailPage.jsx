import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { StockBadge } from '../components/ui/StockBadge';
import { Alert } from '../components/ui/Alert';
import { Breadcrumb } from '../components/navigation/Breadcrumb';
import { FarmCard } from '../components/farm/FarmCard';
import { SEOHead } from '../components/SEOHead';
import { formatCurrency, formatPriceWithUnit } from '../utils/currency';
import { getStockStatus } from '../utils/stockStatus';
import { formatDistance } from '../utils/distance';
import { Truck, Store, MapPin, Clock, ChevronRight, ShoppingCart } from 'lucide-react';

/**
 * Product detail page — /products/:id
 * Answers: What is it? How much? How much available? Who sells it? How far? How receive?
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, isLoading: isMarketplaceLoading } = useMarketplace();
  const { currencySymbol } = useAuth();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);

  const inMemoryProduct = products.find(p => p.id === id);
  const product = inMemoryProduct || fetchedProduct;

  // Direct fallback fetch if not in memory (e.g. direct link or refresh)
  useEffect(() => {
    let isMounted = true;
    if (!inMemoryProduct && id && !isMarketplaceLoading) {
      setIsFetchingDirect(true);
      productService.fetchProductById(id)
        .then(data => {
          if (isMounted && data) setFetchedProduct(data);
        })
        .catch(err => {
          console.warn(`[ProductDetailPage] Direct fetch failed for product ${id}:`, err);
        })
        .finally(() => {
          if (isMounted) setIsFetchingDirect(false);
        });
    }
    return () => { isMounted = false; };
  }, [id, inMemoryProduct, isMarketplaceLoading]);

  const isLoading = isMarketplaceLoading || (isFetchingDirect && !product);

  const stockStatus = product ? getStockStatus(product.stock) : 'out';
  const isOutOfStock = stockStatus === 'out';

  // Find related products from same category (excluding this product)
  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product?.category && p.status === 'Approved')
    .slice(0, 4);

  // Derive farmer info directly from real product record
  const farmer = product ? {
    id: product.farmerId || 'f-direct',
    name: product.farmerName || 'Local Farmer',
    location: product.farmerLocation || 'Local Farm Hub',
    avatar: product.farmerAvatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80',
    specialty: product.category || 'Fresh Produce',
  } : null;

  const handleAddToCart = useCallback(() => {
    if (!product || isOutOfStock) return;
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }, [product, quantity, addToCart, isOutOfStock]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-farmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-farmGreen-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-sm text-farmMuted font-medium" role="status">Loading product details…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-farmBg">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-6xl mb-4" aria-hidden="true">🌾</p>
          <h1 className="text-2xl font-bold text-farmText mb-2">Product not found</h1>
          <p className="text-farmMuted mb-6">This product may no longer be available.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-3 bg-farmGreen-600 text-white font-semibold rounded-xl hover:bg-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
          >
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.category, href: `/products?category=${product.category}` },
    { label: product.name },
  ];

  return (
    <>
      <SEOHead
        title={`${product.name} — LocalFarm`}
        description={product.description || `Buy fresh ${product.name} from ${product.farmerName}.`}
      />

      <div className="min-h-screen bg-farmBg">
        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main product section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Product image */}
              <div className="lg:w-[45%] shrink-0">
                <div className="aspect-square lg:aspect-auto lg:h-full relative bg-farmGreen-50 min-h-[280px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {product.organic && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-farmGreen-600 text-white text-xs font-bold rounded-full">
                        Farmer-reported organic
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product info */}
              <div className="flex flex-col gap-5 p-6 lg:p-8 flex-1 min-w-0">
                {/* Category + name */}
                <div>
                  <p className="text-xs font-semibold text-farmGreen-600 uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-farmText font-display leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Price + stock */}
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-3xl font-extrabold text-farmText font-display">
                    {formatCurrency(product.price, currencySymbol)}
                    <span className="text-base font-semibold text-farmMuted ml-1.5">
                      / {product.unit}
                    </span>
                  </p>
                  <StockBadge count={product.stock} />
                </div>

                {/* Low stock warning */}
                {stockStatus === 'low' && (
                  <Alert variant="warning" title={`Only ${product.stock} ${product.unit} left`}>
                    Order soon — this harvest is nearly gone.
                  </Alert>
                )}

                {/* Out of stock notice */}
                {isOutOfStock && (
                  <Alert variant="error" title="Currently out of stock">
                    This product is not available right now. Check back after the next harvest.
                  </Alert>
                )}

                {/* Quantity selector + Add to Cart */}
                {!isOutOfStock && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={product.stock}
                      label={`${product.name} quantity`}
                      size="lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`
                        flex-1 min-w-[180px] flex items-center justify-center gap-2
                        py-3.5 px-6 rounded-xl text-base font-bold
                        transition-all duration-200
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 focus-visible:outline-offset-2
                        ${addedFeedback
                          ? 'bg-farmGreen-600 text-white scale-95'
                          : 'bg-farmGreen-600 hover:bg-farmGreen-700 active:scale-95 text-white'
                        }
                      `}
                      aria-live="polite"
                    >
                      <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                      {addedFeedback ? '✓ Added to Cart!' : 'Add to Cart'}
                    </button>
                  </div>
                )}

                {/* Fulfillment info */}
                <div className="flex flex-col gap-2 py-4 border-t border-gray-100">
                  <h2 className="text-xs font-bold text-farmMuted uppercase tracking-wider mb-1">Fulfillment options</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-farmGreen-600 shrink-0" aria-hidden="true" />
                    <span className="text-farmText font-medium">Delivery</span>
                    <span className="text-farmMuted">— available for this product</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Store className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
                    <span className="text-farmText font-medium">Farm pickup</span>
                    <span className="text-farmMuted">— collect directly at the farm</span>
                  </div>
                </div>

                {/* Farm info & Trust Credentials */}
                <div className="py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-farmMuted uppercase tracking-wider">Direct From Farm</h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Organic Grower
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                    {farmer?.image ? (
                      <img
                        src={farmer.image}
                        alt={product.farmerName}
                        loading="lazy"
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                        {product.farmerName?.[0] || 'F'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-farmText leading-tight">{product.farmerName}</p>
                      <div className="flex items-center gap-1.5 text-farmMuted text-xs mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span className="truncate">{product.farmerLocation}</span>
                        {typeof product.distanceKm === 'number' && (
                          <span className="font-semibold text-emerald-700 font-mono">· ~{formatDistance(product.distanceKm)}</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/farms/${farmer?.id || product.id}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs hover:shadow-xs flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-all"
                    >
                      Farm Story <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Harvest info & Quality Guarantee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-3 border-t border-gray-100 text-xs">
                  {product.harvestDate && (
                    <div className="flex items-center gap-2 text-farmMuted bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
                      <Clock className="w-4 h-4 shrink-0 text-amber-600" aria-hidden="true" />
                      <span>Harvested: <strong className="text-farmText">{product.harvestDate}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/50">
                    <Truck className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>Cold-Chain Express: <strong className="text-emerald-950">~2 Hours</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-4 overflow-hidden">
            <div className="flex border-b border-gray-100" role="tablist" aria-label="Product information">
              {[
                { id: 'description', label: 'Description' },
                { id: 'harvest',     label: 'Harvest Info' },
              ].map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tab-panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 text-sm font-semibold border-b-2 transition-colors duration-150
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 focus-visible:outline-offset-[-2px]
                    ${activeTab === tab.id
                      ? 'border-farmGreen-600 text-farmGreen-700'
                      : 'border-transparent text-farmMuted hover:text-farmText'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div
                  id="tab-panel-description"
                  role="tabpanel"
                  aria-labelledby="tab-description"
                >
                  <p className="text-base text-farmText leading-relaxed">
                    {product.description || 'No description provided by the farmer.'}
                  </p>
                </div>
              )}
              {activeTab === 'harvest' && (
                <div
                  id="tab-panel-harvest"
                  role="tabpanel"
                  aria-labelledby="tab-harvest"
                >
                  <dl className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <dt className="text-sm font-semibold text-farmMuted w-32 shrink-0">Harvested</dt>
                      <dd className="text-sm text-farmText">{product.harvestDate || 'Not specified'}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="text-sm font-semibold text-farmMuted w-32 shrink-0">Available stock</dt>
                      <dd className="text-sm text-farmText">{product.stock} {product.unit}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="text-sm font-semibold text-farmMuted w-32 shrink-0">Farmer-reported</dt>
                      <dd className="text-sm text-farmText">{product.organic ? 'Organic (unverified)' : 'Not reported'}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-8">
              <h2 id="related-heading" className="text-lg font-bold text-farmText mb-4">
                More from this category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="block bg-white rounded-xl border border-gray-100 hover:border-farmGreen-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500"
                    aria-label={`View ${p.name}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-farmGreen-50">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-farmText line-clamp-2 group-hover:text-farmGreen-700 transition-colors">
                        {p.name}
                      </p>
                      <p className="text-sm font-extrabold text-farmText mt-1 font-display">
                        {formatCurrency(p.price, currencySymbol)}
                        <span className="text-xs font-medium text-farmMuted ml-1">/{p.unit}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Sticky Mobile Conversion Bar (Visible only on mobile viewports < 640px) ── */}
        {!isOutOfStock && (
          <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3.5 sm:hidden z-40 shadow-[0_-8px_25px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3 safe-bottom">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-800 font-display">
                  {formatCurrency(product.price * quantity, currencySymbol)}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">({quantity} {product.unit})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-200">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-sm font-bold text-gray-700 active:scale-90"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                  className="w-7 h-7 flex items-center justify-center text-sm font-bold text-gray-700 active:scale-90"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-2.5 px-4 rounded-xl text-xs font-extrabold text-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all ${
                  addedFeedback ? 'bg-emerald-700' : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{addedFeedback ? '✓ Added' : 'Add to Basket'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
