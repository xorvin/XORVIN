import React from 'react';
import { SEO } from '@/components/atoms/SEO';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '@/services/gallery.service';
import { Skeleton } from '@/components/atoms/Skeleton';
import { motion } from 'framer-motion';

export default function GalleryPage() {
  const { data: galleryItems = [], isLoading, error } = useQuery({
    queryKey: ['gallery'],
    queryFn: galleryService.getGalleryItems
  });
  return (
    <>
      <SEO 
        title="Community Gallery" 
        description="Moments captured from our hackathons, meetups, and conferences around the globe."
      />

      <section className="pt-32 pb-20 bg-xorvin-dark relative">
        <div className="container-xorvin">
          <div className="text-center mb-12">
            <span className="badge-primary mb-4 inline-block">📸 Memories</span>
            <h1 className="heading-lg text-white mb-4">Xorvin <span className="gradient-text">Gallery</span></h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Moments captured from our hackathons, meetups, and conferences around the globe.
            </p>
          </div>

          {isLoading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl break-inside-avoid" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 px-6 glass-card rounded-3xl border border-white/10 max-w-2xl mx-auto text-white/50">
              Unable to load gallery.
            </div>
          ) : galleryItems.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group rounded-2xl overflow-hidden break-inside-avoid"
                >
                  <img src={item.url} alt={item.caption} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-xorvin-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-medium">{item.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 glass-card rounded-3xl border border-white/10 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold font-space-grotesk text-white mb-3">Event Photography Coming Soon</h3>
              <p className="text-white/60 font-inter mb-8">
                We are busy preparing for our first events. Once our inaugural competitions conclude, this space will be updated with live photographs and community memories.
              </p>
              <div className="rounded-2xl overflow-hidden relative mx-auto border border-white/10 shadow-lg inline-block bg-white/5 p-8">
                 <img src="/logo.png" alt="Xorvin Tech Challenge 2026 Poster" className="max-w-full h-auto w-[200px]" />
                 <div className="mt-4 text-center">
                    <p className="text-white font-medium">Xorvin Tech Challenge 2026</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
