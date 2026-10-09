import { Site } from '@/components/site';
import { copy, type Lang } from '@/lib/content';
import type { Metadata } from 'next';
export async function generateMetadata({params}:{params:Promise<{lang:Lang}>}):Promise<Metadata>{const {lang}=await params;return {title:copy[lang].nav[1],description:copy[lang].catalogMeta,alternates:{canonical:`/${lang}/catalog`,languages:{ru:'/ru/catalog',ky:'/ky/catalog'}}};}
export default async function Page({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return <Site lang={lang} page="catalog"/>;}
