import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_DESCRIPTIONS = {
  '/': 'Discover fresh organic vegetables, fruits, and dairy directly from local verified farmers in your city. Delivered in hours.',
  '/products': 'Browse and buy farm-fresh organic produce, seasonal fruits, and dairy directly from local farms.',
  '/checkout': 'Secure checkout for your fresh farm produce order. Direct farm-to-table delivery.',
  '/customer/orders': 'Track your live farm orders, harvest updates, and delivery timelines in real-time.',
  '/farmer': 'Manage your farm inventory, harvest batches, active customer orders, and farm profile.',
  '/delivery': 'Delivery partner dashboard for route dispatch and fresh farm order fulfillment.',
  '/admin': 'Admin portal for platform verification, farmer approvals, and order monitoring.',
  '/404': 'Page not found — explore fresh farm produce on LocalFarm.',
  '/unauthorized': 'Access restricted — please log in to access this page on LocalFarm.'
};

const ROUTE_TITLES = {
  '/': 'LocalFarm — Fresh Organic Produce from Local Farmers',
  '/products': 'Fresh Local Produce — LocalFarm',
  '/checkout': 'Checkout — LocalFarm',
  '/customer': 'Customer Marketplace & Basket — LocalFarm',
  '/customer/orders': 'Track Orders & Live Deliveries — LocalFarm',
  '/customer/wishlist': 'My Wishlist — LocalFarm',
  '/customer/profile': 'Account Settings — LocalFarm',
  '/farmer': 'Farmer Portal & Crop Management — LocalFarm',
  '/delivery': 'Delivery Partner Logistics — LocalFarm',
  '/admin': 'Admin Platform Control — LocalFarm',
  '/404': '404 Page Not Found — LocalFarm',
  '/unauthorized': '403 Access Restricted — LocalFarm'
};

const setMetaTag = (selector, attribute, value) => {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [attrName, attrVal] = selector.replace(/[\[\]"]/g, '').split('=');
    if (attrName && attrVal) {
      element.setAttribute(attrName, attrVal);
      document.head.appendChild(element);
    }
  }
  element.setAttribute(attribute, value);
};

export const SEOHead = ({ title, description, ogImage, canonicalUrl }) => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.toLowerCase();
    const finalTitle = title || ROUTE_TITLES[currentPath] || 'LocalFarm — Farm-to-Table Marketplace';
    const finalDescription = description || DEFAULT_DESCRIPTIONS[currentPath] || 'Hyper-local farm-to-table marketplace connecting consumers with local farmers.';

    document.title = finalTitle;

    // Standard description
    setMetaTag('meta[name="description"]', 'content', finalDescription);

    // OpenGraph meta tags
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', finalDescription);
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'content', ogImage);
    }

    // Twitter meta tags
    setMetaTag('meta[name="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', finalDescription);
    if (ogImage) {
      setMetaTag('meta[name="twitter:image"]', 'content', ogImage);
    }

    // Canonical link
    if (canonicalUrl || typeof window !== 'undefined') {
      const canonical = canonicalUrl || window.location.href;
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Scroll to top on route change for smooth user experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, title, description, ogImage, canonicalUrl]);

  return null;
};

export default SEOHead;

