import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SEOHead = () => {
  const location = useLocation();

  useEffect(() => {
    const routeTitles = {
      '/': 'Local Farm Direct — Fresh Organic Produce from Local Farmers',
      '/dashboard': 'Dashboard Portal — Local Farm Direct',
      '/customer': 'Customer Marketplace & Basket — Local Farm Direct',
      '/customer/cart': 'Checkout & Booking — Local Farm Direct',
      '/customer/orders': 'Track Orders & Live Deliveries — Local Farm Direct',
      '/customer/wishlist': 'My Wishlist — Local Farm Direct',
      '/customer/profile': 'Account Settings — Local Farm Direct',
      '/farmer': 'Farmer Portal & Crop Management — Local Farm Direct',
      '/delivery': 'Delivery Partner Logistics — Local Farm Direct',
      '/admin': 'Admin Platform Control — Local Farm Direct',
      '/404': '404 Page Not Found — Local Farm Direct',
      '/unauthorized': '403 Access Restricted — Local Farm Direct'
    };

    const currentPath = location.pathname.toLowerCase();
    const title = routeTitles[currentPath] || 'Local Farm Direct — Farm-to-Table Marketplace';
    document.title = title;

    // Update OpenGraph Meta Title dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    // Scroll to top on route change for smooth user experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
};

export default SEOHead;
