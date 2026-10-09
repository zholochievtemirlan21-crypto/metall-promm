import { test, expect } from '@playwright/test';

test('all five pages work in both languages with correct document language and no runtime errors', async ({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['ru','ky'])for(const route of ['','/catalog','/about','/services','/contacts']){
  const response=await page.goto(`/${lang}${route}`);expect(response?.status()).toBe(200);await expect(page.locator('html')).toHaveAttribute('lang',lang);await expect(page.locator('main h1')).toBeVisible();expect(await page.title()).toContain('МЕТАЛЛ ПРОММ');
 }
 expect(errors).toEqual([]);
});

test('catalog links, search, filters and empty-state reset work',async({page})=>{
 await page.goto('/ru');await page.getByRole('link',{name:'Металлические трубы',exact:true}).click();await expect(page).toHaveURL(/category=pipes/);await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-info h3')).toHaveText('Металлические трубы');
 await page.getByLabel('Категории',{exact:true}).selectOption('');await expect(page.locator('.product-card')).toHaveCount(7);
 await page.getByRole('textbox',{name:'Поиск по каталогу',exact:true}).fill('арматура');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.getByRole('textbox',{name:'Поиск по каталогу',exact:true}).fill('несуществующий товар');await expect(page.getByRole('heading',{name:'Ничего не найдено'})).toBeVisible();await page.getByRole('button',{name:'Сбросить фильтры',exact:true}).last().click();await expect(page.locator('.product-card')).toHaveCount(7);
 await page.getByLabel('Категории',{exact:true}).selectOption('beams');await page.getByRole('link',{name:'Запросить предложение: Балки'}).click();await expect(page.locator('dialog select')).toHaveValue('beams');
});

test('quote download contains the user request and never sends it to a server',async({page})=>{
 const outgoing:string[]=[];page.on('request',r=>{if(r.method()==='POST')outgoing.push(r.url());});
 await page.goto('/ru');await page.getByRole('button',{name:'Получить предложение',exact:true}).first().click();await expect(page.getByRole('dialog')).toBeVisible();
 const form=page.locator('dialog form');await form.getByLabel('Ваше имя',{exact:true}).fill('Тестовый клиент');await form.getByLabel('Телефон или email',{exact:true}).fill('test@example.com');await form.getByRole('combobox',{name:'Продукция',exact:true}).selectOption('rebar');await form.getByLabel('О вашем проекте',{exact:true}).fill('Арматура для демонстрационного проекта');await form.getByRole('checkbox').check();
 const downloadPromise=page.waitForEvent('download');await form.getByRole('button',{name:'Скачать запрос'}).click();const download=await downloadPromise;expect(download.suggestedFilename()).toBe('metall-promm-request.txt');const stream=await download.createReadStream();const chunks:Buffer[]=[];for await(const chunk of stream!)chunks.push(Buffer.from(chunk));const content=Buffer.concat(chunks).toString('utf-8');expect(content).toContain('Тестовый клиент');expect(content).toContain('Арматура');expect(content).toContain('test@example.com');await expect(form.getByRole('status')).toHaveText(/Заявка не отправлена/);expect(outgoing).toEqual([]);
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('copy works and WhatsApp clearly reports missing contact configuration',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/ru/contacts');await page.getByRole('button',{name:'Написать в WhatsApp',exact:true}).first().click();await expect(page.getByRole('dialog')).toContainText('WhatsApp пока не подключён');await page.getByRole('button',{name:'Закрыть',exact:true}).click();
 const form=page.locator('.contact-form form');await form.getByLabel('Ваше имя',{exact:true}).fill('Тест');await form.getByLabel('Телефон или email',{exact:true}).fill('test@example.com');await form.getByLabel('О вашем проекте',{exact:true}).fill('Нужны трубы');await form.getByRole('checkbox').check();await form.getByRole('button',{name:'Копировать запрос'}).click();await expect(form.getByRole('status')).toContainText('Текст скопирован');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Нужны трубы');
});

test('mobile menu, language switch and pages have no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/ru');await page.getByRole('button',{name:'Открыть меню'}).click();await page.getByRole('navigation').getByRole('link',{name:'Каталог',exact:true}).click();await expect(page).toHaveURL(/\/ru\/catalog/);await page.getByRole('link',{name:'KY',exact:true}).click();await expect(page).toHaveURL(/\/ky\/catalog/);await expect(page.locator('main h1')).toHaveText('Каталог.');
 for(const lang of ['ru','ky'])for(const path of ['','/catalog','/about','/services','/contacts']){
  await page.goto(`/${lang}${path}`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 }
 await page.goto('/ru');await page.getByRole('button',{name:'Получить предложение',exact:true}).first().click();await expect(page.getByRole('dialog')).toBeVisible();expect(await page.locator('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
});

test('header search, legal notice and unknown page behavior',async({page})=>{
 await page.goto('/ru');await page.getByRole('button',{name:'Поиск по каталогу',exact:true}).click();await page.locator('.header-search input').fill('лист');await page.locator('.header-search button').click();await expect(page).toHaveURL(/q=/);await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-info h3')).toHaveText('Листовой металл');
 await page.getByRole('button',{name:'Информация и конфиденциальность'}).click();await expect(page.getByRole('dialog')).toContainText('контактные данные не отправляются на сервер');await page.keyboard.press('Escape');
 const response=await page.goto('/ru/nonexistent');expect(response?.status()).toBe(404);await expect(page.getByRole('heading',{name:'404'})).toBeVisible();await page.getByRole('link',{name:'На главную / Башкы бетке ↗'}).click();await expect(page).toHaveURL(/\/ru$/);
});
