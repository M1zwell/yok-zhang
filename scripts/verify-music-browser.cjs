/* Optional integration QA: run with Playwright installed and a built export served on port 3100. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const base = process.env.MUSIC_TEST_URL || 'http://127.0.0.1:3100';
const artifacts = process.env.MUSIC_TEST_ARTIFACTS || path.join(root, '..', 'artifacts');
const artifactPrefix = process.env.MUSIC_TEST_ARTIFACT_PREFIX || 'ichina-music-no-download';
const summary = [];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const manifests = Object.fromEntries(['hk', 'cn', 'jp'].map(region => [region, JSON.parse(fs.readFileSync(path.join(root, 'public/audio/music', region, 'playlist.json')))]));
const audit = Object.fromEntries(['hk', 'cn', 'jp'].map(region => [region, JSON.parse(fs.readFileSync(path.join(root, 'public/audio/music', region, 'catalog-audit.json')))]));
const record = message => { summary.push(message); console.log(`PASS ${message}`); };

function instrument() {
  const NativeContext = window.AudioContext || window.webkitAudioContext;
  const originalFetch = window.fetch.bind(window);
  const qa = window.__musicQa = { contexts: [], sources: [], gains: [], decodes: [], fetches: [], pendingDecodes: [], holdDecode: false, failNext: false };
  window.fetch = async (input, options) => {
    const url = typeof input === 'string' ? input : input.url;
    if (/\/audio\/music\/.*\.ogg/.test(url)) {
      qa.fetches.push(url);
      if (qa.failNext) { qa.failNext = false; return new Response('test failure', { status: 503 }); }
    }
    return originalFetch(input, options);
  };
  class ObservedContext extends NativeContext {
    constructor(...args) { super(...args); qa.contexts.push(this); }
    createGain() { const gain = super.createGain(); qa.gains.push(gain); return gain; }
    createBufferSource() {
      const source = super.createBufferSource();
      const start = source.start.bind(source), stop = source.stop.bind(source), disconnect = source.disconnect.bind(source);
      source.start = (...args) => { source.__qaOffset = args[1] || 0; source.__qaEnded = source.onended; return start(...args); };
      source.stop = (...args) => { source.__qaStopped = true; return stop(...args); };
      source.disconnect = (...args) => { source.__qaDisconnected = true; return disconnect(...args); };
      qa.sources.push(source);
      return source;
    }
    async decodeAudioData(encoded) {
      const decoded = await super.decodeAudioData(encoded);
      qa.decodes.push({ duration: decoded.duration, channels: decoded.numberOfChannels, sampleRate: decoded.sampleRate });
      if (qa.holdDecode) await new Promise(resolve => qa.pendingDecodes.push(resolve));
      return decoded;
    }
  }
  window.AudioContext = ObservedContext;
  if (window.webkitAudioContext) window.webkitAudioContext = ObservedContext;
}

async function musicReady(page) {
  await page.getByRole('heading', { level: 1, name: 'AI Music Play.' }).waitFor();
  await page.getByRole('button', { name: 'Play selected track', exact: true }).waitFor();
}
const status = page => page.locator('main [role="status"]');
const play = page => page.getByRole('button', { name: 'Play selected track', exact: true });
const pause = page => page.getByRole('button', { name: 'Pause playback', exact: true });
const group = page => page.getByRole('group', { name: 'Regional playlists' });
const playlist = (page, label) => page.getByRole('list', { name: `${label} tracks`, exact: true });
async function playing(page) { await status(page).filter({ hasText: /^Playing$/ }).waitFor(); }
async function finish(page) { await page.evaluate(() => { const source = window.__musicQa.sources.at(-1); source.onended?.(new Event('ended')); }); }
async function ensureTitle(page, title) { await page.waitForFunction(title => document.querySelector('[data-testid="selected-track"]').textContent === title, title); }
async function noDownloadControls(page) {
  assert.equal(await page.locator('a[download]').count(), 0, 'no download anchors');
  assert.equal(await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).some(anchor => /\.(?:mid|midi)(?:$|[?#])/i.test(anchor.getAttribute('href')))), false, 'no MIDI asset links');
  assert.equal(await page.getByRole('link', { name: /\b(?:midi|download)\b/i }).count(), 0, 'no MIDI or download links');
  assert.equal(await page.getByRole('button', { name: /\b(?:midi|download)\b/i }).count(), 0, 'no MIDI or download buttons');
}

(async () => {
  fs.mkdirSync(artifacts, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    const unexpected = [];
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await context.addInitScript(instrument);
    const page = await context.newPage();
    page.on('pageerror', error => unexpected.push(error.message));
    await page.goto(`${base}/music`);
    await musicReady(page);
    await page.waitForTimeout(150);
    assert.equal(await playlist(page, 'Hong Kong').getByRole('button').count(), 100);
    await noDownloadControls(page);
    assert.deepEqual(await page.evaluate(() => [window.__musicQa.contexts.length, window.__musicQa.fetches.length]), [0, 0]);
    for (const [index, label, count] of [[1, 'China', 50], [2, 'Japan', 50], [0, 'Hong Kong', 100]]) {
      await group(page).getByRole('button').nth(index).click();
      assert.equal(await playlist(page, label).getByRole('button').count(), count);
      await noDownloadControls(page);
    }
    assert.deepEqual(await page.evaluate(() => [window.__musicQa.contexts.length, window.__musicQa.fetches.length]), [0, 0]);
    record('regional counts 100/50/50; no audio fetch or AudioContext before playback');
    record('all three regional playlists expose no download anchors, MIDI links or download controls');

    await play(page).click();
    await playing(page);
    assert.equal(await page.evaluate(() => window.__musicQa.decodes[0].channels), 2);
    await page.waitForFunction(() => window.__musicQa.contexts[0].currentTime > 1);
    await page.waitForFunction(() => document.querySelector('main [class*="progress"] > span').style.width !== '0%');
    await pause(page).click();
    await status(page).filter({ hasText: /^Paused/ }).waitFor();
    const requestsBeforeResume = await page.evaluate(() => window.__musicQa.fetches.length);
    await play(page).click();
    await playing(page);
    assert.equal(await page.evaluate(() => window.__musicQa.fetches.length), requestsBeforeResume);
    assert.ok(await page.evaluate(() => window.__musicQa.sources.at(-1).__qaOffset > 0));
    await page.getByRole('button', { name: 'Next track', exact: true }).click();
    await ensureTitle(page, manifests.hk.tracks[1].title);
    await playing(page);
    record('real OGG decode and elapsed progression, pause/resume without refetch, Next while playing');

    const slider = page.getByRole('slider', { name: 'Volume', exact: true });
    await slider.focus();
    await slider.press('Home');
    for (let i = 0; i < 25; i++) await slider.press('ArrowRight');
    assert.equal(await slider.inputValue(), '25');
    assert.ok(Math.abs(await page.evaluate(() => window.__musicQa.gains[0].gain.value) - .25) < .0001);
    await page.getByRole('button', { name: 'Mute audio', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__musicQa.gains[0].gain.value), 0);
    await page.getByRole('button', { name: 'Unmute audio', exact: true }).click();
    assert.ok(Math.abs(await page.evaluate(() => window.__musicQa.gains[0].gain.value) - .25) < .0001);
    record('keyboard volume and mute/unmute preserve playback controls');

    await page.evaluate(() => { window.__musicQa.holdDecode = true; });
    await playlist(page, 'Hong Kong').getByRole('button').nth(3).click();
    await page.waitForFunction(() => window.__musicQa.pendingDecodes.length === 1);
    await playlist(page, 'Hong Kong').getByRole('button').nth(4).click();
    await page.waitForFunction(() => window.__musicQa.pendingDecodes.length === 2);
    await page.evaluate(() => { window.__musicQa.holdDecode = false; window.__musicQa.pendingDecodes.splice(0).forEach(resolve => resolve()); });
    await playing(page);
    await ensureTitle(page, manifests.hk.tracks[4].title);
    assert.ok(Math.abs(await page.evaluate(() => window.__musicQa.sources.at(-1).buffer.duration) - manifests.hk.tracks[4].durationSeconds) < .01);
    assert.equal(await page.evaluate(() => window.__musicQa.sources.filter(source => !source.__qaDisconnected && !source.__qaStopped).length), 1);
    const staleIndex = await page.evaluate(() => window.__musicQa.sources.length - 1);
    await playlist(page, 'Hong Kong').getByRole('button').nth(5).click();
    await playing(page);
    await ensureTitle(page, manifests.hk.tracks[5].title);
    await page.evaluate(index => window.__musicQa.sources[index].__qaEnded?.(new Event('ended')), staleIndex);
    await ensureTitle(page, manifests.hk.tracks[5].title);
    assert.equal(await status(page).innerText(), 'Playing');
    await group(page).getByRole('button').nth(1).click();
    await ensureTitle(page, manifests.cn.tracks[0].title);
    await status(page).filter({ hasText: /^Ready/ }).waitFor();
    assert.equal(await page.evaluate(() => window.__musicQa.sources.filter(source => !source.__qaDisconnected && !source.__qaStopped).length), 0);
    record('rapid selection ignores stale decode and ended callbacks; region switch stops playback');

    await page.evaluate(() => { window.__musicQa.failNext = true; });
    await playlist(page, 'China').getByRole('button').nth(1).click();
    await page.getByRole('alert').filter({ hasText: /could not be loaded/ }).waitFor();
    await play(page).click();
    await playing(page);
    record('loading failure is visible and explicit Play successfully retries');

    await finish(page);
    await status(page).filter({ hasText: /^Ready/ }).waitFor();
    await ensureTitle(page, manifests.cn.tracks[1].title);
    await page.getByRole('button', { name: 'Loop: Off', exact: true }).click();
    await play(page).click();
    await playing(page);
    await finish(page);
    await ensureTitle(page, manifests.cn.tracks[2].title);
    await playing(page);
    await playlist(page, 'China').getByRole('button').nth(49).click();
    await playing(page);
    await finish(page);
    await ensureTitle(page, manifests.cn.tracks[0].title);
    await playing(page);
    await page.getByRole('button', { name: 'Loop: All', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__musicQa.sources.at(-1).loop), true);
    assert.ok(Math.abs(await page.evaluate(() => window.__musicQa.sources.at(-1).loopEnd) - manifests.cn.tracks[0].loop.endSampleExclusive / manifests.cn.tracks[0].loop.sampleRate) < .001);
    const beforeQueuedEnd = await page.evaluate(() => window.__musicQa.sources.length);
    await finish(page);
    await page.waitForFunction(count => window.__musicQa.sources.length > count, beforeQueuedEnd);
    await ensureTitle(page, manifests.cn.tracks[0].title);
    await playing(page);
    assert.equal(await page.evaluate(() => window.__musicQa.sources.at(-1).loop), true);
    record('simulated endings: Off stops, All advances/wraps, One uses authored loop bounds and restarts queued ending');

    await page.evaluate(() => window.__musicQa.contexts[0].suspend());
    await page.getByRole('alert').filter({ hasText: /interrupted/ }).waitFor();
    await play(page).click();
    await playing(page);
    await page.evaluate(() => { window.__musicQa.holdDecode = true; });
    await playlist(page, 'China').getByRole('button').nth(3).click();
    await page.waitForFunction(() => window.__musicQa.pendingDecodes.length === 1);
    await page.evaluate(() => window.__musicQa.contexts[0].suspend());
    await page.getByRole('alert').filter({ hasText: /interrupted/ }).waitFor();
    const sourceCount = await page.evaluate(() => window.__musicQa.sources.length);
    await page.evaluate(() => { window.__musicQa.holdDecode = false; window.__musicQa.pendingDecodes.splice(0).forEach(resolve => resolve()); });
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => window.__musicQa.sources.length), sourceCount);
    await play(page).click();
    await playing(page);
    record('browser AudioContext interruptions during playback/decode pause visibly and retry cleanly');

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(artifacts, `${artifactPrefix}-desktop.png`), fullPage: true });
    await page.getByRole('link', { name: '← Garden', exact: true }).click();
    await page.getByRole('heading', { level: 1, name: 'Hong Kong. Builds AI. Walks the rest.', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => window.__musicQa.contexts[0].state), 'closed');
    assert.equal(await page.evaluate(() => window.__musicQa.sources.filter(source => !source.__qaDisconnected && !source.__qaStopped).length), 0);
    await page.goto(`${base}/me`);
    await page.getByRole('heading', { level: 1, name: 'Quiet World Builder', exact: true }).waitFor();
    record('SPA navigation disposes audio; existing homepage and /me headings preserved');

    await page.goto(`${base}/music`);
    await musicReady(page);
    await page.getByRole('button', { name: 'Language', exact: true }).click();
    await page.getByRole('option').filter({ hasText: '繁體中文' }).getByRole('button').click();
    await page.waitForURL('**/zh-Hant/music');
    await musicReady(page);
    record('language switch keeps /music endpoint on localized route');
    assert.deepEqual(unexpected, []);
    await context.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    await mobile.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await mobile.addInitScript(instrument);
    const phone = await mobile.newPage();
    const phoneErrors = [];
    phone.on('pageerror', error => phoneErrors.push(error.message));
    await phone.goto(`${base}/music`);
    await musicReady(phone);
    for (const width of [390, 320]) {
      await phone.setViewportSize({ width, height: 844 });
      assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `no horizontal overflow at ${width}px`);
      for (const label of ['Play selected track', 'Next track', 'Loop: Off', 'Mute audio']) {
        const box = await phone.getByRole('button', { name: label, exact: true }).boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44, `${label} touch target at ${width}px`);
      }
    }
    await phone.setViewportSize({ width: 390, height: 844 });
    await play(phone).click();
    await playing(phone);
    await phone.getByRole('button', { name: 'Next track', exact: true }).click();
    await ensureTitle(phone, manifests.hk.tracks[1].title);
    await playing(phone);
    await pause(phone).click();
    await status(phone).filter({ hasText: /^Paused/ }).waitFor();
    await phone.evaluate(() => window.scrollTo(0, 0));
    await phone.waitForTimeout(100);
    await noDownloadControls(phone);
    await phone.screenshot({ path: path.join(artifacts, `${artifactPrefix}-mobile.png`), fullPage: true });
    assert.deepEqual(phoneErrors, []);
    record('390px/320px layouts fit; 44px controls; mobile-emulation Play/Next/Pause; no page errors');
    await mobile.close();

    // Verify the served production export contains every frozen original pair.
    const work = [];
    for (const region of ['hk', 'cn', 'jp']) for (const [index, track] of manifests[region].tracks.entries()) {
      work.push([track.audioUrl, audit[region].tracks[index].oggSha256], [track.midiUrl, audit[region].tracks[index].midiSha256]);
    }
    let cursor = 0;
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (cursor < work.length) {
        const [url, hash] = work[cursor++];
        const response = await fetch(`${base}${url}`);
        assert.equal(response.status, 200, url);
        assert.equal(sha(Buffer.from(await response.arrayBuffer())), hash, url);
      }
    }));
    record('all 400 served OGG/MIDI assets return 200 and match frozen-source SHA256');
    const result = { passed: summary, screenshots: [`${artifactPrefix}-desktop.png`, `${artifactPrefix}-mobile.png`].map(name => path.join(artifacts, name)), limitations: ['Headless Chromium with mobile viewport emulation; no physical device or ear audition.', 'Loop endings are simulated callbacks; original authored bounds are checked on real browser sources.', 'External site/font requests are blocked during local QA.', 'The UI has no download controls; retained MIDI assets remain directly served. This does not establish access control.'] };
    fs.writeFileSync(path.join(artifacts, `${artifactPrefix}-browser-results.json`), JSON.stringify(result, null, 2));
    console.log(`${summary.length} browser integration groups passed.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
