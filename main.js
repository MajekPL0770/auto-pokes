const puppeteer = require("puppeteer");
const sleep = require("sleep-promise");
const config = require("./config.json");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.facebook.com/pokes");

  await page.setViewport({
    width: 800,
    height: 600,
  });

  await page.waitForSelector("#cookie_banner_title");

  const [button] = await page.$x(
    "//button[contains(., 'Zezwól na wszystkie pliki cookie')]"
  );

  if (button) {
    await button.click();
  }

  await page.waitForSelector("#email");

  await page.type("#email", config.email, {
    delay: 20,
  });
  await page.type("#pass", config.password, {
    delay: 20,
  });

  await page.keyboard.press("Enter");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  while (true) {
    try {
      await page.evaluate(() => {
        const btn = document.querySelector(
          "div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div._b5a > div._b5a > div:nth-child(1) span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.jq4qci2q.a3bd9o3v.lrazzd5p.bwm1u5wc span.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ltmttdrg.g0qnabr5"
        );
        if (btn.innerText == config.textReplayButton) {
          btn.click();
        }
      });
    } catch (error) {}
    await sleep(100);
  }
})();
