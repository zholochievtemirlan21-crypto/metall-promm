export function siteOrigin():string|undefined {
 const value=process.env.SITE_URL?.trim();
 if(!value)return undefined;
 try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.origin:undefined;}catch{return undefined;}
}
