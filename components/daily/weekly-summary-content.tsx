"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react';

export function WeeklySummaryContent() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          <Calendar className="h-4 w-4 mr-2" />
          Weekly Crypto Summary
        </div>
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
          Complete Week Recap
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          A comprehensive weekly summary of cryptocurrency news, market updates, and developments
        </p>
      </div>

      <Card className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
        <CardContent className="p-8 text-center space-y-4">
          <TrendingUp className="h-16 w-16 mx-auto text-blue-500" />
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Coming Soon
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Weekly summaries are being prepared. Check back soon for comprehensive weekly recaps of all crypto news and market developments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild>
              <Link href="/news/latest">
                View Latest News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/daily/today">
                Today's Recap
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="rounded-xl hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg">Weekly Archives</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Access past weekly summaries and track market trends over time.
            </p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/daily/archives">
                Browse Archives →
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg">Market Outlook</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Get detailed market analysis and future predictions.
            </p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/daily/outlook">
                View Outlook →
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-lg">Daily Updates</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Stay current with today's most important crypto news.
            </p>
            <Button variant="link" className="px-0" asChild>
              <Link href="/daily/today">
                Today's Recap →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
