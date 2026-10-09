import { Site } from '@/components/site';
import type { Lang } from '@/lib/content';
import type { Metadata } from 'next';
export async function generateMetadata({params}:{params:Promise<{lang:Lang}>}):Promise<Metadata>{const {lang}=await params;return {title:{absolute:lang==='ru'?'МЕТАЛЛ ПРОММ — Металл для ваших проектов':'МЕТАЛЛ ПРОММ — Долбооруңуз үчүн металл'},description:lang==='ru'?'Металлопрокат для строительства и производства. Ознакомьтесь с демонстрационным каталогом и подготовьте запрос.':'Курулуш жана өндүрүш үчүн металл прокаты. Демонстрациялык каталогду карап, өтүнүч даярдаңыз.',alternates:{canonical:`/${lang}`,languages:{ru:'/ru',ky:'/ky'}}};}
export default async function Page({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return <Site lang={lang} page="home"/>;}
