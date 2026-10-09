import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteOrigin } from '@/lib/seo';
export const metadata: Metadata = {metadataBase:siteOrigin()?new URL(siteOrigin()!):undefined,title:{default:'МЕТАЛЛ ПРОММ — Металл для ваших проектов',template:'%s | МЕТАЛЛ ПРОММ'},description:'МЕТАЛЛ ПРОММ: металлопрокат для строительства и производства. Демонстрационный каталог и подготовка коммерческого запроса.',robots:{index:true,follow:true},icons:{icon:'/icon.svg'}};
export function generateStaticParams(){return [{lang:'ru'},{lang:'ky'}];}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=='ru'&&lang!=='ky')notFound();return <html lang={lang}><body><a className="skip-link" href="#main-content">{lang==='ru'?'Перейти к содержимому':'Мазмунга өтүү'}</a>{children}</body></html>}
