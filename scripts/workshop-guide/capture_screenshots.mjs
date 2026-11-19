import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.GUIDE_BASE_URL || "http://localhost:3000";
const OUT_DIR = path.resolve("docs/panduan-workshop/screenshots");

const PUBLIC_ROUTES = [
  { key: "pub_beranda", route: "/" },
  { key: "pub_pendaftaran", route: "/pendaftaran" },
  { key: "pub_berita", route: "/berita" },
  { key: "pub_galeri", route: "/galeri" },
  { key: "pub_kontak", route: "/kontak" },
  { key: "pub_struktur", route: "/struktur-organisasi" },
  { key: "auth_login", route: "/auth/login" },
];

const ADMIN_ROUTES = [
  { key: "adm_dashboard", route: "/admin" },
  { key: "adm_pendaftar_list", route: "/admin/pendaftar" },
  { key: "adm_siswa", route: "/admin/siswa" },
  { key: "adm_biaya", route: "/admin/akademik/edit-biaya" },
  { key: "adm_berita_list", route: "/admin/berita" },
  { key: "adm_berita_tambah", route: "/admin/berita/tambah" },
  { key: "adm_ruang_perspektif", route: "/admin/ruang-perspektif" },
  { key: "adm_galeri", route: "/admin/galeri" },
  { key: "adm_testimoni", route: "/admin/testimoni" },
  { key: "adm_kalender", route: "/admin/kalender" },
  { key: "adm_prestasi", route: "/admin/akademik/prestasi" },
  { key: "adm_pesan", route: "/admin/pesan" },
  { key: "adm_konten", route: "/admin/konten" },
  { key: "adm_kontak", route: "/admin/konten/edit-kontak" },
  { key: "dev_erapor", route: "/admin/akademik" },
];

async function waitSettle(page) {
  await page.waitForLoadState("domcontentloaded");
  try {
    await page.waitForLoadState("networkidle", { timeout: 6000 });
  } catch {
    // Some external images or SSE sockets may stay open; settle briefly instead.
  }
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }).catch(() => {});
  await page.waitForTimeout(800);
}

async function capturePage(page, key, route, requiresAuth) {
  const targetUrl = `${BASE_URL}${route}`;
  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await waitSettle(page);
  if (key === "pub_beranda") {
    const dismissBtn = page.getByRole("button", { name: /Nanti Saja/i });
    if (await dismissBtn.isVisible().catch(() => false)) {
      await dismissBtn.click();
      await page.waitForTimeout(500);
    }
  }
  const file = `${key}.png`;
  const filePath = path.join(OUT_DIR, file);
  await page.screenshot({ path: filePath, fullPage: false });
  const stat = fs.statSync(filePath);
  return {
    key,
    route,
    file,
    finalUrl: page.url(),
    width: 1440,
    height: 900,
    bytes: stat.size,
    requiresAuth,
  };
}

async function loginAs(page, email, password, expectedUrlPart) {
  await page.goto(`${BASE_URL}/auth/login`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await waitSettle(page);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await Promise.all([
    page.waitForURL((url) => url.pathname.includes(expectedUrlPart), { timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);
  await waitSettle(page);
}

async function launchBrowser() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // Try next system browser channel
    }
  }
  return await chromium.launch({ headless: true });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];
  const browser = await launchBrowser();

  try {
    // 1. Public & Login pages
    const pubCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
      colorScheme: "light",
    });
    const pubPage = await pubCtx.newPage();
    for (const item of PUBLIC_ROUTES) {
      console.log(`Capturing ${item.key} (${item.route})...`);
      manifest.push(await capturePage(pubPage, item.key, item.route, false));
    }
    await pubCtx.close();

    // 2. Admin pages (demo seed account on local Supabase)
    const adminCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
      colorScheme: "light",
    });
    const adminPage = await adminCtx.newPage();
    console.log("Logging in as local admin...");
    await loginAs(adminPage, "admin@mimpkdimoro.sch.id", "admin123", "/admin");

    for (const item of ADMIN_ROUTES) {
      console.log(`Capturing ${item.key} (${item.route})...`);
      manifest.push(await capturePage(adminPage, item.key, item.route, true));
    }

    // Dynamic detail pendaftar route
    console.log("Capturing adm_pendaftar_detail...");
    await adminPage.goto(`${BASE_URL}/admin/pendaftar`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitSettle(adminPage);
    const detailLink = adminPage.locator('a[href*="/admin/pendaftar/detail/"]').first();
    const detailHref = await detailLink.getAttribute("href");
    if (!detailHref) {
      throw new Error("Could not find any detail link on /admin/pendaftar");
    }
    manifest.push(await capturePage(adminPage, "adm_pendaftar_detail", detailHref, true));
    await adminCtx.close();

    // 3. Portal Wali page (demo parent account on local Supabase)
    const portalCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
      colorScheme: "light",
    });
    const portalPage = await portalCtx.newPage();
    console.log("Logging in as local parent for dev_portal_wali...");
    await loginAs(portalPage, "orangtua@example.com", "orangtua123", "/portal");
    manifest.push(await capturePage(portalPage, "dev_portal_wali", "/portal", true));
    await portalCtx.close();

    fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");
    console.log(`Captured ${manifest.length} screenshots successfully.`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
