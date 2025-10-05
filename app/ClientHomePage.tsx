"use client"

import { useEffect, useState } from 'react';
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import HeroNewsSection from "@/components/crypto/hero-news-section";
import MarketTicker from "@/components/crypto/market-ticker";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import { ModernNewsGrid } from "@/components/home/modern-news-grid";
import { MarketInsightsSection } from "@/components/home/market-insights-section";
import { NewsletterCTASection } from "@/components/home/newsletter-cta-section";
import { TrendingTopicsSection } from "@/components/home/trending-topics-section";
import { QuickStatsSection } from "@/components/home/quick-stats-section";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { getNewsPosts, SanityNewsPost, getImageUrl } from "@/lib/sanity";

export default function ClientHomePage() {
  const { data: priceTickers } = useCryptoPrices();
  const [newsPosts, setNewsPosts] = useState<SanityNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch news posts from Sanity - always fetch latest by datePublished
  useEffect(() => {
    const fetchNewsPosts = async () => {
      try {
        const posts = await getNewsPosts(50); // Get latest 50 posts sorted by datePublished DESC
        setNewsPosts(posts);
      } catch (error) {
        console.warn('Sanity data unavailable, using fallback:', error);
        // Fallback to empty array if Sanity fails
        setNewsPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsPosts();
  }, []);
  // Fallback articles for when Sanity has no data
  const fallbackArticles = [
    {
      _id: '1',
      title: 'Bitcoin Reaches New All-Time High',
      description: 'Bitcoin continues its impressive rally, breaking through previous resistance levels.',
      author: { name: 'DailyCrypto Team' },
      category: { name: 'Markets' },
      datePublished: new Date().toISOString(),
      coverImage: null,
      slug: { current: 'bitcoin-reaches-new-high' }
    },
    {
      _id: '2',
      title: 'Ethereum 2.0 Staking Surpasses 10 Million ETH',
      description: 'The Ethereum network sees record participation in staking.',
      author: { name: 'DailyCrypto Team' },
      category: { name: 'Technology' },
      datePublished: new Date().toISOString(),
      coverImage: null,
      slug: { current: 'ethereum-staking-milestone' }
    },
    {
      _id: '3',
      title: 'Philippines SEC Issues New Crypto Guidelines',
      description: 'Regulatory clarity brings confidence to the Philippine crypto market.',
      author: { name: 'DailyCrypto Team' },
      category: { name: 'Regulation' },
      datePublished: new Date().toISOString(),
      coverImage: null,
      slug: { current: 'philippines-crypto-guidelines' }
    }
  ];

  // Use Sanity data or fallback to mock data
  const articlesToUse = newsPosts.length > 0 ? newsPosts : fallbackArticles;

  // CONTENT FLOW: Always use newest articles regardless of featured status
  // #1 newest = Big Hero, #2-4 newest = Smaller Hero sections
  const featuredArticle = articlesToUse[0]; // Newest article goes to big hero
  const secondaryArticles = articlesToUse.slice(1, 4); // Next 3 articles go to smaller hero

  // Transform articles to match hero section format
  const transformedFeaturedArticle = featuredArticle ? {
    id: featuredArticle._id,
    title: featuredArticle.title,
    excerpt: featuredArticle.description,
    author: featuredArticle.author?.name || 'DailyCrypto Team',
    publishedAt: featuredArticle.datePublished,
    category: featuredArticle.category?.name || 'News',
    imageUrl: featuredArticle.coverImage ? getImageUrl(featuredArticle.coverImage, 800, 600) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: featuredArticle.slug?.current || ''
  } : null;

  const transformedSecondaryArticles = secondaryArticles.map((article: any) => ({
    id: article._id,
    title: article.title,
    excerpt: article.description,
    author: article.author?.name || 'DailyCrypto Team',
    publishedAt: article.datePublished,
    category: article.category?.name || 'News',
    imageUrl: article.coverImage ? getImageUrl(article.coverImage, 600, 400) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: article.slug?.current || ''
  }));

  // Transform crypto data to match hero section format
  const heroTickers = priceTickers.slice(0, 6).map((ticker) => ({
    symbol: ticker.symbol,
    name: ticker.name,
    price: ticker.price,
    change: ticker.change24h,
    changePercent: ticker.changePercent24h,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-background-site)]">
      {/* Navigation */}
      <AnimatedIndicatorNavbar />
      
      {/* Full-width Price Ticker */}
      <MarketTicker />
      
      {/* Hero News Section with Enhanced Spacing */}
      <section className="w-full bg-gradient-to-b from-[var(--color-background-site)] to-[var(--color-surface)] py-4">
        {isLoading ? (
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--color-text-secondary)]">Loading latest news...</p>
            </div>
          </div>
        ) : (
          <HeroNewsSection
            featuredArticle={transformedFeaturedArticle!}
            secondaryArticles={transformedSecondaryArticles}
            priceTickers={heroTickers}
            sanityArticles={newsPosts}
          />
        )}
      </section>
      
      {/* Quick Market Stats */}
      <section className="w-full bg-[var(--color-surface)] py-8">
        <QuickStatsSection />
      </section>
      
      {/* Trending Topics */}
      <section className="w-full bg-[var(--color-background-site)] py-12">
        <TrendingTopicsSection />
      </section>
      
      {/* Modern News Grid */}
      <section className="w-full bg-[var(--color-surface)] py-16">
        <ModernNewsGrid />
      </section>
      
      {/* Market Analysis & Insights */}
      <section className="w-full bg-[var(--color-background-site)] py-16">
        <MarketInsightsSection />
      </section>
      
      {/* Newsletter CTA */}
      <section className="w-full bg-gradient-to-r from-[var(--color-primary-brand)]/5 to-purple-500/5 py-16">
        <NewsletterCTASection />
      </section>
      
      {/* Footer - Full Width */}
      <div className="w-full">
        <NewsletterFooter />
      </div>
    </div>
  );
}