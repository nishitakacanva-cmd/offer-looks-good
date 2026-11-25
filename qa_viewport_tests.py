import asyncio
from playwright.async_api import async_playwright
URL='http://localhost:8766/'
async def act(pg, sel, touch):
    el=pg.locator(sel).first; await el.scroll_into_view_if_needed()
    if touch: await el.tap()
    else: await el.click()
async def run(b,w,h,tag,touch=False):
    ctx=await b.new_context(viewport={'width':w,'height':h}, has_touch=touch, is_mobile=touch and w<800)
    pg=await ctx.new_page(); errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(URL); await pg.wait_for_timeout(700); await pg.screenshot(path=f'/tmp/of-r-{tag}-0.png')
    await act(pg,'text=OPEN YOUR OFFERS',touch); await pg.wait_for_timeout(700)
    await act(pg,'.env--A .env__btn',touch); await pg.wait_for_timeout(1500)
    await act(pg,'.env--B .env__btn',touch); await pg.wait_for_timeout(1500)
    await act(pg,'.pick--A',touch); await pg.wait_for_timeout(300)
    mode=(await pg.evaluate("document.querySelector('.app').className")).split()[1]
    await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(200)
    await pg.screenshot(path=f'/tmp/of-r-{tag}-1.png', full_page=(w<900))
    for nm in ['The Actual Work','The Money','The Hours']:
        await act(pg,f'.drawer[aria-label^="Open drawer: {nm}"]',touch); await pg.wait_for_timeout(500)
        if nm=='The Money': await pg.screenshot(path=f'/tmp/of-r-{tag}-2.png')
        await act(pg,'dialog[open] .xbtn',touch); await pg.wait_for_timeout(300)
    await act(pg,'.decision__again button >> nth=1',touch); await pg.wait_for_timeout(300)
    await act(pg,'text=SEE THE FINDING',touch); await pg.wait_for_timeout(700)
    fin=await pg.is_visible('.finding'); await pg.screenshot(path=f'/tmp/of-r-{tag}-3.png')
    ov=await pg.evaluate("document.documentElement.scrollWidth-innerWidth")
    print(tag, mode, 'finding', fin, 'overflow', ov, 'errs', errs)
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        await run(b,1920,1080,'1920'); await run(b,1366,768,'1366')
        await run(b,1024,768,'tabL',True); await run(b,768,1024,'tabP',True); await run(b,390,844,'phone',True)
        await b.close()
asyncio.run(main())
