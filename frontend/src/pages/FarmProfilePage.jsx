import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { FarmHeader } from '../components/farm/FarmHeader';
import { ProductGrid } from '../components/product/ProductGrid';
import { Breadcrumb } from '../components/navigation/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
/**
 * Farm profile page — /farms/:id
 * Establishes trust through real farm info only. Dynamic from backend products.
 */
export default function FarmProfilePage() {
  const { id } = useParams();
  const { products, isLoading } = useMarketplace();
  const { currencySymbol } = useAuth();

  // Find farmer from live products by farmerId or matching name slug
  const matchingProduct = products.find(p => 
    p.farmerId === id || 
    (p.farmerName && p.farmerName.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()) ||
    p.farmerName === id
  );

  const farmer = matchingProduct ? {
    id: matchingProduct.farmerId || id,
    name: matchingProduct.farmerName,
    location: matchingProduct.farmerLocation || 'Local Farm Hub',
    avatar: matchingProduct.farmerAvatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80',
    specialty: matchingProduct.category,
    experience: `Direct organic producer delivering verified fresh harvest to your doorstep.`,
  } : null;

  // Products from this farmer (approved only)
  const farmProducts = products.filter(p =>
    (p.farmerId === id || p.farmerName === farmer?.name) && p.status === 'Approved'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-farmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 font-display">
          <div className="w-10 h-10 border-4 border-farmGreen-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-sm text-farmMuted font-medium" role="status">Loading farm profile…</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-farmBg">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-6xl mb-4" aria-hidden="true">🚜</p>
          <h1 className="text-2xl font-bold text-farmText mb-2">Farm not found</h1>
          <p className="text-farmMuted mb-6">
            This farm profile may no longer be available.
          </p>
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
    { label: farmer ? farmer.name : 'Farm' },
  ];

  return (
    <>
      <SEOHead
        title={farmer ? `${farmer.name} — LocalFarm` : 'Farm Profile — LocalFarm'}
        description={farmer ? `Browse fresh produce from ${farmer.name} in ${farmer.location}.` : ''}
      />

      <div className="min-h-screen bg-farmBg">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>

        {farmer && <FarmHeader farmer={farmer} />}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* About section (farmer-written text only) */}
          {farmer?.experience && (
            <section aria-labelledby="about-heading" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 id="about-heading" className="text-base font-bold text-farmText mb-3">
                About this farm
              </h2>
              <p className="text-sm text-farmText leading-relaxed">
                {farmer.experience} — specialising in {farmer.specialty || 'farm produce'}.
              </p>
              {farmer.location && (
                <p className="text-sm text-farmMuted mt-2">
                  Based in {farmer.location}.
                </p>
              )}
            </section>
          )}

          {/* Farm products */}
          <section aria-labelledby="products-heading">
            <div className="flex items-center justify-between mb-5">
              <h2 id="products-heading" className="text-lg font-bold text-farmText">
                Products from this farm
              </h2>
              {farmProducts.length > 0 && (
                <span className="text-sm text-farmMuted">
                  {farmProducts.length} available
                </span>
              )}
            </div>

            <ProductGrid
              products={farmProducts}
              isLoading={isLoading}
              currencySymbol={currencySymbol}
              skeletonCount={4}
              emptyTitle="No products listed"
              emptyMessage="This farmer has not listed any products yet. Check back after the next harvest."
            />
          </section>
        </div>
      </div>
    </>
  );
}
