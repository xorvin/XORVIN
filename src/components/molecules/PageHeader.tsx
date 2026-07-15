import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-white/40 mb-3">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.label}>
                {bc.href ? (
                  <Link to={bc.href} className="hover:text-xorvin-accent transition-colors">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{bc.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold font-space-grotesk text-white">{title}</h1>
        {subtitle && <p className="text-white/60 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
