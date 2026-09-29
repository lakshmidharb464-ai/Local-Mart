import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb navigation component.
 *
 * @param {object} props
 * @param {Array<{label: string, href?: string}>} props.items
 *   Last item is treated as current page (no href required).
 * @param {string} [props.className]
 *
 * @example
 * <Breadcrumb items={[
 *   { label: 'Home', href: '/' },
 *   { label: 'Organic Veggies', href: '/products?category=Organic Veggies' },
 *   { label: 'Tomatoes' },
 * ]} />
 */
export function Breadcrumb({ items = [], className = '' }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-farmMuted/60 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-sm font-semibold text-farmText truncate max-w-[200px]"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href || '/'}
                  className="flex items-center gap-1 text-sm text-farmMuted hover:text-farmGreen-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-farmGreen-500 rounded"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
