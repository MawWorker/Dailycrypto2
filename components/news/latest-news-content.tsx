"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Filter, Grid3x3 as Grid3X3, List, Search, Clock, User, Eye, Heart, MessageCircle, Share2, Bookmark, TrendingUp, TrendingDown, Zap, Star, Tag, ChevronRight, RefreshCw, Flame, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ClientRelativeTime } from '@/components/ui/client-relative-time';
import { ClientStaticDateFormatter } from '@/components/ui/client-static-date-formatter';
import { getLatestNewsPosts, SanityNewsPost, getImageUrl } from '@/lib/sanity';

type ViewMode = 'magazine' | 'grid' | 'list';

export function LatestNewsContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('magazine');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<SanityNewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch articles from Sanity
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const posts = await getLatestNewsPosts(50);
        setArticles(posts);
        setLastUpdated(new Date());
      } catch (error) {
        console.warn('Failed to fetch articles:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const posts = await getLatestNewsPosts(50);
      setArticles(posts);
      setLastUpdated(new Date());
    } catch (error) {
      console.warn('Failed to refresh articles:', error);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categoryName?.toLowerCase() || '';
    if (category.includes('bitcoin')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
    if (category.includes('altcoin')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    if (category.includes('market')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (category.includes('technology') || category.includes('tech')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (category.includes('defi')) return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
    if (category.includes('gaming')) return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
    if (category.includes('mining')) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (category.includes('security')) return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-text-secondary)]">Loading latest news...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Articles Yet</h3>
        <p className="text-[var(--color-text-secondary)]">
          Publish articles in Sanity Studio to display them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)]">
            Latest Crypto News
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[var(--color-primary-brand)]">
              LIVE
            </span>
            <Badge variant="secondary" className="rounded-xl">
              {articles.length} stories
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>

          <span className="text-xs text-[var(--color-text-secondary)]">
            Updated: {lastUpdated ? (
              <ClientStaticDateFormatter date={lastUpdated} format="time" />
            ) : (
              'Loading...'
            )}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Magazine View */}
        {viewMode === 'magazine' && (
          <div className="space-y-8">
            {/* Hero Article */}
            {articles.length > 0 && (
              <Link href={`/news/${articles[0].slug.current}`}>
                <Card className="group overflow-hidden rounded-3xl bg-[var(--color-surface)] hover:shadow-2xl transition-all duration-500 border border-[var(--color-muted-subtle)]">
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <Image
                      src={articles[0].coverImage ? getImageUrl(articles[0].coverImage, 1600, 900) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1600'}
                      alt={articles[0].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Badges */}
                    <div className="absolute top-6 left-6 flex items-center space-x-3">
                      {articles[0].featured && (
                        <Badge className="bg-[var(--color-primary-brand)] text-white shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge className={cn("shadow-lg", getCategoryColor(articles[0].category?.name || ''))}>
                        {articles[0].category?.name || 'News'}
                      </Badge>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-[var(--font-display)] leading-tight">
                        {articles[0].title}
                      </h1>
                      <p className="text-white/90 text-lg mb-6 line-clamp-2 leading-relaxed">
                        {articles[0].description || articles[0].excerpt}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center space-x-4 text-white/80">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span className="text-sm font-medium">{articles[0].author?.name || 'DailyCrypto'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            <ClientRelativeTime date={articles[0].datePublished} />
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{articles[0].readingTime || 5} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Secondary Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1, 7).map((article) => (
                <Link key={article._id} href={`/news/${article.slug.current}`}>
                  <Card className="group overflow-hidden rounded-2xl bg-[var(--color-surface)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[var(--color-muted-subtle)] h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={article.coverImage ? getImageUrl(article.coverImage, 800, 500) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={cn("shadow-lg text-xs", getCategoryColor(article.category?.name || ''))}>
                          {article.category?.name || 'News'}
                        </Badge>
                      </div>

                      {/* Featured Indicator */}
                      {article.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-yellow-500 text-white shadow-lg text-xs">
                            <Star className="h-3 w-3" />
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-[var(--color-primary-brand)] transition-colors font-[var(--font-display)] leading-tight">
                        {article.title}
                      </h3>

                      <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                        {article.description || article.excerpt}
                      </p>

                      {/* Article Footer */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{article.author?.name || 'DailyCrypto'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <ClientRelativeTime date={article.datePublished} />
                            </div>
                          </div>
                          <span className="font-medium">{article.readingTime || 5} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Remaining Articles in Compact Format */}
            {articles.length > 7 && (
              <div className="space-y-4">
                <Separator />
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)] flex items-center space-x-2">
                  <Newspaper className="h-6 w-6 text-[var(--color-primary-brand)]" />
                  <span>More Stories</span>
                </h2>

                <div className="grid gap-4">
                  {articles.slice(7).map((article) => (
                    <Link key={article._id} href={`/news/${article.slug.current}`}>
                      <Card className="group overflow-hidden rounded-xl bg-[var(--color-surface)] hover:shadow-lg transition-all duration-300 border border-[var(--color-muted-subtle)]">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Thumbnail */}
                            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={article.coverImage ? getImageUrl(article.coverImage, 160, 160) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=160'}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="80px"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge className={cn("text-xs", getCategoryColor(article.category?.name || ''))}>
                                  {article.category?.name || 'News'}
                                </Badge>
                                {article.featured && (
                                  <Badge className="bg-yellow-500 text-white text-xs">
                                    <Star className="h-3 w-3" />
                                  </Badge>
                                )}
                              </div>

                              <h3 className="font-semibold text-base text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary-brand)] transition-colors font-[var(--font-display)]">
                                {article.title}
                              </h3>

                              <p className="text-[var(--color-text-secondary)] text-sm line-clamp-1">
                                {article.description || article.excerpt}
                              </p>

                              <div className="flex items-center space-x-3 text-xs text-[var(--color-text-secondary)]">
                                <span>{article.author?.name || 'DailyCrypto'}</span>
                                <span>•</span>
                                <span>
                                  <ClientRelativeTime date={article.datePublished} />
                                </span>
                                <span>•</span>
                                <span>{article.readingTime || 5} min</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article._id} href={`/news/${article.slug.current}`}>
                <Card className="group overflow-hidden rounded-2xl bg-[var(--color-surface)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[var(--color-muted-subtle)] h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.coverImage ? getImageUrl(article.coverImage, 800, 500) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <Badge className={cn("shadow-lg text-xs", getCategoryColor(article.category?.name || ''))}>
                        {article.category?.name || 'News'}
                      </Badge>
                      {article.featured && (
                        <Badge className="bg-yellow-500 text-white shadow-lg text-xs">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-[var(--color-primary-brand)] transition-colors font-[var(--font-display)] leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                      {article.description || article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center space-x-3">
                        <span>{article.author?.name || 'DailyCrypto'}</span>
                        <span>•</span>
                        <span>
                          <ClientRelativeTime date={article.datePublished} />
                        </span>
                      </div>
                      <span className="font-medium">{article.readingTime || 5} min</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <Link key={article._id} href={`/news/${article.slug.current}`}>
                <Card className="group overflow-hidden rounded-xl bg-[var(--color-surface)] hover:shadow-lg transition-all duration-300 border border-[var(--color-muted-subtle)]">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Article Number & Thumbnail */}
                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-[var(--color-primary-brand)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="relative w-20 h-20 overflow-hidden rounded-lg">
                          <Image
                            src={article.coverImage ? getImageUrl(article.coverImage, 160, 160) : 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=160'}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="80px"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={cn("text-xs", getCategoryColor(article.category?.name || ''))}>
                            {article.category?.name || 'News'}
                          </Badge>
                          {article.featured && (
                            <Badge className="bg-yellow-500 text-white text-xs">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            <ClientRelativeTime date={article.datePublished} />
                          </span>
                        </div>

                        <h3 className="font-bold text-xl text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary-brand)] transition-colors font-[var(--font-display)]">
                          {article.title}
                        </h3>

                        <p className="text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                          {article.description || article.excerpt}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-[var(--color-text-secondary)]">
                          <span>{article.author?.name || 'DailyCrypto'}</span>
                          <span>•</span>
                          <span>{article.readingTime || 5} min read</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <Card className="rounded-2xl bg-gradient-to-r from-[var(--color-primary-brand)]/5 to-[var(--color-primary-brand)]/10 border border-[var(--color-primary-brand)]/20 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <Zap className="h-12 w-12 mx-auto text-[var(--color-primary-brand)]" />
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-display)]">
            Stay Updated with More News
          </h3>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Get the latest cryptocurrency news delivered to your inbox. Join thousands of readers staying informed about the crypto market.
          </p>

          <Button
            className="rounded-xl bg-[var(--color-primary-brand)] hover:bg-[var(--color-primary-brand)]/90 text-white"
            asChild
          >
            <Link href="/newsletter">
              Subscribe to Newsletter
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
