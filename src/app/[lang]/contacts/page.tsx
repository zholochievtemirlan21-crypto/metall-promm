import { Site } from '@/components/site';
import { copy, type Lang } from '@/lib/content';
import type { Metadata } from 'next';
export async function generateMetadata({params}:{params:Promise<{lang:Lang}>}):Promise<Metadata>{const {lang}=await params;return {title:copy[lang].nav[4],description:copy[lang].footerText,alternates:{canonical:`/${lang}/contacts`,languages:{ru:'/ru/contacts',ky:'/ky/contacts'}}};}
export default async function Page({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return <Site lang={lang} page="contacts"/>;}
