/* ═══════════════════════════════════════════════════
   جَزَرة — محرك المزامنة السحابية (Supabase)
   - الوالد: حساب بريد إلكتروني يملك صف العائلة
   - أجهزة الأطفال: تنضم برمز العائلة (بلا بريد)
   - الحالة كاملة تُرفع وتُسحب كمستند واحد (آخر كتابة تفوز)
   ═══════════════════════════════════════════════════ */

'use strict';

const SB_URL = 'https://uatsriqedhdaqpxkdiws.supabase.co';
const SB_KEY = 'sb_publishable_XhOPDqQWIC8UH7jvKJQNPg_1AJwZ8vF';
const SYNC_KEY = 'jazarah_sync_v1';

const Sync = {
  cfg: null,          // { mode:'parent'|'code', email, access_token, refresh_token, familyId, familyCode, lastVersion }
  applying: false,    // أثناء تطبيق حالة قادمة من السحابة — لا نعيد رفعها
  lastError: null,
  _pushTimer: null,
  _pollTimer: null,

  /* ─────── الإعداد والتهيئة ─────── */

  init() {
    try { this.cfg = JSON.parse(localStorage.getItem(SYNC_KEY)) || null; } catch (e) { this.cfg = null; }
    if (this.isConfigured()) {
      this.pullNow().catch(() => {});
      this.startPolling();
    }
  },

  isConfigured() { return !!(this.cfg && this.cfg.mode); },

  saveCfg() {
    if (this.cfg) localStorage.setItem(SYNC_KEY, JSON.stringify(this.cfg));
    else localStorage.removeItem(SYNC_KEY);
  },

  startPolling() {
    clearInterval(this._pollTimer);
    this._pollTimer = setInterval(() => {
      if (this.isConfigured()) this.pullNow().catch(() => {});
    }, 30000);
  },

  statusText() {
    if (!this.isConfigured()) return 'غير متصلة';
    if (this.cfg.mode === 'parent') return `متصلة كوالد (${this.cfg.email})`;
    return 'متصلة برمز العائلة';
  },

  /* ─────── طلبات HTTP ─────── */

  async _fetch(path, options = {}, useAuth = false) {
    const headers = Object.assign({
      'apikey': SB_KEY,
      'Content-Type': 'application/json',
    }, options.headers || {});
    if (useAuth && this.cfg && this.cfg.access_token) {
      headers['Authorization'] = 'Bearer ' + this.cfg.access_token;
    }
    let res = await fetch(SB_URL + path, Object.assign({}, options, { headers }));
    // انتهت صلاحية الجلسة → نجدد الرمز ونعيد المحاولة مرة
    if (res.status === 401 && useAuth && this.cfg && this.cfg.refresh_token) {
      const ok = await this._refreshToken();
      if (ok) {
        headers['Authorization'] = 'Bearer ' + this.cfg.access_token;
        res = await fetch(SB_URL + path, Object.assign({}, options, { headers }));
      }
    }
    return res;
  },

  async _refreshToken() {
    try {
      const res = await fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.cfg.refresh_token }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      this.cfg.access_token = data.access_token;
      this.cfg.refresh_token = data.refresh_token;
      this.saveCfg();
      return true;
    } catch (e) { return false; }
  },

  /* فحص أن جداول المزامنة جاهزة (هل نُفذ ملف SQL؟) */
  async checkSetup() {
    const res = await this._fetch('/rest/v1/rpc/family_pull', {
      method: 'POST',
      body: JSON.stringify({ code: '___check___' }),
    });
    if (res.status === 404) return { ok: false, reason: 'جداول المزامنة غير جاهزة — نفّذ ملف supabase-setup.sql في SQL Editor أولًا' };
    if (!res.ok && res.status !== 200) return { ok: false, reason: 'تعذر الوصول للخادم (رمز ' + res.status + ')' };
    return { ok: true };
  },

  /* ─────── حساب الوالد ─────── */

  async signup(email, password) {
    const res = await fetch(SB_URL + '/auth/v1/signup', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(this._authError(data));
    if (!data.access_token) {
      // تفعيل تأكيد البريد مفعل في المشروع
      return { needsConfirm: true };
    }
    this._storeSession(email, data);
    await this._afterLogin(data.user.id);
    return { needsConfirm: false };
  },

  async login(email, password) {
    const res = await fetch(SB_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(this._authError(data));
    this._storeSession(email, data);
    await this._afterLogin(data.user.id);
  },

  _authError(data) {
    const msg = (data && (data.msg || data.error_description || data.message)) || '';
    if (/already registered/i.test(msg)) return 'هذا البريد مسجل من قبل — استخدم "دخول"';
    if (/invalid login/i.test(msg)) return 'بريد أو كلمة مرور غير صحيحة';
    if (/at least 6/i.test(msg) || /password/i.test(msg)) return 'كلمة المرور قصيرة — 6 أحرف على الأقل';
    if (/not confirmed/i.test(msg)) return 'أكد بريدك أولًا من رسالة التفعيل ثم سجل الدخول';
    return msg || 'تعذر الاتصال بالخادم';
  },

  _storeSession(email, data) {
    this.cfg = Object.assign(this.cfg || {}, {
      mode: 'parent',
      email,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    this.saveCfg();
  },

  /* بعد الدخول: نجد صف العائلة أو ننشئه */
  async _afterLogin(userId) {
    const res = await this._fetch('/rest/v1/families?select=id,join_code,state,updated_at', { method: 'GET' }, true);
    if (!res.ok) throw new Error('جداول المزامنة غير جاهزة — نفّذ ملف supabase-setup.sql أولًا');
    const rows = await res.json();

    if (rows.length === 0) {
      // أول جهاز: نرفع بيانات هذا الجهاز وننشئ رمز العائلة
      const joinCode = 'JZ' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const create = await this._fetch('/rest/v1/families', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ owner: userId, join_code: joinCode, state: S }),
      }, true);
      if (!create.ok) throw new Error('تعذر إنشاء سجل العائلة');
      const created = (await create.json())[0];
      this.cfg.familyId = created.id;
      this.cfg.familyCode = created.join_code;
      this.cfg.lastVersion = created.updated_at;
      this.saveCfg();
    } else {
      const fam = rows[0];
      this.cfg.familyId = fam.id;
      this.cfg.familyCode = fam.join_code;
      this.saveCfg();
      // توجد بيانات سحابية: المستخدم يقرر أيها يبقى
      const cloudHasData = fam.state && fam.state.children;
      if (cloudHasData) {
        const useCloud = confirm('وجدنا بيانات عائلتك في السحابة ☁️\n\nموافق = استخدام بيانات السحابة على هذا الجهاز\nإلغاء = رفع بيانات هذا الجهاز بدلًا منها');
        if (useCloud) {
          this._applyState(fam.state, fam.updated_at);
        } else {
          await this.push();
        }
      } else {
        await this.push();
      }
    }
    this.startPolling();
  },

  logout() {
    clearInterval(this._pollTimer);
    clearTimeout(this._pushTimer);
    this.cfg = null;
    this.saveCfg();
  },

  /* ─────── الانضمام برمز العائلة (أجهزة الأطفال) ─────── */

  async joinWithCode(code) {
    code = String(code).trim().toUpperCase();
    if (!code) throw new Error('اكتب الرمز أولًا');
    const res = await this._fetch('/rest/v1/rpc/family_pull', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    if (res.status === 404) throw new Error('جداول المزامنة غير جاهزة — نفّذ ملف supabase-setup.sql أولًا');
    if (!res.ok) throw new Error('تعذر الاتصال بالخادم');
    const rows = await res.json();
    if (!rows.length) throw new Error('رمز غير صحيح — تأكد منه لدى والدك');
    this.cfg = { mode: 'code', familyCode: code };
    this.saveCfg();
    this._applyState(rows[0].state, rows[0].updated_at);
    this.startPolling();
  },

  /* ─────── الرفع والسحب ─────── */

  pushSoon() {
    if (!this.isConfigured() || this.applying) return;
    clearTimeout(this._pushTimer);
    this._pushTimer = setTimeout(() => this.push().catch(e => { this.lastError = e.message; }), 2500);
  },

  async push() {
    if (!this.isConfigured()) return;
    this.lastError = null;
    if (this.cfg.mode === 'code') {
      const res = await this._fetch('/rest/v1/rpc/family_push', {
        method: 'POST',
        body: JSON.stringify({ code: this.cfg.familyCode, new_state: S }),
      });
      if (!res.ok) throw new Error('فشل رفع البيانات');
      this.cfg.lastVersion = await res.json();
      this.saveCfg();
    } else {
      const res = await this._fetch('/rest/v1/families?id=eq.' + this.cfg.familyId, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ state: S }),
      }, true);
      if (!res.ok) throw new Error('فشل رفع البيانات');
      const rows = await res.json();
      if (rows.length) { this.cfg.lastVersion = rows[0].updated_at; this.saveCfg(); }
    }
  },

  async pullNow() {
    if (!this.isConfigured()) return;
    this.lastError = null;
    let row = null;
    if (this.cfg.mode === 'code') {
      const res = await this._fetch('/rest/v1/rpc/family_pull', {
        method: 'POST',
        body: JSON.stringify({ code: this.cfg.familyCode }),
      });
      if (!res.ok) throw new Error('تعذر السحب');
      const rows = await res.json();
      row = rows[0] || null;
    } else {
      const res = await this._fetch('/rest/v1/families?select=state,updated_at', { method: 'GET' }, true);
      if (!res.ok) throw new Error('تعذر السحب');
      const rows = await res.json();
      row = rows[0] || null;
    }
    if (row && row.state && row.state.children && row.updated_at !== this.cfg.lastVersion) {
      this._applyState(row.state, row.updated_at);
    }
  },

  /* تطبيق حالة قادمة من السحابة على هذا الجهاز */
  _applyState(state, version) {
    this.applying = true;
    try {
      S = state;
      // ضمان سلامة البنية بعد أي إصدار قديم
      if (!S.children || !S.children.length) S.children = [defaultChild('البطل')];
      S.children = S.children.map(c => Object.assign(defaultChild(), c));
      if (!S.children.find(c => c.id === S.activeChildId)) S.activeChildId = S.children[0].id;
      S.joinRequests = S.joinRequests || [];
      save();
      this.cfg.lastVersion = version;
      this.saveCfg();
      if (window.App && App.refreshAfterSync) App.refreshAfterSync();
    } finally {
      this.applying = false;
    }
  },
};

/* ─────── بيانات مركزية يديرها صاحب التطبيق (تقويم مدرسي + عروض) ───────
   قراءة عامة عبر المفتاح العلني، الكتابة من لوحة Supabase فقط */
const META_KEY = 'jazarah_meta_v1';

const Meta = {
  data: null,   // { calendar: [], offers: [], fetchedAt }

  load() {
    try { this.data = JSON.parse(localStorage.getItem(META_KEY)) || null; } catch (e) { this.data = null; }
  },

  saveMeta() { localStorage.setItem(META_KEY, JSON.stringify(this.data)); },

  calendar() { return (this.data && this.data.calendar) || []; },
  offers() { return (this.data && this.data.offers) || []; },

  /* أقرب حدث قادم من التقويم المركزي */
  nextEvent() {
    const today = new Date(new Date().toDateString());
    return this.calendar()
      .map(e => ({ ...e, d: new Date(e.start_date + 'T00:00:00') }))
      .filter(e => e.d >= today)
      .sort((a, b) => a.d - b.d)[0] || null;
  },

  daysTo(ev) {
    if (!ev) return null;
    return Math.round((ev.d - new Date(new Date().toDateString())) / 86400000);
  },

  /* جلب التقويم والعروض — مرة كل 12 ساعة كحد أقصى */
  async refresh(force) {
    this.load();
    if (!force && this.data && Date.now() - (this.data.fetchedAt || 0) < 12 * 3600 * 1000) return;
    try {
      const headers = { 'apikey': SB_KEY };
      const [calRes, offRes] = await Promise.all([
        fetch(SB_URL + '/rest/v1/app_calendar?select=title,kind,start_date,end_date&order=start_date.asc', { headers }),
        fetch(SB_URL + '/rest/v1/offers?select=id,partner,title,emoji,city,district,cost,code,ladder&active=eq.true', { headers }),
      ]);
      if (!calRes.ok && !offRes.ok) return;
      this.data = {
        calendar: calRes.ok ? await calRes.json() : this.calendar(),
        offers: offRes.ok ? await offRes.json() : this.offers(),
        fetchedAt: Date.now(),
      };
      this.saveMeta();
    } catch (e) { /* بلا إنترنت — نبقى على المخزن */ }
  },
};

Meta.load();
Meta.refresh();

Sync.init();
