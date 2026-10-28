/* Renue Ops demo: example data only. Times are generated relative to when the page opened so the clocks, countdown and "ago" labels stay believable. */
(function () {
  'use strict';

  var MIN = 60000;
  var T0 = Date.now();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hm(d, tz) { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d); }
  function minsSince(t) { return Math.max(0, Math.floor((Date.now() - t) / MIN)); }
  function agoShort(m) { return m < 1 ? 'now' : m < 60 ? m + 'm' : m < 1440 ? Math.floor(m / 60) + 'h' : Math.floor(m / 1440) + 'd'; }

  /* ---------- example data ---------- */
  var KINDS = {
    vip: { chip: '@', cls: 'vip', group: 'mail' },
    mail: { chip: '@', cls: 'ml', group: 'mail' },
    rest: { chip: '@', cls: 'rd', group: 'mail' },
    mq: { chip: 'MQ', cls: 'mq', group: 'reddit' },
    mention: { chip: 'r/', cls: 'rd', group: 'reddit' },
    watch: { chip: 'r/', cls: 'rd', group: 'reddit' },
    b2b: { chip: 'B2B', cls: 'sh', group: 'shop' }
  };
  var ITEMS = [
    { id: 'vip1', kind: 'vip', ago: 15, title: 'Q4 wholesale pricing', meta: 'VIP · to you only', from: 'VIP sender', to: 'you only', body: 'Can you send me the updated Q4 wholesale price list before the 14:00 call? Want to check the US tiers against last quarter.' },
    { id: 'mq1', kind: 'mq', ago: 23, title: 'Has anyone compared liposomal NMN to sublingual?', meta: 'r/Renue mod queue · u/quiet_otter_88', author: 'u/quiet_otter_88', acct: '12 days', karma: 41, why: 'Held by AutoModerator: new account', post: 'text post', body: 'Three months on the sublingual and wondering if the liposomal is worth switching to. Anyone tried both?' },
    { id: 'po', kind: 'mail', ago: 31, title: 'PO 16112: revised quantities', meta: 'Flagged by analyzer · wholesale buyer', from: 'Purchasing, wholesale buyer', to: 'you, orders', body: 'Please see the revised quantities for PO 16112. We need to drop the 1 kg NMN to 4 units and add 6 of the resveratrol.' },
    { id: 'mq2', kind: 'mq', ago: 41, title: 'COA link for my batch goes to a 404', meta: 'r/Renue mod queue · u/longevity_lab_rat', author: 'u/longevity_lab_rat', acct: '2 years', karma: 1820, why: 'Held by Reddit spam filter: contains a link', post: 'link post', body: 'Scanned the QR on my bottle and the certificate page is missing. Batch number is on the label if a mod wants it.' },
    { id: 'b2b1', kind: 'b2b', ago: 52, title: 'New application: Northwind Wellness', meta: 'Shopify · website set · ready', company: 'c1' },
    { id: 'kw1', kind: 'mention', ago: 64, title: 'Renue NMN third-party testing results?', meta: 'r/Supplements · via KWatch', sub: 'r/Supplements', body: 'Does anyone know where Renue publishes its third-party COAs? Looking for heavy metals specifically.' },
    { id: 'cn', kind: 'mail', ago: 86, title: 'Credit note request for order 80412', meta: 'Flagged by analyzer · accounts', from: 'Accounts payable, retailer', to: 'you, accounts', body: 'Two units arrived damaged on order 80412. Could you issue a credit note against the next invoice?' },
    { id: 'w1', kind: 'watch', ago: 109, title: 'Best NAD+ precursor for over-50s', meta: 'r/longevity /new · watched page', sub: 'r/longevity', body: 'Comparing NR, NMN and plain niacin for my parents. What does the evidence say?' },
    { id: 'w2', kind: 'watch', ago: 131, title: 'Anyone ordered Renue to Canada recently?', meta: 'r/Renue /new · watched page', sub: 'r/Renue', body: 'How long did shipping take, and did you pay duties?' },
    { id: 'b2b2', kind: 'b2b', ago: 157, title: 'New application: Maple Street Apothecary', meta: 'Shopify · website set · ready', company: 'c2' },
    { id: 'kw2', kind: 'mention', ago: 182, title: 'Is NMN worth it at 35?', meta: 'r/NMN · via KWatch', sub: 'r/NMN', body: 'Mentions Renue as the brand they started with.' },
    { id: 'b2b3', kind: 'b2b', ago: 205, title: 'New application: Lotus Longevity Clinic', meta: 'Shopify · check: Thailand, no website', company: 'c3' },
    { id: 'r1', kind: 'rest', ago: 228, title: 'Re: restock ETA for NMN 1 kg', meta: 'Inbox · supplier', from: 'Supplier', to: 'you, ops', body: 'The next lot ships from the plant on Friday.' },
    { id: 'kw3', kind: 'mention', ago: 251, title: 'Renue vs other NMN brands', meta: 'r/Biohackers · via KWatch', sub: 'r/Biohackers', body: 'Thread comparing purity testing across brands.' },
    { id: 'r2', kind: 'rest', ago: 300, title: 'Payout sent', meta: 'Inbox · Shopify', from: 'Shopify', to: 'you', body: 'Your payout is on its way.' }
  ];
  ITEMS.forEach(function (it) { it.at = T0 - it.ago * MIN; });

  var COMPANIES = [
    { id: 'c1', item: 'b2b1', name: 'Northwind Wellness', where: 'Texas, US', web: 'northwindwellness.com', flags: [], checked: true, state: 'pending' },
    { id: 'c2', item: 'b2b2', name: 'Maple Street Apothecary', where: 'Ontario, Canada', web: 'maplestreetapothecary.ca', flags: [], checked: true, state: 'pending' },
    { id: 'c3', item: 'b2b3', name: 'Lotus Longevity Clinic', where: 'Bangkok, Thailand', web: '', flags: ['Country is Thailand', 'No website'], checked: false, state: 'pending' }
  ];
  var STEPS = ['catalog', 'ship anywhere', 'location tax exempt', 'customer tax exempt', 'ordering role'];

  function nextSlot(t, lead) {
    var d = new Date(t + lead * MIN); d.setSeconds(0, 0);
    var m = d.getMinutes();
    if (m !== 0 && m !== 30) d.setMinutes(m < 30 ? 30 : 60);
    return d;
  }
  var M1 = nextSlot(T0, 10);
  var AGENDA = [
    { t: new Date(+M1 - 90 * MIN), title: 'Inbox block', sub: 'focus time', past: true },
    { now: true },
    { t: M1, title: 'Supplier COA call', sub: 'Google Meet · 30 min' },
    { t: new Date(+M1 + 4 * 60 * MIN), title: 'Wholesale pricing', sub: '45 min' },
    { t: new Date(+M1 + 7 * 60 * MIN), title: 'US team stand-up', sub: 'la' }
  ];

  var S = { view: 'home', filter: 'all', dismissed: {}, busy: false, approvedAt: {} };

  function live(it) { return !S.dismissed[it.id]; }
  function itemsOf(kinds) { return ITEMS.filter(function (it) { return live(it) && kinds.indexOf(it.kind) >= 0; }); }
  function pending() { return COMPANIES.filter(function (c) { return c.state !== 'approved'; }); }
  function counts() {
    return {
      mq: itemsOf(['mq']).length,
      vip: itemsOf(['vip']).length,
      flagged: itemsOf(['mail']).length,
      ment: itemsOf(['mention', 'watch']).length,
      shop: pending().length,
      flaggedShop: pending().filter(function (c) { return c.flags.length; }).length
    };
  }

  /* ---------- rendering ---------- */
  function itemRow(it) {
    var k = KINDS[it.kind];
    return '<button class="item" data-open="' + it.id + '"><span class="chip ' + k.cls + '">' + k.chip + '</span>' +
      '<span class="tx"><span class="t">' + esc(it.title) + '</span><span class="m">' + esc(it.meta) + '</span></span>' +
      '<span class="tm" data-ago="' + it.id + '">' + agoShort(minsSince(it.at)) + '</span></button>';
  }
  function list(el, arr, emptyText) {
    if (!el) return;
    el.innerHTML = arr.length ? arr.map(itemRow).join('') : '<div class="empty">' + esc(emptyText || 'Nothing here.') + '</div>';
  }
  function byNewest(a, b) { return b.at - a.at; }

  function renderHome() {
    var c = counts();
    $('#tiles').innerHTML =
      tile('crit', 'Mod queue', c.mq, c.mq ? 'oldest ' + agoShort(minsSince(itemsOf(['mq']).sort(byNewest).slice(-1)[0].at)) : 'clear', 'reddit') +
      tile('warn', 'Wholesale', c.shop, c.flaggedShop ? c.flaggedShop + ' to check' : c.shop ? 'ready' : 'none', 'shop') +
      tile('acc', 'VIP', c.vip, c.vip ? 'to you only' : 'none', 'inbox') +
      tile('', 'Mentions', c.ment, 'today', 'reddit');

    var mqItems = itemsOf(['mq']).sort(byNewest);
    var vip = itemsOf(['vip'])[0];
    $('#needs').innerHTML =
      need(c.mq ? 'crit' : 'clear', 'Mod queue · r/Renue', c.mq ? c.mq + (c.mq === 1 ? ' post waiting' : ' posts waiting') : 'Queue is clear',
        c.mq ? 'oldest ' + agoShort(minsSince(mqItems[mqItems.length - 1].at)) + ' · held for approval' : 'checked every 15 min', c.mq ? 'Open queue' : 'View', 'data-go="reddit"') +
      need(c.shop ? 'warn' : 'clear', 'Wholesale', c.shop ? c.shop + (c.shop === 1 ? ' application' : ' applications') : 'Nothing pending',
        c.shop ? (c.shop - c.flaggedShop) + ' ready · ' + c.flaggedShop + ' to check' : 'scanned every 15 min', c.shop ? 'Review' : 'View', 'data-go="shop"') +
      need(vip ? 'acc' : 'clear', 'VIP · to you only', vip ? vip.title : 'No VIP mail', vip ? 'urgent alert · unread' : 'alerts as urgent', vip ? 'Open' : 'Inbox', vip ? 'data-open="vip1"' : 'data-go="inbox"') +
      need('', 'Next · <span data-meet-time></span>', 'Supplier COA call', '<span data-countdown-text></span> · Google Meet', 'Join', 'data-toast="Opens Google Meet on the real thing."');

    var f = S.filter;
    var all = ITEMS.filter(live).sort(byNewest);
    var groups = { all: all.length, mail: 0, reddit: 0, shop: 0 };
    all.forEach(function (it) { groups[KINDS[it.kind].group]++; });
    $('#filters').innerHTML = ['all', 'mail', 'reddit', 'shop'].map(function (g) {
      return '<button class="fl' + (f === g ? ' on' : '') + '" data-filter="' + g + '">' + g.charAt(0).toUpperCase() + g.slice(1) + '<em>' + groups[g] + '</em></button>';
    }).join('');
    var wide = window.matchMedia('(min-width:600px)').matches;
    var shown = all.filter(function (it) { return !wide || f === 'all' || KINDS[it.kind].group === f; });
    list($('#activity'), shown, 'All clear.');

    $('#agenda').innerHTML = AGENDA.map(function (a) {
      if (a.now) return '<div class="now" data-nowline></div>';
      var sub = a.sub === 'la' ? hm(a.t, 'America/Los_Angeles') + ' in Los Angeles' : a.sub;
      var day = a.t.toDateString() !== new Date().toDateString() ? 'Tmrw ' : '';
      return '<div class="ag' + (a.past ? ' past' : '') + '"><span class="h">' + hm(a.t) + '</span><span class="t">' + day + esc(a.title) + '<small>' + esc(sub) + '</small></span></div>';
    }).join('');
  }
  function tile(tone, k, n, meta, go) {
    return '<button class="tile ' + (n ? tone : '') + '" data-go="' + go + '"><span class="k">' + k + '</span><span class="big">' + n + '</span><span class="meta">' + esc(meta) + '</span></button>';
  }
  function need(tone, k, title, meta, btn, attr) {
    return '<div class="need ' + tone + '"><span class="k">' + k + '</span><span class="title">' + esc(title) + '</span><span class="meta">' + meta + '</span><button class="btn' + (tone === 'clear' || tone === '' ? ' ghost' : '') + '" ' + attr + '>' + btn + '</button></div>';
  }

  function sysRows() {
    var wc = (4 + minsSince(T0)) % 15;
    var c = counts();
    var rows = [
      ['c-ok', 'Beelink', 'up 5 h 11 m · load 0.8', 'OK', 'c-ok'],
      ['c-ok', 'Mod-queue watcher', '<span data-wc>checked ' + wc + ' min ago</span> · logged in', 'OK', 'c-ok'],
      ['c-ok', 'Alerts', 'Fold + Pixel reachable', 'OK', 'c-ok'],
      ['c-ok', 'Cloudflare tunnel', 'connected', 'OK', 'c-ok'],
      ['c-ok', 'Email analyzer', 'next run 15:00', 'OK', 'c-ok'],
      ['c-ok', 'KWatch alerts', c.ment ? 'last alert ' + agoShort(minsSince(ITEMS[5].at)) + ' ago' : 'quiet', 'OK', 'c-ok'],
      ['c-neu', 'KWatch digest', 'next Monday 08:00', 'IDLE', 'c-neu'],
      [S.zendesk ? 'c-ok' : 'c-warn', 'Zendesk report', S.zendesk ? 'finalized just now' : 'preliminary done · finalize by hand', S.zendesk ? 'OK' : 'TO DO', S.zendesk ? 'c-ok' : 'c-warn']
    ];
    return rows.map(function (r) {
      return '<div class="sys"><span class="dot ' + r[0] + '"></span><span class="n">' + r[1] + '<small>' + r[2] + '</small></span><span class="s ' + r[4] + '">' + r[3] + '</span></div>';
    }).join('');
  }
  function actsHtml() {
    return '<button class="btn" data-go="shop">Review wholesale</button>' +
      '<button class="btn ghost" data-confirm="zendesk">Finalize Zendesk</button>' +
      '<button class="btn ghost" data-confirm="kwatch">KWatch preview</button>' +
      '<button class="btn ghost" data-confirm="analyzer">Email analyzer</button>' +
      '<button class="btn ghost" data-toast="Opens the Shopify app on the real thing.">Shopify ↗</button>' +
      '<button class="btn ghost" data-alert="1">Test alert</button>';
  }

  function renderWholesale() {
    var p = pending();
    var html = '<div class="hd"><h3>Pending applications</h3><span>scanned ' + ((minsSince(T0) + 2) % 15) + ' min ago</span></div>';
    if (!p.length) html += '<div class="empty">Nothing pending. New applications alert you within 15 minutes.</div>';
    p.forEach(function (c) {
      var done = c.step || 0;
      html += '<label class="wh-row" for="wh-' + c.id + '"><input id="wh-' + c.id + '" type="checkbox" data-company="' + c.id + '"' + (c.checked ? ' checked' : '') + (S.busy ? ' disabled' : '') + '>' +
        '<span class="wh-main"><span class="t">' + esc(c.name) + '</span><span class="m">' + esc(c.where) + ' · ' + esc(c.web || 'no website') + '</span>' +
        (c.flags.length ? '<span class="pill warn">check: ' + esc(c.flags.join(', ').toLowerCase()) + '</span>' : '<span class="pill ok">ready</span>') +
        (c.state === 'running' ? '<ul class="steps">' + STEPS.map(function (s, i) { return '<li' + (i < done ? ' class="done"' : '') + '>' + s + '</li>'; }).join('') + '</ul>' : '') +
        '</span></label>';
    });
    if (p.length) {
      var sel = p.filter(function (c) { return c.checked; });
      var fl = sel.filter(function (c) { return c.flags.length; }).length;
      html += '<p class="wh-note">Only ticked companies are approved. Each is re-checked for a catalog first, then gets: ' + STEPS.join(', ') + '.</p>';
      html += '<button class="btn block' + (fl ? ' warn' : '') + '" id="wh-go"' + (S.busy || !sel.length ? ' disabled' : '') + '>' +
        (S.busy ? 'Approving…' : !sel.length ? 'Tick a company to approve' : 'Approve ' + sel.length + (sel.length === 1 ? ' company' : ' companies') + (fl ? ' (' + fl + ' flagged)' : '')) + '</button>';
    }
    $('#wh').innerHTML = html;

    var appr = COMPANIES.filter(function (c) { return c.state === 'approved'; });
    $('#wh-done-panel').hidden = !appr.length;
    $('#wh-done-panel').innerHTML = '<div class="hd"><h3>Approved</h3><span>welcome emails are sent by hand</span></div>' +
      appr.map(function (c) { return '<div class="done-row"><span>' + esc(c.name) + '</span><button data-toast="Opens ' + esc(c.name) + ' in the Shopify app to send the welcome email.">Send welcome email ↗</button></div>'; }).join('');
  }

  function renderBadges() {
    var c = counts();
    var map = { inbox: c.vip + c.flagged, reddit: c.mq, shop: c.shop, systems: S.zendesk ? 0 : 1 };
    $$('[data-badge]').forEach(function (b) { var n = map[b.getAttribute('data-badge')]; b.textContent = n ? String(n) : ''; });
    var need = (c.mq ? 1 : 0) + (c.vip ? 1 : 0) + (c.shop ? 1 : 0);
    var p = $('#needpill');
    p.className = 'pill needpill ' + (need ? 'crit' : 'ok');
    p.innerHTML = '<span class="dot"></span>' + (need ? need + ' need you' : 'All clear');
  }

  function render() {
    renderHome();
    $('#sys-home').innerHTML = $('#sys-full').innerHTML = sysRows();
    $('#acts-home').innerHTML = $('#acts-full').innerHTML = actsHtml();
    list($('#mail-vip'), itemsOf(['vip']).sort(byNewest), 'No VIP mail waiting.');
    list($('#mail-flag'), itemsOf(['mail']).sort(byNewest), 'Nothing flagged.');
    list($('#mail-rest'), itemsOf(['rest']).sort(byNewest), 'Inbox is quiet.');
    list($('#rd-mq'), itemsOf(['mq']).sort(byNewest), 'Queue is clear.');
    list($('#rd-men'), itemsOf(['mention']).sort(byNewest), 'No new mentions.');
    list($('#rd-watch'), itemsOf(['watch']).sort(byNewest), 'No new posts on watched pages.');
    renderWholesale();
    renderBadges();
    tick();
  }

  /* ---------- live bits ---------- */
  function tick() {
    var now = new Date();
    $$('.clock').forEach(function (el) { el.textContent = hm(now, el.getAttribute('data-tz')); });
    var mins = Math.ceil((M1 - now) / MIN);
    var cd = mins > 0 ? mins + '<small>min</small>' : mins > -30 ? 'now' : 'done';
    var cdt = mins > 0 ? 'in ' + mins + ' min' : mins > -30 ? 'happening now' : 'ended';
    $$('[data-countdown]').forEach(function (el) { el.innerHTML = cd; });
    $$('[data-countdown-text]').forEach(function (el) { el.textContent = cdt; });
    $$('[data-meet-time]').forEach(function (el) { el.textContent = hm(M1); });
    $$('[data-nowline]').forEach(function (el) { el.textContent = 'now ' + hm(now); });
    $$('[data-ago]').forEach(function (el) {
      var it = ITEMS.filter(function (x) { return x.id === el.getAttribute('data-ago'); })[0];
      if (it) el.textContent = agoShort(minsSince(it.at));
    });
    var wc = (4 + minsSince(T0)) % 15;
    $$('[data-wc]').forEach(function (el) { el.textContent = 'checked ' + wc + ' min ago'; });
  }

  /* ---------- navigation ---------- */
  var VIEWS = ['home', 'inbox', 'reddit', 'shop', 'systems'];
  function go(v, push) {
    if (VIEWS.indexOf(v) < 0) v = 'home';
    S.view = v;
    $$('.view').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-view') === v); });
    $$('[data-go]').forEach(function (el) { if (el.classList.contains('tab') || el.classList.contains('nav')) el.classList.toggle('on', el.getAttribute('data-go') === v); });
    if (push !== false && location.hash !== '#' + v) history.pushState(null, '', v === 'home' ? location.pathname : '#' + v);
    var m = $('.main'); if (m) m.scrollTop = 0;
    var view = $('.view.on'); if (view) view.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  window.addEventListener('popstate', function () { go((location.hash || '#home').slice(1), false); });

  /* ---------- sheet ---------- */
  var lastFocus = null;
  function openSheet(html) {
    lastFocus = document.activeElement;
    var sh = $('#sheet');
    sh.innerHTML = '<div class="grab"></div><button class="x" data-close aria-label="Close">×</button>' + html;
    sh.hidden = false; $('#scrim').hidden = false;
    var x = $('.x', sh); if (x) x.focus();
  }
  function closeSheet() {
    $('#sheet').hidden = true; $('#scrim').hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function detail(id) {
    var it = ITEMS.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    var h = '';
    if (it.kind === 'mq') {
      h = '<span class="pill warn">' + esc(it.why) + '</span><h2>' + esc(it.title) + '</h2>' +
        '<div class="mono">' + esc(it.author) + ' · account ' + esc(it.acct) + ' · ' + it.karma + ' karma<br>' + esc(it.post) + ' · ' + agoShort(minsSince(it.at)) + ' ago</div>' +
        '<div class="excerpt">' + esc(it.body) + '</div>' +
        '<button class="btn block" data-toast="Opens r/Renue\'s mod queue in the Reddit app.">Open in Reddit</button>' +
        '<div class="btns"><button class="btn ghost" data-modact="approve" data-id="' + it.id + '">Approve</button><button class="btn ghost" data-modact="remove" data-id="' + it.id + '">Remove</button></div>' +
        '<div class="later">approve and remove from the app come in phase 3</div>' +
        '<button class="btn ghost block" data-done="' + it.id + '">Done</button>';
    } else if (it.kind === 'vip' || it.kind === 'mail' || it.kind === 'rest') {
      var tag = it.kind === 'vip' ? '<span class="pill acc">VIP · alerts as urgent</span>' : it.kind === 'mail' ? '<span class="pill neu">Flagged by the email analyzer</span>' : '<span class="pill neu">Inbox</span>';
      h = tag + '<h2>' + esc(it.title) + '</h2><div class="mono">from ' + esc(it.from) + '<br>to ' + esc(it.to) + ' · ' + agoShort(minsSince(it.at)) + ' ago</div>' +
        '<div class="excerpt">' + esc(it.body) + '</div>' +
        '<button class="btn block" data-toast="Opens this thread in the Gmail app.">Open in Gmail</button>' +
        '<button class="btn ghost block" data-done="' + it.id + '">Done</button>';
    } else if (it.kind === 'b2b') {
      var c = COMPANIES.filter(function (x) { return x.id === it.company; })[0];
      h = (c.flags.length ? '<span class="pill warn">check: ' + esc(c.flags.join(', ').toLowerCase()) + '</span>' : '<span class="pill ok">ready to approve</span>') +
        '<h2>' + esc(c.name) + '</h2><div class="mono">' + esc(c.where) + '<br>' + esc(c.web || 'no website') + ' · applied ' + agoShort(minsSince(it.at)) + ' ago</div>' +
        '<button class="btn block" data-go="shop" data-close>Review in Wholesale</button>' +
        '<button class="btn ghost block" data-toast="Opens the company in the Shopify app.">Open in Shopify ↗</button>';
    } else {
      h = '<span class="pill neu">' + (it.kind === 'watch' ? 'Watched page' : 'Mention via KWatch') + '</span><h2>' + esc(it.title) + '</h2>' +
        '<div class="mono">' + esc(it.sub) + ' · ' + agoShort(minsSince(it.at)) + ' ago</div><div class="excerpt">' + esc(it.body) + '</div>' +
        '<button class="btn block" data-toast="Opens the thread in the Reddit app.">Open thread</button>' +
        '<button class="btn ghost block" data-done="' + it.id + '">Done</button>';
    }
    openSheet(h);
  }
  var CONFIRMS = {
    zendesk: ['Finalize the Zendesk report?', 'Runs the finalize pass on last week\'s preliminary report and emails the final version.'],
    kwatch: ['Preview the KWatch digest?', 'Builds this week\'s Reddit digest so far and emails you a preview. Monday\'s scheduled run still happens.'],
    analyzer: ['Run the email analyzer now?', 'Scans the inbox for important mail outside its 15:00 slot.']
  };
  function confirmSheet(key) {
    var c = CONFIRMS[key];
    openSheet('<h2>' + c[0] + '</h2><div class="excerpt">' + c[1] + '</div><div class="btns"><button class="btn ghost" data-close>Cancel</button><button class="btn" data-run="' + key + '">Run</button></div>');
  }

  /* ---------- toast + simulated alert ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }
  var headsTimer = null, headsItem = null;
  function showAlert() {
    headsItem = itemsOf(['mq']).sort(byNewest)[0] || ITEMS[1];
    $('#heads-title').textContent = 'r/Renue: post waiting for approval';
    $('#heads-text').textContent = '“' + headsItem.title + '” · ' + headsItem.author + ' · ' + headsItem.acct + ' old account';
    $('#heads').classList.add('show');
    clearTimeout(headsTimer); headsTimer = setTimeout(hideAlert, 9000);
  }
  function hideAlert() { $('#heads').classList.remove('show'); }
  $('#heads-open').addEventListener('click', function () { hideAlert(); detail(headsItem.id); });
  $('#heads-snooze').addEventListener('click', function () { hideAlert(); toast('Snoozed for 1 hour on both phones.'); });
  $('#heads-done').addEventListener('click', function () { hideAlert(); dismiss(headsItem.id); });

  function dismiss(id) {
    S.dismissed[id] = true; closeSheet(); render();
    toast('Done. Cleared on the Fold, the Pixel and the browser.');
  }

  /* ---------- wholesale approval ---------- */
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function approve() {
    var sel = pending().filter(function (c) { return c.checked; });
    if (!sel.length || S.busy) return;
    S.busy = true; renderWholesale();
    var chain = Promise.resolve();
    sel.forEach(function (c) {
      chain = chain.then(function () {
        c.state = 'running'; c.step = 0; renderWholesale();
        var inner = Promise.resolve();
        STEPS.forEach(function () { inner = inner.then(function () { return wait(reduce ? 0 : 300); }).then(function () { c.step++; renderWholesale(); }); });
        return inner.then(function () { c.state = 'approved'; S.dismissed[c.item] = true; });
      });
    });
    chain.then(function () {
      S.busy = false; render();
      toast(sel.length + (sel.length === 1 ? ' company' : ' companies') + ' approved. Send the welcome emails from the list below.');
    });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, [data-open], #scrim');
    if (!el) return;
    if (el.id === 'scrim') return closeSheet();
    if (el.hasAttribute('data-filter')) { S.filter = el.getAttribute('data-filter'); renderHome(); tick(); return; }
    if (el.hasAttribute('data-open')) return detail(el.getAttribute('data-open'));
    if (el.hasAttribute('data-go')) { if (el.hasAttribute('data-close')) closeSheet(); return go(el.getAttribute('data-go')); }
    if (el.hasAttribute('data-close')) return closeSheet();
    if (el.hasAttribute('data-done')) return dismiss(el.getAttribute('data-done'));
    if (el.hasAttribute('data-toast')) return toast(el.getAttribute('data-toast'));
    if (el.hasAttribute('data-confirm')) return confirmSheet(el.getAttribute('data-confirm'));
    if (el.hasAttribute('data-run')) {
      var k = el.getAttribute('data-run'); closeSheet();
      if (k === 'zendesk') { S.zendesk = true; render(); }
      return toast('Demo: nothing ran. On the real thing this starts the job on the beelink and shows the result here.');
    }
    if (el.hasAttribute('data-modact')) return toast('Phase 3: ' + el.getAttribute('data-modact') + ' straight from the app. For now, Open in Reddit.');
    if (el.hasAttribute('data-alert')) return showAlert();
    if (el.id === 'wh-go') return approve();
  });
  document.addEventListener('change', function (e) {
    var id = e.target.getAttribute && e.target.getAttribute('data-company');
    if (!id) return;
    COMPANIES.forEach(function (c) { if (c.id === id) c.checked = e.target.checked; });
    renderWholesale();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSheet(); hideAlert(); } });

  var lastWide = null;
  window.addEventListener('resize', function () {
    var w = window.matchMedia('(min-width:600px)').matches;
    if (w !== lastWide) { lastWide = w; renderHome(); tick(); }
  });

  /* ---------- start ---------- */
  render();
  lastWide = window.matchMedia('(min-width:600px)').matches;
  go((location.hash || '#home').slice(1), false);
  setInterval(tick, 15000);
  setTimeout(showAlert, 5000);
})();
