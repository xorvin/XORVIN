import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function LazyImage({ src, alt, className = '', fallbackSrc = 'https://via.placeholder.com/400x300?text=Xorvin', ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          src={error ? fallbackSrc : src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover ${className}`}
          {...(props as any)}
        />
      )}
    </div>
  );
}
