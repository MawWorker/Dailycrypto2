"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Star,
  Clock,
  User,
  Crown,
  Sparkles,
  Zap,
  Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientRelativeTime } from '@/components/ui/client-relative-time';
import { getNewsPosts, SanityNewsPost, getImageUrl } from '@/lib/sanity';

export function FeaturesNewsContent() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [articles, setArticles] = useState<SanityNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const posts = await getNewsPosts(50, true);
        setArticles(posts);
        setLastUpdated(new Date());
      } catch (error) {
        console.warn('Failed to fetch featured articles:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  const getCategoryColor = (categoryName: string) => {
    const category = categoryName?.toLowerCase() || '';
    if (category.includes('bitcoin')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
    if (category.includes('altcoin')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    if (category.includes('market')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (category.includes('technology') || category.includes('tech')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (category.includes('defi')) return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-text-secondary)]">Loading featured stories...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl shadow-lg w-fit mx-auto mb-4">
          <Star className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Featured Stories Yet</h3>
        <p className="text-[var(--color-text-secondary)]">
          Mark articles as "Featured" in Sanity Studio to display them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2 text-sm text-[var(--color-text-secondary)]">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>
            Premium Featured Content • Updated: {lastUpdated ? lastUpdated.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila' }) : 'Loading...'} Manila Time
          </span>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="rounded-xl">
            <Star className="h-3 w-3 mr-1 text-yellow-500" />
            {articles.length} Featured Stories
          </Badge>
        </div>
      </div>

      {/* Hero Featured Article */}
      {articles.length > 0 && (
        <Card className="rounded-2xl bg-[var(--color-surface)] border-2 border-yellow-500/20 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] overflow-hidden">
                <Image
                  src={articles[0].coverImage ? getImageUrl(articles[0].coverImage, 1200, 900) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                  alt={articles[0].title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Premium Badges */}
                <div className="absolute top-6 left-6 flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg">
                    <Crown className="h-3 w-3 mr-1" />
                    Featured Story
                  </Badge>
                  <Badge className={cn("shadow-lg", getCategoryColor(articles[0].category?.name || ''))}>
                    {articles[0].category?.name || 'News'}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)] leading-tight">
                    {articles[0].title}
                  </h1>

                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    {articles[0].description || articles[0].excerpt}
                  </p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{articles[0].author?.name || 'DailyCrypto'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <ClientRelativeTime date={articles[0].datePublished} />
                  </div>
                  <span>•</span>
                  <span>{articles[0].readingTime || 5} min read</span>
                </div>

                {/* CTA Button */}
                <div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg"
                    asChild
                  >
                    <Link href={`/news/${articles[0].slug.current}`}>
                      Read Full Story
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(1).map((article) => (
          <Link key={article._id} href={`/news/${article.slug.current}`}>
            <Card className="group overflow-hidden rounded-2xl bg-[var(--color-surface)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-yellow-500/10 hover:border-yellow-500/30 h-full">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.coverImage ? getImageUrl(article.coverImage, 800, 500) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg text-xs">
                    <Star className="h-3 w-3" />
                  </Badge>
                  <Badge className={cn("shadow-lg text-xs", getCategoryColor(article.category?.name || ''))}>
                    {article.category?.name || 'News'}
                  </Badge>
                </div>

                {/* Premium Badge if exclusive */}
                {article.exclusive && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg text-xs">
                      Exclusive
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[var(--color-primary-brand)] transition-colors font-[var(--font-display)] leading-tight">
                    {article.title}
                  </h3>

                  <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2 leading-relaxed">
                    {article.description || article.excerpt}
                  </p>
                </div>

                {/* Article Footer */}
                <div className="mt-4 pt-4 border-t border-[var(--color-muted-subtle)]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{article.author?.name || 'DailyCrypto'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <ClientRelativeTime date={article.datePublished} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Premium Subscription CTA */}
      <Card className="rounded-2xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-2 border-yellow-500/20 shadow-xl overflow-hidden">
        <CardContent className="p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-medium shadow-lg">
                <Crown className="h-3 w-3 mr-1" />
                Premium Access
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)]">
                Get Exclusive Featured Stories
              </h2>

              <p className="text-lg text-[var(--color-text-secondary)]">
                Subscribe to our newsletter and get access to premium featured stories, in-depth analysis, and exclusive interviews delivered to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg"
                  asChild
                >
                  <Link href="/newsletter">
                    Subscribe Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-500/50 hover:bg-yellow-500/10"
                  asChild
                >
                  <Link href="/news/latest">
                    Browse All News
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-3xl opacity-30" />
                <div className="relative p-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full">
                  <Zap className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="text-center text-sm text-[var(--color-text-secondary)] space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Newspaper className="h-4 w-4" />
          <span>All featured stories are curated by our editorial team</span>
        </div>
        <p>Updated daily with the most important crypto news and analysis</p>
      </div>
    </div>
  );
}
