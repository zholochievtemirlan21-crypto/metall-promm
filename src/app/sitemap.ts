import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
import { pagePaths } from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{const origin=siteOrigin();if(!origin)return [];return (['ru','ky'] as const).flatMap(lang=>pagePaths.map(path=>({url:`${origin}/${lang}${path}`,alternates:{languages:{ru:`${origin}/ru${path}`,ky:`${origin}/ky${path}`}}})));}
