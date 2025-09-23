import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

/**
 *  Sanity Client
 *  Make sure these env vars match the Project ID and Dataset
 *  from https://sanity.io/manage
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uiu9mgqs',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // use today’s date or latest
  useCdn: true,
})

// ---------- Image Helpers ----------
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function getImageUrl(
  image: SanityImageSource,
  width?: number,
  height?: number
): string {
  let b = urlFor(image).auto('format').quality(90)
  if (width) b = b.width(width)
  if (height) b = b.height(height)
  return b.url()
}

export function getResponsiveImageUrls(image: SanityImageSource) {
  return {
    thumbnail: getImageUrl(image, 400, 300),
    medium: getImageUrl(image, 800, 600),
    large: getImageUrl(image, 1200, 900),
    hero: getImageUrl(image, 1600, 900),
    original: urlFor(image).url(),
  }
}

// ---------- Types ----------
export interface SanityNewsPost {
  _id: string
  title: string
  slug: { current: string }
  description: string
  excerpt?: string
  content: any[]
  coverImage: {
    asset: { _ref: string; _type: 'reference' }
    alt?: string
  }
  author: {
    name: string
    bio: string
    avatar: { asset: { _ref: string; _type: 'reference' } }
    role: string
    socials?: { twitter?: string; linkedin?: string }
  }
  category: {
    name: string
    slug: { current: string }
    color?: string
  }
  tags: string[]
  datePublished: string
  dateModified?: string
  readingTime: number
  featured?: boolean
  premium?: boolean
  exclusive?: boolean
  contentType?: string
  impact?: string
  language: string
}

// ---------- GROQ field fragments ----------
const newsPostFields = `
  _id,
  title,
  slug,
  description,
  excerpt,
  coverImage {
    asset->{_id,url},
    alt
  },
  author->{
    name,
    bio,
    avatar{asset->{_id,url}},
    role,
    socials
  },
  category->{
    name,
    slug,
    color
  },
  tags,
  datePublished,
  dateModified,
  readingTime,
  featured,
  premium,
  exclusive,
  contentType,
  impact,
  language
`

const newsPostFieldsWithContent = `
  ${newsPostFields},
  content
`

// ---------- Queries ----------
export async function getNewsPosts(
  limit: number = 50,
  featured?: boolean
): Promise<SanityNewsPost[]> {
  const featuredFilter = featured ? ' && featured == true' : ''
  const query = `*[_type == "newsPost"${featuredFilter}]
                | order(datePublished desc)[0...${limit}] {${newsPostFields}}`
  return (await client.fetch(query)) || []
}

export async function getNewsPostBySlug(
  slug: string
): Promise<SanityNewsPost | null> {
  const query = `*[_type == "newsPost" && slug.current == $slug][0] {${newsPostFieldsWithContent}}`
  return (await client.fetch(query, { slug })) || null
}

export async function getNewsPostsByCategory(
  categorySlug: string,
  limit: number = 20
): Promise<SanityNewsPost[]> {
  const query = `*[_type == "newsPost" && category->slug.current == $categorySlug]
                | order(datePublished desc)[0...${limit}] {${newsPostFields}}`
  return (await client.fetch(query, { categorySlug })) || []
}

export async function getNewsPostsByTag(
  tag: string,
  limit: number = 20
): Promise<SanityNewsPost[]> {
  const query = `*[_type == "newsPost" && $tag in tags]
                | order(datePublished desc)[0...${limit}] {${newsPostFields}}`
  return (await client.fetch(query, { tag })) || []
}

export async function getRelatedNewsPosts(
  currentPostId: string,
  categorySlug: string,
  limit: number = 3
): Promise<SanityNewsPost[]> {
  const query = `*[_type == "newsPost" && _id != $currentPostId
                && category->slug.current == $categorySlug]
                | order(datePublished desc)[0...${limit}] {${newsPostFields}}`
  return (await client.fetch(query, { currentPostId, categorySlug })) || []
}

export async function searchNewsPosts(
  searchTerm: string,
  limit: number = 20
): Promise<SanityNewsPost[]> {
  const query = `*[_type == "newsPost" &&
                (title match $searchTerm + "*" ||
                 description match $searchTerm + "*" ||
                 $searchTerm in tags)]
                | order(datePublished desc)[0...${limit}] {${newsPostFields}}`
  return (await client.fetch(query, { searchTerm })) || []
}

export async function getCategories() {
  return (
    (await client.fetch(`*[_type == "category"] | order(name asc) {
        _id, name, slug, description, color
      }`)) || []
  )
}

export async function getAuthors() {
  return (
    (await client.fetch(`*[_type == "author"] | order(name asc) {
        _id, name, slug, bio,
        avatar{asset->{_id,url}},
        role, socials
      }`)) || []
  )
}
