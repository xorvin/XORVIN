import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_CONFIG } from '@/constants/config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  jsonLd?: Record<string, any>;
}

export function SEO({
  title = APP_CONFIG.name,
  description = APP_CONFIG.description,
  image = '/assets/brand/xorvin-poster.jpg',
  url = APP_CONFIG.url,
  type = 'website',
  author,
  publishedTime,
  jsonLd
}: SEOProps) {
  const fullTitle = title === APP_CONFIG.name ? title : `${title} — ${APP_CONFIG.name}`;

  // Default Organization JSON-LD
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": APP_CONFIG.name,
    "url": APP_CONFIG.url,
    "logo": `${APP_CONFIG.url}/assets/brand/logo.png`,
    "description": APP_CONFIG.description,
    "foundingDate": APP_CONFIG.foundedYear.toString(),
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": APP_CONFIG.country
      }
    },
    "sameAs": Object.values(APP_CONFIG.social)
  };

  const finalJsonLd = jsonLd ? [defaultJsonLd, jsonLd] : defaultJsonLd;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={APP_CONFIG.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article Specifics */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalJsonLd)}
      </script>
    </Helmet>
  );
}
