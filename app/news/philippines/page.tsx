'use client';

import { useEffect, useState } from 'react';
import { AnimatedIndicatorNavbar } from '@/components/navbars/animated-indicator-navbar';
import { NewsletterFooter } from '@/components/footers/newsletter-footer';
import MarketTicker from '@/components/crypto/market-ticker';
import { PhilippinesNewsContent } from '@/components/news/philippines-news-content';
import { getNewsPostsByCategory, SanityNewsPost } from '@/lib/sanity';

export default function PhilippinesNewsPage() {
  const [newsArticles, setNewsArticles] = useState<SanityNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhilippinesNews = async () => {
      try {
        // Fetch articles with category "philippines-crypto-news" slug
        const articles = await getNewsPostsByCategory('philippines-crypto-news', 50);
        setNewsArticles(articles);
      } catch (error) {
        console.warn('Failed to fetch Philippines news:', error);
        setNewsArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhilippinesNews();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background-site)]">
      <AnimatedIndicatorNavbar />
      <MarketTicker />

      <main className="container mx-auto px-4 sm:px-6 max-w-7xl pt-8 pb-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">Loading Philippines news...</p>
          </div>
        ) : (
          <PhilippinesNewsContent sanityArticles={newsArticles} />
        )}
      </main>

      <NewsletterFooter />
    </div>
  );
}
