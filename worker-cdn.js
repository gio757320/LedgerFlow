const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>LedgerFlow — Manrique & Associates</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display&display=swap">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
<style>
/* ── Design tokens ───────────────────────────────────────────── */
:root {
  --navy:   #0f1f3d;
  --navy2:  #1a3260;
  --green:  #2e9e6b;
  --green2: #24885a;
  --gold:   #c9963a;
  --red:    #d94f4f;
  --bg:     #f4f6f9;
  --surface:#ffffff;
  --border: #dde2ea;
  --text:   #1a2535;
  --muted:  #6b7a8f;
  --sidebar-w: 220px;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:     #0d1117;
    --surface:#161c27;
    --border: #2a3344;
    --text:   #e2e8f0;
    --muted:  #8899aa;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg:     #0d1117;
  --surface:#161c27;
  --border: #2a3344;
  --text:   #e2e8f0;
  --muted:  #8899aa;
  color-scheme: dark;
}

/* ── Reset / base ────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; font-family: 'Inter', system-ui, sans-serif; font-size: 14px; }
body { background: var(--bg); color: var(--text); display: flex; flex-direction: column; }
a { color: var(--green); text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
input, select, textarea { font-family: inherit; font-size: 14px; }
[hidden] { display: none !important; }

/* ── Login screen ────────────────────────────────────────────── */
#login-screen {
  flex: 1; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%);
  padding: 24px;
}
.login-card {
  background: var(--surface); border-radius: 16px; padding: 48px 40px;
  width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,.35);
}
.login-logo {
  display: flex; align-items: center; gap: 10px; margin-bottom: 32px;
}
.login-logo-mark {
  width: 42px; height: 42px; border-radius: 10px;
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Serif Display', serif; color: #fff; font-size: 22px;
}
.login-logo-name { font-weight: 700; font-size: 20px; color: var(--text); }
.login-logo-name span { color: var(--green); }
.login-h { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.login-sub { color: var(--muted); margin-bottom: 28px; font-size: 13px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
.form-group input {
  width: 100%; padding: 10px 14px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--bg);
  color: var(--text); outline: none; transition: border-color .15s;
}
.form-group input:focus { border-color: var(--green); }
#login-btn {
  width: 100%; padding: 12px; border-radius: 8px;
  background: var(--green); color: #fff; font-weight: 600; font-size: 15px;
  margin-top: 8px; transition: background .15s;
}
#login-btn:hover { background: var(--green2); }
#login-btn:disabled { opacity: .6; cursor: not-allowed; }
#login-error { color: var(--red); font-size: 13px; margin-top: 10px; min-height: 18px; }
.login-firm { text-align: center; margin-top: 24px; color: var(--muted); font-size: 12px; }

/* ── App shell (after login) ─────────────────────────────────── */
#app-shell { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* Top bar */
#topbar {
  height: 56px; background: var(--navy); color: #fff;
  display: flex; align-items: center; padding: 0 20px;
  gap: 12px; flex-shrink: 0; z-index: 100;
}
#topbar-logo { font-family: 'DM Serif Display', serif; font-size: 20px; letter-spacing: -.3px; }
#topbar-logo span { color: var(--gold); }
#topbar-client-badge {
  background: rgba(255,255,255,.12); border-radius: 20px;
  padding: 3px 12px; font-size: 12px; font-weight: 500;
}
#topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
#topbar-user { font-size: 13px; opacity: .8; }
#topbar-role-badge {
  font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
  background: rgba(46,158,107,.25); color: #6dffc1;
}
#logout-btn { font-size: 12px; opacity: .7; color: #fff; padding: 4px 8px; }
#logout-btn:hover { opacity: 1; }

/* Layout */
#shell { flex: 1; display: flex; overflow: hidden; }

/* Sidebar */
#sidenav {
  width: var(--sidebar-w); background: var(--surface);
  border-right: 1px solid var(--border); display: flex;
  flex-direction: column; flex-shrink: 0; overflow-y: auto;
}
.nav-section { padding: 16px 0 4px; }
.nav-label {
  padding: 0 16px 6px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em; color: var(--muted);
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px; cursor: pointer; border-radius: 0;
  color: var(--text); font-size: 13px; font-weight: 500;
  transition: background .1s; border-left: 3px solid transparent;
  user-select: none; width: 100%; text-align: left;
}
.nav-item:hover { background: var(--bg); }
.nav-item.active {
  background: rgba(46,158,107,.1); color: var(--green);
  border-left-color: var(--green); font-weight: 600;
}
.nav-item .icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
.nav-item .badge {
  margin-left: auto; background: var(--red); color: #fff;
  font-size: 10px; font-weight: 700; border-radius: 10px;
  padding: 1px 6px; min-width: 18px; text-align: center;
}
.nav-divider { height: 1px; background: var(--border); margin: 8px 0; }
#client-select-wrap { padding: 12px 12px 4px; }
#client-select {
  width: 100%; padding: 7px 10px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--bg);
  color: var(--text); font-size: 13px; outline: none;
}
#client-select:focus { border-color: var(--green); }
#nav-routeworth-section { border-top: 1px solid var(--border); margin-top: auto; }

/* Main column */
#main-col { flex: 1; display: flex; flex-direction: column; overflow: auto; min-width: 0; }

/* Page header */
.page-header {
  background: var(--navy); color: #fff; padding: 20px 28px 0;
  flex-shrink: 0;
}
.page-header-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.page-title { font-family: 'DM Serif Display', serif; font-size: 24px; }
.page-sub { font-size: 13px; opacity: .7; margin-top: 4px; }
.page-actions { display: flex; gap: 8px; flex-shrink: 0; margin-top: 4px; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; }
.btn-primary { background: var(--green); color: #fff; }
.btn-primary:hover { background: var(--green2); }
.btn-secondary { background: rgba(255,255,255,.12); color: #fff; }
.btn-secondary:hover { background: rgba(255,255,255,.2); }
.btn-sm { padding: 6px 12px; font-size: 12px; }

/* KPI strip */
.kpi-strip { display: flex; gap: 0; margin-top: 20px; }
.kpi {
  flex: 1; padding: 12px 16px; border-right: 1px solid rgba(255,255,255,.1);
  min-width: 0;
}
.kpi:last-child { border-right: none; }
.kpi-val { font-size: 22px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; }
.kpi-label { font-size: 11px; opacity: .65; margin-top: 4px; text-transform: uppercase; letter-spacing: .04em; }

/* Tab bar */
.tab-bar {
  display: flex; background: var(--navy); padding: 0 28px;
  border-bottom: 2px solid var(--border); flex-shrink: 0;
}
.tab-btn {
  padding: 10px 16px; font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,.6); border-bottom: 2px solid transparent;
  margin-bottom: -2px; white-space: nowrap; cursor: pointer;
  transition: color .15s, border-color .15s; background: none;
}
.tab-btn:hover { color: rgba(255,255,255,.9); }
.tab-btn.active { color: #fff; border-bottom-color: var(--gold); font-weight: 600; }

/* Main scroll area */
#main { flex: 1; overflow-y: auto; padding: 24px 28px; }

/* ── Shared components ───────────────────────────────────────── */
.section-h { font-size: 15px; font-weight: 700; margin-bottom: 14px; color: var(--text); }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: visible; margin-bottom: 20px; }
.card table { width: 100%; }
.card .table-wrap { overflow-x: auto; }
.card-h { padding: 14px 18px; border-bottom: 1px solid var(--border); font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; }
.card-body { padding: 18px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); background: var(--bg); text-align: left; }
td { padding: 11px 14px; border-top: 1px solid var(--border); vertical-align: middle; }
tr:hover td { background: rgba(46,158,107,.04); }
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-green  { background: rgba(46,158,107,.15); color: var(--green); }
.badge-gold   { background: rgba(201,150,58,.15);  color: var(--gold); }
.badge-red    { background: rgba(217,79,79,.15);   color: var(--red); }
.badge-blue   { background: rgba(66,133,244,.15);  color: #4285f4; }
.badge-grey   { background: var(--bg);             color: var(--muted); border: 1px solid var(--border); }
.empty { text-align: center; padding: 48px 24px; color: var(--muted); }
.empty .empty-icon { font-size: 36px; margin-bottom: 10px; }
.spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--green); border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-block { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 48px; color: var(--muted); }
.alert { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
.alert-red { background: rgba(217,79,79,.1); color: var(--red); border: 1px solid rgba(217,79,79,.25); }
.alert-gold { background: rgba(201,150,58,.1); color: var(--gold); border: 1px solid rgba(201,150,58,.25); }
.alert-green { background: rgba(46,158,107,.1); color: var(--green); border: 1px solid rgba(46,158,107,.25); }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 700px) { .two-col { grid-template-columns: 1fr; } }

/* ── Dashboard ───────────────────────────────────────────────── */
#dash-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
@media (max-width: 700px) { #dash-kpi-row { grid-template-columns: 1fr 1fr; } }
.stat-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 18px; display: flex; flex-direction: column; gap: 6px;
}
.stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
.stat-val { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--text); }
.stat-sub { font-size: 12px; color: var(--muted); }
.stat-green { border-left: 3px solid var(--green); }
.stat-gold  { border-left: 3px solid var(--gold); }
.stat-red   { border-left: 3px solid var(--red); }
.stat-blue  { border-left: 3px solid #4285f4; }

/* ── Chart ───────────────────────────────────────────────────── */
.mini-bar-wrap { display: flex; gap: 6px; align-items: flex-end; height: 80px; }
.mini-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
.mini-bar { background: var(--green); border-radius: 4px 4px 0 0; min-height: 4px; transition: height .3s; }
.mini-bar-label { font-size: 10px; color: var(--muted); }
.mini-bar-val { font-size: 10px; color: var(--muted); font-variant-numeric: tabular-nums; }

/* ── Accounts ────────────────────────────────────────────────── */
.acct-type { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); background: var(--bg); padding: 6px 14px; }

/* ── Journal ────────────────────────────────────────────────── */
.je-line-table th, .je-line-table td { padding: 8px 12px; }

/* ── Modal ────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.55);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: var(--surface); border-radius: 14px; width: 100%; max-width: 540px;
  max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,.4);
}
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.modal-header h3 { font-size: 16px; font-weight: 700; }
.modal-close { font-size: 20px; color: var(--muted); line-height: 1; padding: 2px; }
.modal-body { padding: 22px; overflow-y: auto; flex: 1; }
.modal-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; flex-shrink: 0; }
.btn-outline { background: none; border: 1.5px solid var(--border); color: var(--text); }
.btn-outline:hover { border-color: var(--muted); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-field { margin-bottom: 16px; }
.form-field label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
.form-field input, .form-field select, .form-field textarea {
  width: 100%; padding: 9px 12px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--bg); color: var(--text);
  outline: none; transition: border-color .15s;
}
.form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: var(--green); }

/* ── Responsive sidebar ──────────────────────────────────────── */
@media (max-width: 768px) {
  :root { --sidebar-w: 0px; }
  #sidenav { position: fixed; left: 0; top: 56px; bottom: 0; width: 240px; z-index: 200; transform: translateX(-100%); transition: transform .25s; }
  #sidenav.open { transform: translateX(0); }
  #menu-btn { display: flex !important; }
}
#menu-btn { display: none; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,.12); color: #fff; font-size: 18px; }

/* ── RouteWorth packages ─────────────────────────────────────── */
.rw-pkg { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; margin-bottom: 12px; }
.rw-pkg-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rw-pkg-code { font-family: monospace; font-size: 12px; color: var(--muted); }
.rw-pkg-name { font-weight: 600; font-size: 14px; }
.rw-pkg-meta { font-size: 12px; color: var(--muted); margin-top: 4px; }
</style>
</head>
<body>

<!-- ══ LOGIN SCREEN ══════════════════════════════════════════ -->
<div id="login-screen">
  <div class="login-card">
    <div class="login-logo">
      <div class="login-logo-mark">M</div>
      <div>
        <div class="login-logo-name">Ledger<span>Flow</span></div>
        <div style="font-size:11px;color:var(--muted);margin-top:1px;">Manrique &amp; Associates LLC</div>
      </div>
    </div>
    <div class="login-h">Sign in to your account</div>
    <div class="login-sub">Secure access for staff and clients</div>

    <!-- Login type tabs -->
    <div style="display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:20px">
      <button id="tab-staff" onclick="switchLoginTab('staff')" style="flex:1;padding:9px;font-size:13px;font-weight:600;border:none;cursor:pointer;background:var(--green);color:#fff;transition:all .2s">Staff</button>
      <button id="tab-client" onclick="switchLoginTab('client')" style="flex:1;padding:9px;font-size:13px;font-weight:600;border:none;cursor:pointer;background:transparent;color:var(--muted);transition:all .2s">Client</button>
    </div>

    <!-- Staff login (password) -->
    <div id="login-staff-panel">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="login-email" placeholder="you@example.com" autocomplete="email">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="login-password" placeholder="••••••••" autocomplete="current-password">
      </div>
      <button id="login-btn">Sign in</button>
      <div id="login-error"></div>
      <div style="text-align:right;margin-top:8px">
        <a href="#" id="forgot-link" style="font-size:12px;color:var(--green)">Forgot password?</a>
      </div>
    </div>

    <!-- Client login (OTP code) -->
    <div id="login-client-panel" hidden="hidden">
      <!-- Step 1: enter email -->
      <div id="otp-step1">
        <div class="form-group">
          <label>Your email address</label>
          <input type="email" id="otp-email" placeholder="you@example.com" autocomplete="email">
        </div>
        <button id="otp-send-btn" style="width:100%;padding:12px;border:none;border-radius:8px;background:var(--green);color:#fff;font-size:15px;font-weight:600;cursor:pointer">Send Code</button>
        <div id="otp-send-error" style="color:var(--red);font-size:13px;margin-top:10px;min-height:18px"></div>
      </div>
      <!-- Step 2: enter code -->
      <div id="otp-step2" hidden>
        <div style="font-size:13px;color:var(--muted);margin-bottom:16px">We sent a 6-digit code to <strong id="otp-email-shown"></strong>. Check your inbox.</div>
        <div class="form-group">
          <label>Enter your code</label>
          <input type="text" id="otp-code" placeholder="123456" maxlength="10" autocomplete="one-time-code" style="font-size:22px;letter-spacing:4px;text-align:center">
        </div>
        <button id="otp-verify-btn" style="width:100%;padding:12px;border:none;border-radius:8px;background:var(--green);color:#fff;font-size:15px;font-weight:600;cursor:pointer">Verify Code</button>
        <div id="otp-verify-error" style="color:var(--red);font-size:13px;margin-top:10px;min-height:18px"></div>
        <div style="text-align:center;margin-top:12px">
          <a href="#" id="otp-back-link" style="font-size:12px;color:var(--muted)">← Use a different email</a>
        </div>
      </div>
    </div>

    <div class="login-firm">Manrique &amp; Associates LLC &nbsp;·&nbsp; Secure Portal</div>
  </div>
</div>

<!-- ══ APP SHELL ═════════════════════════════════════════════ -->
<div id="app-shell" hidden>

  <!-- Top bar -->
  <div id="topbar">
    <button id="menu-btn" aria-label="Menu">☰</button>
    <div id="topbar-logo">Ledger<span>Flow</span></div>
    <div id="topbar-client-badge" hidden></div>
    <div id="client-portal-banner" hidden style="font-size:12px;font-weight:600;color:var(--gold);background:rgba(201,150,58,.12);border:1px solid rgba(201,150,58,.3);border-radius:6px;padding:3px 10px;letter-spacing:.03em;">CLIENT PORTAL</div>
    <div id="topbar-right">
      <span id="topbar-user"></span>
      <span id="topbar-role-badge"></span>
      <button id="logout-btn">Sign out</button>
    </div>
  </div>

  <div id="shell">
    <!-- Sidebar -->
    <nav id="sidenav">
      <!-- Client selector (staff only) -->
      <div id="client-select-wrap" hidden>
        <select id="client-select">
          <option value="">— All Clients —</option>
        </select>
      </div>

      <div class="nav-section">
        <div class="nav-label">Main</div>
        <button class="nav-item active" data-screen="dashboard" id="nav-dashboard-btn">
          <span class="icon">📊</span> <span id="nav-dashboard-label">Dashboard</span>
        </button>
        <button class="nav-item" data-screen="clients" id="nav-clients-btn">
          <span class="icon">👥</span> Clients
        </button>
        <button class="nav-item" data-screen="accounts" id="nav-accounts-btn">
          <span class="icon">📒</span> Chart of Accounts
        </button>
        <button class="nav-item" data-screen="journal" id="nav-journal-btn">
          <span class="icon">📋</span> Journal Entries
        </button>
        <button class="nav-item" data-screen="expenses" id="nav-expenses-btn">
          <span class="icon">🧾</span> Expenses
        </button>
        <button class="nav-item" data-screen="invoices" id="nav-invoices-btn">
          <span class="icon">📄</span> My Invoices
        </button>
        <button class="nav-item" data-screen="income" id="nav-income-btn">
          <span class="icon">💰</span> Income
        </button>
        <button class="nav-item" data-screen="coa" id="nav-coa-btn">
          <span class="icon">📋</span> Chart of Accounts
        </button>
        <button class="nav-item" data-screen="messages" id="nav-messages-btn">
          <span class="icon">💬</span> Messages
          <span class="badge" id="nav-messages-badge" hidden style="margin-left:auto;background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px"></span>
        </button>
      </div>

      <div class="nav-divider" id="nav-payrolltax-divider"></div>
      <div class="nav-section" id="nav-payrolltax-section">
        <div class="nav-label">Payroll &amp; Tax</div>
        <button class="nav-item" data-screen="payroll" id="nav-payroll-btn">
          <span class="icon">💼</span> Payroll
        </button>
        <button class="nav-item" data-screen="tax" id="nav-tax-btn">
          <span class="icon">🏛</span> Tax Returns
        </button>
      </div>

      <div class="nav-divider"></div>
      <div class="nav-section" id="nav-staff-only">
        <div class="nav-label">Firm</div>
        <button class="nav-item" data-screen="reports">
          <span class="icon">📈</span> Reports
        </button>
        <button class="nav-item" data-screen="routeworth">
          <span class="icon">🚗</span> RouteWorth Packages
        </button>
      </div>

      <!-- Client portal footer info -->
      <div id="nav-client-footer" hidden style="margin-top:auto;padding:16px;border-top:1px solid var(--border)">
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Your Firm</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">Manrique &amp; Associates</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">Secure Client Portal</div>
      </div>
    </nav>

    <!-- Main column -->
    <div id="main-col">
      <div id="screen-container">
        <!-- screens injected here -->
      </div>
    </div>
  </div>
</div>

<script>
// ════════════════════════════════════════════════════════════
//  CONFIG
// ════════════════════════════════════════════════════════════
const SUPA_URL = 'https://ssflitvilylhdeuabfyu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZmxpdHZpbHlsaGRldWFiZnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NTYwNzAsImV4cCI6MjEwOTMzMjA3MH0.yTdW1VYQWJyyk0V8LtP5A8W2IVLZDAbxML61VvyU364';
const sb = supabase.createClient(SUPA_URL, SUPA_ANON);

// ════════════════════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════════════════════
let STATE = {
  user: null,
  staffRow: null,
  isStaff: false,
  isAdmin: false,
  clientRows: [],
  selectedClientId: null,
  currentScreen: 'dashboard'
};

// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════
(async () => {
  const {
    data: {
      session
    }
  } = await sb.auth.getSession();
  if (session) await onSignedIn(session.user);
  sb.auth.onAuthStateChange((ev, session) => {
    if (ev === 'PASSWORD_RECOVERY') {
      // Show a "set new password" form instead of the app
      showPasswordResetForm();
      return;
    }
    if (session) onSignedIn(session.user);else onSignedOut();
  });

  // Login form
  // ── Login tab switching ──────────────────────────────────────
  window.switchLoginTab = function(tab) {
    const isStaff = tab === 'staff';
    document.getElementById('login-staff-panel').hidden = !isStaff;
    document.getElementById('login-client-panel').hidden = isStaff;
    document.getElementById('tab-staff').style.background = isStaff ? 'var(--green)' : 'var(--surface)';
    document.getElementById('tab-staff').style.color = isStaff ? '#fff' : 'var(--muted)';
    document.getElementById('tab-client').style.background = isStaff ? 'var(--surface)' : 'var(--green)';
    document.getElementById('tab-client').style.color = isStaff ? 'var(--muted)' : '#fff';
  };

  // ── OTP send ────────────────────────────────────────────────
  document.getElementById('otp-send-btn').addEventListener('click', async () => {
    const email = document.getElementById('otp-email').value.trim();
    const errEl = document.getElementById('otp-send-error');
    const btn = document.getElementById('otp-send-btn');
    errEl.textContent = '';
    if (!email) { errEl.textContent = 'Please enter your email address.'; return; }
    btn.disabled = true;
    btn.textContent = 'Sending…';
    const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    btn.disabled = false;
    btn.textContent = 'Send Code';
    if (error) {
      errEl.textContent = error.message.includes('not found') || error.message.includes('signup') || error.message.includes('disabled')
        ? 'No client account found for that email. Please contact Manrique & Associates.'
        : 'Error: ' + error.message;
    } else {
      document.getElementById('otp-email-shown').textContent = email;
      document.getElementById('otp-step1').hidden = true;
      document.getElementById('otp-step2').hidden = false;
      document.getElementById('otp-code').focus();
    }
  });

  // ── OTP verify ──────────────────────────────────────────────
  document.getElementById('otp-verify-btn').addEventListener('click', async () => {
    const email = document.getElementById('otp-email').value.trim();
    const token = document.getElementById('otp-code').value.trim();
    const errEl = document.getElementById('otp-verify-error');
    const btn = document.getElementById('otp-verify-btn');
    errEl.textContent = '';
    if (!token) { errEl.textContent = 'Please enter the code from your email.'; return; }
    btn.disabled = true;
    btn.textContent = 'Verifying…';
    const { error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
    btn.disabled = false;
    btn.textContent = 'Verify Code';
    if (error) {
      errEl.textContent = error.message.includes('expired') || error.message.includes('invalid')
        ? 'Invalid or expired code. Please try again.'
        : 'Error: ' + error.message;
    }
    // On success, onSignedIn fires automatically via auth state change
  });

  // ── OTP back link ───────────────────────────────────────────
  document.getElementById('otp-back-link').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('otp-step1').hidden = false;
    document.getElementById('otp-step2').hidden = true;
    document.getElementById('otp-verify-error').textContent = '';
    document.getElementById('otp-code').value = '';
  });

  document.getElementById('otp-code').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('otp-verify-btn').click();
  });

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('forgot-link').addEventListener('click', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if (!email) {
      document.getElementById('login-error').textContent = 'Enter your email address first.';
      return;
    }
    const {
      error
    } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://noisy-glitter-bdba.gio757.workers.dev'
    });
    const errEl = document.getElementById('login-error');
    if (error) {
      errEl.style.color = 'var(--red)';
      errEl.textContent = 'Error: ' + error.message;
    } else {
      errEl.style.color = 'var(--green)';
      errEl.textContent = 'Password reset email sent! Check your inbox.';
    }
  });
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await sb.auth.signOut();
  });

  // Sidebar navigation
  document.getElementById('sidenav').addEventListener('click', e => {
    const btn = e.target.closest('[data-screen]');
    if (!btn) return;
    navigateTo(btn.dataset.screen);
  });

  // Client selector
  document.getElementById('client-select').addEventListener('change', e => {
    STATE.selectedClientId = e.target.value || null;
    renderScreen(STATE.currentScreen);
  });

  // Mobile menu
  document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('sidenav').classList.toggle('open');
  });

  // Close sidebar on main click (mobile)
  document.getElementById('main-col').addEventListener('click', () => {
    document.getElementById('sidenav').classList.remove('open');
  });
})();

// ════════════════════════════════════════════════════════════
//  AUTH HELPERS
// ════════════════════════════════════════════════════════════
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pwd = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  errEl.textContent = '';
  if (!email || !pwd) {
    errEl.textContent = 'Please enter your email and password.';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Signing in…';
  const {
    error
  } = await sb.auth.signInWithPassword({
    email,
    password: pwd
  });
  btn.disabled = false;
  btn.textContent = 'Sign in';
  if (error) errEl.textContent = error.message;
}
function showPasswordResetForm() {
  // Hide login screen and app, show a simple set-password form
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app-shell').hidden = true;
  let el = document.getElementById('pw-reset-screen');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pw-reset-screen';
    el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:var(--bg);z-index:999';
    el.innerHTML = "\\n      <div style=\\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:36px;width:100%;max-width:380px;box-shadow:0 8px 32px rgba(0,0,0,.3)\\">\\n        <div style=\\"font-size:22px;font-weight:700;color:var(--text);margin-bottom:6px\\">Set New Password</div>\\n        <div style=\\"font-size:13px;color:var(--muted);margin-bottom:24px\\">Enter a new password for your account.</div>\\n        <label style=\\"font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em\\">New Password</label>\\n        <input type=\\"password\\" id=\\"new-pw-input\\" placeholder=\\"••••••••\\" autocomplete=\\"new-password\\"\\n          style=\\"width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;margin-top:6px;margin-bottom:16px;box-sizing:border-box\\">\\n        <label style=\\"font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em\\">Confirm Password</label>\\n        <input type=\\"password\\" id=\\"new-pw-confirm\\" placeholder=\\"••••••••\\" autocomplete=\\"new-password\\"\\n          style=\\"width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;margin-top:6px;margin-bottom:20px;box-sizing:border-box\\">\\n        <div id=\\"new-pw-msg\\" style=\\"font-size:13px;min-height:18px;margin-bottom:12px\\"></div>\\n        <button id=\\"new-pw-btn\\" class=\\"btn btn-primary\\" style=\\"width:100%;padding:12px\\">Set Password</button>\\n      </div>";
    document.body.appendChild(el);
    document.getElementById('new-pw-btn').addEventListener('click', async () => {
      const pw = document.getElementById('new-pw-input').value;
      const pw2 = document.getElementById('new-pw-confirm').value;
      const msg = document.getElementById('new-pw-msg');
      if (pw.length < 6) {
        msg.style.color = 'var(--red)';
        msg.textContent = 'Password must be at least 6 characters.';
        return;
      }
      if (pw !== pw2) {
        msg.style.color = 'var(--red)';
        msg.textContent = 'Passwords do not match.';
        return;
      }
      document.getElementById('new-pw-btn').disabled = true;
      document.getElementById('new-pw-btn').textContent = 'Saving…';
      const {
        error
      } = await sb.auth.updateUser({
        password: pw
      });
      if (error) {
        msg.style.color = 'var(--red)';
        msg.textContent = 'Error: ' + error.message;
        document.getElementById('new-pw-btn').disabled = false;
        document.getElementById('new-pw-btn').textContent = 'Set Password';
      } else {
        msg.style.color = 'var(--green)';
        msg.textContent = '✓ Password updated! Signing you in…';
        setTimeout(() => {
          el.remove();
        }, 1500);
      }
    });
  }
  el.hidden = false;
}
async function onSignedIn(user) {
  STATE.user = user;

  // Check if staff
  const {
    data: staffRow
  } = await sb.from('staff').select('*').eq('auth_user_id', user.id).maybeSingle();
  STATE.staffRow = staffRow;
  STATE.isStaff = !!staffRow;
  STATE.isAdmin = (staffRow === null || staffRow === void 0 ? void 0 : staffRow.role) === 'admin';
  if (STATE.isStaff) {
    const {
      data: clients
    } = await sb.from('clients').select('id,full_name,entity_type').order('full_name');
    STATE.clientRows = clients || [];
    populateClientSelect();
  } else {
    // Client portal: look up this user's client record
    const {
      data: clientRow
    } = await sb.from('clients').select('*').eq('auth_user_id', user.id).maybeSingle();
    STATE.clientRow = clientRow || null;
    STATE.selectedClientId = (clientRow === null || clientRow === void 0 ? void 0 : clientRow.id) || null;
  }
  showApp();
}
function onSignedOut() {
  if (window._notifInterval) { clearInterval(window._notifInterval); window._notifInterval = null; }
  STATE = {
    user: null,
    staffRow: null,
    isStaff: false,
    isAdmin: false,
    clientRows: [],
    clientRow: null,
    selectedClientId: null,
    currentScreen: 'dashboard'
  };
  document.getElementById('login-screen').hidden = false;
  document.getElementById('app-shell').hidden = true;
}
function showApp() {
  var _STATE$clientRow;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app-shell').hidden = false;

  // Topbar
  const email = STATE.user.email;
  document.getElementById('topbar-user').textContent = STATE.isStaff ? email.split('@')[0] : ((_STATE$clientRow = STATE.clientRow) === null || _STATE$clientRow === void 0 ? void 0 : _STATE$clientRow.full_name) || email.split('@')[0];
  document.getElementById('topbar-role-badge').textContent = STATE.isAdmin ? 'Admin' : STATE.isStaff ? 'Staff' : 'Client';

  // Sidebar: staff-only sections
  document.getElementById('nav-clients-btn').hidden = !STATE.isStaff;
  document.getElementById('nav-staff-only').hidden = !STATE.isStaff;
  document.getElementById('client-select-wrap').hidden = !STATE.isStaff;
  // Client-specific nav: hide accounts/clients from client portal
  document.getElementById('nav-accounts-btn').hidden = !STATE.isStaff;
  document.getElementById('nav-invoices-btn').hidden = STATE.isStaff;
  document.getElementById('nav-income-btn').hidden = STATE.isStaff;
  document.getElementById('nav-coa-btn').hidden = false; // visible to both

  // Relabel "Dashboard" to "My Account" for client portal
  const dashLabel = document.getElementById('nav-dashboard-label');
  if (dashLabel) dashLabel.textContent = STATE.isStaff ? 'Dashboard' : 'My Account';

  // Show/hide client footer in sidebar
  const navClientFooter = document.getElementById('nav-client-footer');
  if (navClientFooter) navClientFooter.hidden = STATE.isStaff;

  // Client portal banner
  const banner = document.getElementById('client-portal-banner');
  if (banner) banner.hidden = STATE.isStaff;

  // Filter nav items by client services
  if (!STATE.isStaff && STATE.clientRow) {
    const svcs = STATE.clientRow.services || ['tax'];
    const hasBookkeeping = svcs.includes('bookkeeping');
    const hasPayroll = svcs.includes('payroll');
    const hasTax = svcs.includes('tax');

    // Expenses — visible to all clients (everyone has expenses)
    const expensesBtn = document.getElementById('nav-expenses-btn');
    if (expensesBtn) expensesBtn.hidden = false;

    // My Invoices, Income — client only
    const invoicesBtn = document.getElementById('nav-invoices-btn');
    if (invoicesBtn) invoicesBtn.hidden = false;
    const incomeBtn = document.getElementById('nav-income-btn');
    if (incomeBtn) incomeBtn.hidden = false;

    // Journal Entries — only for bookkeeping or payroll clients
    const journalBtn = document.getElementById('nav-journal-btn');
    if (journalBtn) journalBtn.hidden = !hasBookkeeping && !hasPayroll;

    // Payroll — only for payroll clients
    const payrollBtn = document.getElementById('nav-payroll-btn');
    if (payrollBtn) payrollBtn.hidden = !hasPayroll;

    // Tax Returns — only for tax clients
    const taxBtn = document.getElementById('nav-tax-btn');
    if (taxBtn) taxBtn.hidden = !hasTax;

    // Hide the whole Payroll & Tax section if neither applies
    const ptSection = document.getElementById('nav-payrolltax-section');
    const ptDivider = document.getElementById('nav-payrolltax-divider');
    if (ptSection) ptSection.hidden = !hasPayroll && !hasTax;
    if (ptDivider) ptDivider.hidden = !hasPayroll && !hasTax;
  }

  navigateTo('dashboard');

  // Start notification badge polling (every 60 seconds)
  if (window._notifInterval) clearInterval(window._notifInterval);
  refreshNotificationBadges();
  window._notifInterval = setInterval(refreshNotificationBadges, 60000);
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════════
function navigateTo(screen) {
  STATE.currentScreen = screen;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.screen === screen));
  renderScreen(screen);
}
function renderScreen(screen) {
  const container = document.getElementById('screen-container');
  switch (screen) {
    case 'dashboard':
      renderDashboard(container);
      break;
    case 'clients':
      renderClients(container);
      break;
    case 'accounts':
      renderAccounts(container);
      break;
    case 'expenses':
      renderExpenses(container);
      break;
    case 'invoices':
      renderClientInvoices(container);
      break;
    case 'income':
      renderIncome(container);
      break;
    case 'coa':
      renderChartOfAccounts(container);
      break;
    case 'journal':
      renderJournal(container);
      break;
    case 'payroll':
      renderPayroll(container);
      break;
    case 'tax':
      renderTax(container);
      break;
    case 'reports':
      renderReports(container);
      break;
    case 'routeworth':
      renderRouteWorth(container);
      break;
    case 'messages':
      STATE.isStaff ? renderAdminMessages(container) : renderClientMessages(container);
      break;
    default:
      container.innerHTML = '<div class="loading-block">Screen not found.</div>';
  }
}

// ════════════════════════════════════════════════════════════
//  MESSAGES — ADMIN SIDE
// ════════════════════════════════════════════════════════════
async function renderAdminMessages(container) {
  container.innerHTML = pageShell('Messages', 'Client Conversations', '', \`
    <div class="two-col" style="align-items:flex-start">
      <div class="card" style="min-height:400px">
        <div class="card-h">Conversations</div>
        <div class="card-body" id="msg-conv-list"><span class="spinner"></span></div>
      </div>
      <div class="card" style="min-height:400px" id="msg-thread-card">
        <div class="card-h" id="msg-thread-title">Select a client</div>
        <div class="card-body" id="msg-thread-body" style="display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px">
          Choose a conversation on the left
        </div>
      </div>
    </div>
  \`);

  // Load conversation list (one entry per client that has messages OR all clients)
  const { data: clients } = await sb.from('clients').select('id,full_name,status').eq('status','active').order('full_name');
  const { data: msgs } = await sb.from('client_messages').select('client_id,body,created_at,read_by_staff,sender_role').order('created_at', { ascending: false });

  const listEl = document.getElementById('msg-conv-list');
  if (!listEl) return;

  // Build unread count per client
  const unreadMap = {};
  const lastMsgMap = {};
  (msgs || []).forEach(m => {
    if (!lastMsgMap[m.client_id]) lastMsgMap[m.client_id] = m;
    if (!m.read_by_staff && m.sender_role === 'client') {
      unreadMap[m.client_id] = (unreadMap[m.client_id] || 0) + 1;
    }
  });

  // Sort clients: unread first, then those with messages, then rest
  const sorted = (clients || []).sort((a, b) => {
    const au = unreadMap[a.id] || 0, bu = unreadMap[b.id] || 0;
    if (au !== bu) return bu - au;
    const al = lastMsgMap[a.id], bl = lastMsgMap[b.id];
    if (al && !bl) return -1;
    if (!al && bl) return 1;
    if (al && bl) return new Date(bl.created_at) - new Date(al.created_at);
    return 0;
  });

  listEl.innerHTML = sorted.map(cl => {
    const unread = unreadMap[cl.id] || 0;
    const last = lastMsgMap[cl.id];
    const preview = last ? esc(last.body.slice(0, 50)) + (last.body.length > 50 ? '…' : '') : '<span style="color:var(--muted)">No messages yet</span>';
    const timeStr = last ? new Date(last.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '';
    return \`<div onclick="openAdminThread('\${esc(cl.id)}','\${esc(cl.full_name)}')"
      style="padding:12px;border-bottom:1px solid var(--border);cursor:pointer;border-radius:6px;transition:background .15s"
      onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''"
      id="conv-row-\${esc(cl.id)}">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-weight:\${unread?'700':'500'};font-size:13px;flex:1">\${esc(cl.full_name)}</div>
        \${unread ? \`<span style="background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px">\${unread}</span>\` : ''}
        <span style="font-size:11px;color:var(--muted)">\${timeStr}</span>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:3px">\${preview}</div>
    </div>\`;
  }).join('');

  // Update nav badge
  const totalUnread = Object.values(unreadMap).reduce((s, v) => s + v, 0);
  const badge = document.getElementById('nav-messages-badge');
  if (badge) { badge.textContent = totalUnread || ''; badge.hidden = !totalUnread; }
}

window.openAdminThread = async function(clientId, clientName) {
  const titleEl = document.getElementById('msg-thread-title');
  const bodyEl  = document.getElementById('msg-thread-body');
  if (!titleEl || !bodyEl) return;
  titleEl.textContent = clientName;
  bodyEl.innerHTML = '<span class="spinner"></span>';

  // Mark all client messages as read
  await sb.from('client_messages').update({ read_by_staff: true })
    .eq('client_id', clientId).eq('sender_role', 'client').eq('read_by_staff', false);

  async function loadThread() {
    const { data: msgs } = await sb.from('client_messages')
      .select('*').eq('client_id', clientId).order('created_at');

    const { data: { user } } = await sb.auth.getUser();

    bodyEl.innerHTML = \`
      <div id="msg-scroll" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-bottom:12px;min-height:200px;max-height:380px">
        \${(msgs||[]).length === 0
          ? '<div style="color:var(--muted);font-size:13px;text-align:center;padding:40px 0">No messages yet. Send the first one below.</div>'
          : (msgs||[]).map(m => {
              const isStaff = m.sender_role === 'staff';
              const time = new Date(m.created_at).toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
              return \`<div style="display:flex;flex-direction:column;align-items:\${isStaff?'flex-end':'flex-start'}">
                <div style="max-width:80%;background:\${isStaff?'var(--gold)':'var(--surface)'};color:\${isStaff?'#000':'var(--text)'};padding:9px 13px;border-radius:\${isStaff?'14px 14px 4px 14px':'14px 14px 14px 4px'};font-size:13px;line-height:1.5">
                  \${esc(m.body)}
                </div>
                <div style="font-size:10px;color:var(--muted);margin-top:3px">\${isStaff?'You · ':'Client · '}\${time}</div>
              </div>\`;
            }).join('')
        }
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
        <textarea id="msg-compose" placeholder="Type a message…" rows="2"
          style="flex:1;padding:8px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;resize:none"></textarea>
        <button class="btn btn-primary" onclick="sendAdminMessage('\${esc(clientId)}','\${esc(clientName)}')" style="align-self:flex-end;padding:8px 16px">Send</button>
      </div>\`;

    // Scroll to bottom
    const scroll = document.getElementById('msg-scroll');
    if (scroll) scroll.scrollTop = scroll.scrollHeight;

    // Refresh nav badge only (don't re-render the full messages screen)
    refreshNotificationBadges();
  }
  await loadThread();
};

window.sendAdminMessage = async function(clientId, clientName) {
  const ta = document.getElementById('msg-compose');
  const body = ta?.value.trim();
  if (!body) return;
  ta.disabled = true;
  const { data: { user } } = await sb.auth.getUser();
  const { error } = await sb.from('client_messages').insert({
    client_id: clientId, sender_role: 'staff', sender_id: user?.id,
    body, read_by_client: false, read_by_staff: true
  });
  if (error) { alert('Error sending: ' + error.message); ta.disabled = false; return; }
  ta.value = '';
  ta.disabled = false;
  openAdminThread(clientId, clientName);
};

// ════════════════════════════════════════════════════════════
//  MESSAGES — CLIENT PORTAL
// ════════════════════════════════════════════════════════════
async function renderClientMessages(container) {
  const c = STATE.clientRow;
  if (!c) {
    container.innerHTML = pageShell('Messages', '', '', '<div class="alert alert-red" style="margin:28px">Account not linked. Contact your firm.</div>');
    return;
  }
  container.innerHTML = pageShell('Messages', 'Manrique & Associates', '', \`
    <div class="card" style="max-width:700px;margin:0 auto">
      <div class="card-h">Messages</div>
      <div class="card-body">
        <div id="client-msg-scroll" style="display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:420px;overflow-y:auto;padding-bottom:12px">
          <span class="spinner"></span>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
          <textarea id="client-msg-compose" placeholder="Type a message to your accountant…" rows="2"
            style="flex:1;padding:8px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;resize:none"></textarea>
          <button class="btn btn-primary" id="client-msg-send" style="align-self:flex-end;padding:8px 16px">Send</button>
        </div>
        <div id="client-msg-err" style="font-size:12px;color:var(--red);margin-top:6px;min-height:14px"></div>
      </div>
    </div>
  \`);

  // Mark staff messages as read
  await sb.from('client_messages').update({ read_by_client: true })
    .eq('client_id', c.id).eq('sender_role', 'staff').eq('read_by_client', false);

  async function loadClientThread() {
    const { data: msgs } = await sb.from('client_messages')
      .select('*').eq('client_id', c.id).order('created_at');
    const scroll = document.getElementById('client-msg-scroll');
    if (!scroll) return;
    scroll.innerHTML = (msgs||[]).length === 0
      ? '<div style="color:var(--muted);font-size:13px;text-align:center;padding:40px 0">No messages yet. Send us a message below!</div>'
      : (msgs||[]).map(m => {
          const isClient = m.sender_role === 'client';
          const time = new Date(m.created_at).toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
          return \`<div style="display:flex;flex-direction:column;align-items:\${isClient?'flex-end':'flex-start'}">
            <div style="max-width:80%;background:\${isClient?'var(--gold)':'var(--surface)'};color:\${isClient?'#000':'var(--text)'};padding:9px 13px;border-radius:\${isClient?'14px 14px 4px 14px':'14px 14px 14px 4px'};font-size:13px;line-height:1.5">
              \${esc(m.body)}
            </div>
            <div style="font-size:10px;color:var(--muted);margin-top:3px">\${isClient?'You · ':'Manrique & Associates · '}\${time}</div>
          </div>\`;
        }).join('');
    scroll.scrollTop = scroll.scrollHeight;
    // Update nav badge (unread from staff)
    const unread = (msgs||[]).filter(m => m.sender_role==='staff' && !m.read_by_client).length;
    const badge = document.getElementById('nav-messages-badge');
    if (badge) { badge.textContent = unread||''; badge.hidden = !unread; }
  }
  await loadClientThread();

  document.getElementById('client-msg-send')?.addEventListener('click', async () => {
    const ta = document.getElementById('client-msg-compose');
    const errEl = document.getElementById('client-msg-err');
    const body = ta?.value.trim();
    if (!body) return;
    ta.disabled = true;
    const { data: { user } } = await sb.auth.getUser();
    const { error } = await sb.from('client_messages').insert({
      client_id: c.id, sender_role: 'client', sender_id: user?.id,
      body, read_by_staff: false, read_by_client: true
    });
    if (error) { errEl.textContent = 'Error: ' + error.message; ta.disabled = false; return; }
    ta.value = '';
    ta.disabled = false;
    errEl.textContent = '';
    await loadClientThread();
  });
}

// ════════════════════════════════════════════════════════════
//  NOTIFICATIONS — poll unread counts for nav badges
// ════════════════════════════════════════════════════════════
async function refreshNotificationBadges() {
  if (!STATE.isSignedIn) return;
  if (STATE.isStaff) {
    // Unread messages from clients
    const { count: msgCount } = await sb.from('client_messages')
      .select('id', { count: 'exact', head: true })
      .eq('sender_role', 'client').eq('read_by_staff', false);
    const badge = document.getElementById('nav-messages-badge');
    if (badge) { badge.textContent = msgCount || ''; badge.hidden = !msgCount; }

    // Unread documents (not yet reviewed)
    const { count: docCount } = await sb.from('client_documents')
      .select('id', { count: 'exact', head: true }).eq('reviewed', false);
    // Show on dashboard Quick Links if present
    const docBadge = document.getElementById('dash-unreviewed-docs');
    const docTxt = document.getElementById('dash-unreviewed-docs-txt');
    if (docBadge) docBadge.hidden = !docCount;
    if (docTxt) docTxt.textContent = \`\${docCount || 0} document\${(docCount||0)>1?'s':''} awaiting review\`;
  } else if (STATE.clientRow) {
    // Unread messages from staff for client
    const { count: msgCount } = await sb.from('client_messages')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', STATE.clientRow.id).eq('sender_role', 'staff').eq('read_by_client', false);
    const badge = document.getElementById('nav-messages-badge');
    if (badge) { badge.textContent = msgCount || ''; badge.hidden = !msgCount; }
  }
}

// ════════════════════════════════════════════════════════════
//  CLIENT SELECT
// ════════════════════════════════════════════════════════════
function populateClientSelect() {
  const sel = document.getElementById('client-select');
  sel.innerHTML = '<option value="">— All Clients —</option>';
  STATE.clientRows.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.full_name;
    sel.appendChild(opt);
  });
}
function clientFilter() {
  if (STATE.selectedClientId) return {
    column: 'client_id',
    value: STATE.selectedClientId
  };
  return null;
}
function applyClientFilter(query) {
  const f = clientFilter();
  return f ? query.eq(f.column, f.value) : query;
}
function selectedClientName() {
  if (!STATE.selectedClientId) return 'All Clients';
  const c = STATE.clientRows.find(r => r.id === STATE.selectedClientId);
  return c ? c.full_name : 'Client';
}

// ════════════════════════════════════════════════════════════
//  SCREEN BUILDERS
// ════════════════════════════════════════════════════════════

// ── DASHBOARD ──────────────────────────────────────────────
async function renderDashboard(container) {
  var _clientsEl$closest, _jeRes$count, _taxRes$count, _rwRes$count;
  if (!STATE.isStaff) {
    await renderClientPortalDashboard(container);
    return;
  }
  container.innerHTML = pageShell('Dashboard', selectedClientName(), '', "\\n    <div id=\\"dash-kpi-row\\">\\n      <div class=\\"stat-card stat-green\\"><div class=\\"stat-label\\">Clients</div><div class=\\"stat-val\\" id=\\"d-clients\\">—</div><div class=\\"stat-sub\\">Active</div></div>\\n      <div class=\\"stat-card stat-gold\\"><div class=\\"stat-label\\">Journal Entries</div><div class=\\"stat-val\\" id=\\"d-je\\">—</div><div class=\\"stat-sub\\">Total posted</div></div>\\n      <div class=\\"stat-card stat-blue\\"><div class=\\"stat-label\\">Tax Returns</div><div class=\\"stat-val\\" id=\\"d-tax\\">—</div><div class=\\"stat-sub\\">This season</div></div>\\n      <div class=\\"stat-card stat-red\\"><div class=\\"stat-label\\">RouteWorth Pkgs</div><div class=\\"stat-val\\" id=\\"d-rw\\">—</div><div class=\\"stat-sub\\">Received</div></div>\\n    </div>\\n    <div class=\\"two-col\\">\\n      <div class=\\"card\\"><div class=\\"card-h\\">Recent Activity</div><div class=\\"card-body\\" id=\\"d-activity\\">Loading…</div></div>\\n      <div class=\\"card\\"><div class=\\"card-h\\">Quick Links</div><div class=\\"card-body\\">\\n        <div id=\\"dash-unreviewed-docs\\" hidden style=\\"background:var(--gold);color:#000;border-radius:8px;padding:10px 14px;font-size:13px;font-weight:600;margin-bottom:12px;cursor:pointer\\" onclick=\\"navigateTo('clients')\\">📄 <span id=\\"dash-unreviewed-docs-txt\\"></span> — click to review</div>\\n        <div style=\\"display:flex;flex-direction:column;gap:10px\\">\\n          <button class=\\"btn btn-secondary\\" style=\\"background:var(--bg);color:var(--text);justify-content:flex-start\\" onclick=\\"navigateTo('journal')\\">➕ New Journal Entry</button>\\n          <button class=\\"btn btn-secondary\\" style=\\"background:var(--bg);color:var(--text);justify-content:flex-start\\" onclick=\\"navigateTo('tax')\\">🏛 View Tax Returns</button>\\n          <button class=\\"btn btn-secondary\\" style=\\"background:var(--bg);color:var(--text);justify-content:flex-start\\" onclick=\\"navigateTo('routeworth')\\">🚗 RouteWorth Packages</button>\\n          <button class=\\"btn btn-secondary\\" style=\\"background:var(--bg);color:var(--text);justify-content:flex-start\\" onclick=\\"navigateTo('accounts')\\">📒 Chart of Accounts</button>\\n          <button class=\\"btn btn-secondary\\" style=\\"background:var(--bg);color:var(--text);justify-content:flex-start\\" onclick=\\"navigateTo('messages')\\">💬 Messages</button>\\n        </div>\\n      </div></div>\\n    </div>\\n  ");

  // Load counts — filter by selected client when one is chosen
  const cid = STATE.selectedClientId;
  let jeQ = sb.from('journal_entries').select('id', {
    count: 'exact',
    head: true
  });
  let taxQ = sb.from('tax_returns').select('id', {
    count: 'exact',
    head: true
  });
  let rwQ = sb.from('routeworth_packages').select('id', {
    count: 'exact',
    head: true
  });
  let actQ = sb.from('activity_log').select('*').order('logged_at', {
    ascending: false
  }).limit(8);
  if (cid) {
    jeQ = jeQ.eq('client_id', cid);
    taxQ = taxQ.eq('client_id', cid);
    rwQ = rwQ.eq('client_id', cid);
    actQ = actQ.eq('client_id', cid);
  }
  const [clientsRes, jeRes, taxRes, rwRes, actRes] = await Promise.all([sb.from('clients').select('id', {
    count: 'exact',
    head: true
  }).eq('status', 'active'), jeQ, taxQ, rwQ, actQ]);

  // If a client is selected, show their name in the KPI label instead of "Active"
  const clientsEl = document.getElementById('d-clients');
  const clientsSubEl = clientsEl === null || clientsEl === void 0 || (_clientsEl$closest = clientsEl.closest('.stat-card')) === null || _clientsEl$closest === void 0 ? void 0 : _clientsEl$closest.querySelector('.stat-sub');
  if (cid) {
    var _STATE$clientRows$fin;
    if (clientsEl) clientsEl.textContent = '1';
    if (clientsSubEl) clientsSubEl.textContent = ((_STATE$clientRows$fin = STATE.clientRows.find(r => r.id === cid)) === null || _STATE$clientRows$fin === void 0 ? void 0 : _STATE$clientRows$fin.full_name) || 'Selected';
  } else {
    var _clientsRes$count;
    if (clientsEl) clientsEl.textContent = (_clientsRes$count = clientsRes.count) !== null && _clientsRes$count !== void 0 ? _clientsRes$count : '—';
    if (clientsSubEl) clientsSubEl.textContent = 'Active';
  }
  document.getElementById('d-je').textContent = (_jeRes$count = jeRes.count) !== null && _jeRes$count !== void 0 ? _jeRes$count : '—';
  document.getElementById('d-tax').textContent = (_taxRes$count = taxRes.count) !== null && _taxRes$count !== void 0 ? _taxRes$count : '—';
  document.getElementById('d-rw').textContent = (_rwRes$count = rwRes.count) !== null && _rwRes$count !== void 0 ? _rwRes$count : '—';
  const actEl = document.getElementById('d-activity');
  if (actRes.data && actRes.data.length) {
    actEl.innerHTML = actRes.data.map(a => "\\n      <div style=\\"display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)\\">\\n        <span style=\\"font-size:16px\\">".concat(activityIcon(a.action), "</span>\\n        <div style=\\"min-width:0\\">\\n          <div style=\\"font-size:13px;font-weight:500\\">").concat(esc(a.action), "</div>\\n          <div style=\\"font-size:11px;color:var(--muted)\\">").concat(esc(a.actor_name), " · ").concat(relTime(a.logged_at), "</div>\\n        </div>\\n      </div>\\n    ")).join('');
  } else {
    actEl.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>No activity yet.</div>';
  }
}

// ── CLIENT PORTAL DASHBOARD ────────────────────────────────
async function renderClientPortalDashboard(container) {
  const c = STATE.clientRow;
  if (!c) {
    container.innerHTML = pageShell('My Account', '', '', \`
      <div class="alert alert-red" style="margin:28px">
        Your account is not linked to a client record yet. Please contact Manrique &amp; Associates.
      </div>\`);
    return;
  }

  const isBusiness = (c.client_type || 'personal') === 'business';
  const typeTag = isBusiness
    ? \`<span style="background:var(--gold);color:#000;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:10px">Business</span>\`
    : \`<span style="background:var(--green);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:10px">Personal</span>\`;

  const businessSections = isBusiness ? \`
    <div class="card" style="margin-bottom:20px">
      <div class="card-h" style="display:flex;justify-content:space-between;align-items:center">
        <span>💳 Billing</span>
        <span style="font-size:12px;color:var(--muted)" id="billing-badge"></span>
      </div>
      <div class="card-body" id="billing-list"><span class="spinner"></span></div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-h" style="display:flex;justify-content:space-between;align-items:center">
        <span>🧾 My Invoices</span>
        <button class="btn btn-primary" style="font-size:12px;padding:6px 14px" onclick="openNewInvoiceModal()">+ New Invoice</button>
      </div>
      <div class="card-body" id="invoices-list"><span class="spinner"></span></div>
    </div>\` : '';

  container.innerHTML = pageShell('My Account', \`<div class="page-sub" style="display:flex;align-items:center;gap:8px">\${esc(c.full_name)}\${typeTag}</div>\`, '', \`
    <div class="card" style="margin-bottom:20px">
      <div class="card-h" style="display:flex;justify-content:space-between;align-items:center">
        <span>📋 To-Do List</span>
        <span id="tasks-badge" style="font-size:12px;color:var(--muted)"></span>
      </div>
      <div class="card-body" id="tasks-list"><span class="spinner"></span></div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-h" style="display:flex;justify-content:space-between;align-items:center">
        <span>📁 My Documents</span>
        <label class="btn btn-primary" style="font-size:12px;padding:6px 14px;cursor:pointer">
          ⬆️ Upload File
          <input type="file" id="doc-upload-input" style="display:none" multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp">
        </label>
      </div>
      <div id="doc-upload-progress" style="padding:0 22px;min-height:0"></div>
      <div class="card-body" id="docs-list"><span class="spinner"></span></div>
    </div>

    \${businessSections}

    <div class="card">
      <div class="card-h">Your Firm</div>
      <div class="card-body">
        <div style="font-weight:600;font-size:15px">Manrique &amp; Associates LLC</div>
        <div style="font-size:13px;color:var(--muted);margin-top:4px">Questions about your account? Reply to any email from our office or visit manriqueassociates.com.</div>
      </div>
    </div>

    <!-- Invoice modal -->
    <div id="invoice-modal" hidden style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px">
      <div style="background:var(--surface);border-radius:12px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border)">
          <div style="font-weight:700;font-size:16px" id="invoice-modal-title">New Invoice</div>
          <button onclick="closeInvoiceModal()" style="font-size:20px;color:var(--muted);background:none;border:none;cursor:pointer">✕</button>
        </div>
        <div style="padding:24px" id="invoice-modal-body"></div>
      </div>
    </div>
  \`);

  // ── Load tasks ──
  async function loadTasks() {
    const { data: tasks, error } = await sb.from('client_tasks')
      .select('*').eq('client_id', c.id).order('completed').order('priority', { ascending: false }).order('due_date', { nullsFirst: false });
    const el = document.getElementById('tasks-list');
    const badge = document.getElementById('tasks-badge');
    if (!el) return;
    if (error) { el.innerHTML = \`<div class="alert alert-red">\${esc(error.message)}</div>\`; return; }
    if (!tasks.length) {
      el.innerHTML = '<div class="empty" style="padding:20px 0"><div class="empty-icon">✅</div>No tasks assigned yet.</div>';
      if (badge) badge.textContent = '';
      return;
    }
    const pending = tasks.filter(t => !t.completed).length;
    if (badge) badge.textContent = pending ? \`\${pending} pending\` : 'All done ✓';
    el.innerHTML = tasks.map(t => {
      const priorityColor = { urgent: 'var(--red)', normal: 'var(--gold)', low: 'var(--muted)' }[t.priority] || 'var(--muted)';
      const priorityLabel = { urgent: '🔴 Urgent', normal: '🟡 Normal', low: '⚪ Low' }[t.priority] || '';
      const due = t.due_date ? \`· Due \${new Date(t.due_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\` : '';
      return \`<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);\${t.completed ? 'opacity:.5' : ''}">
        <input type="checkbox" data-task-id="\${esc(t.id)}" \${t.completed ? 'checked' : ''}
          style="width:18px;height:18px;margin-top:2px;cursor:pointer;accent-color:var(--green)"
          onchange="toggleClientTask(this)">
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px;\${t.completed ? 'text-decoration:line-through' : ''}">\${esc(t.title)}</div>
          \${t.description ? \`<div style="font-size:12px;color:var(--muted);margin-top:3px">\${esc(t.description)}</div>\` : ''}
          <div style="font-size:11px;color:\${priorityColor};margin-top:4px;font-weight:600">\${priorityLabel} \${due}</div>
        </div>
      </div>\`;
    }).join('');
  }
  await loadTasks();

  // Toggle task complete
  window.toggleClientTask = async function(cb) {
    const taskId = cb.dataset.taskId;
    const completed = cb.checked;
    cb.disabled = true;
    await sb.from('client_tasks').update({
      completed,
      completed_at: completed ? new Date().toISOString() : null
    }).eq('id', taskId);
    await loadTasks();
  };

  // ── Load documents ──
  async function loadDocs() {
    const { data: docs, error } = await sb.from('client_documents')
      .select('*').eq('client_id', c.id).order('uploaded_at', { ascending: false });
    const el = document.getElementById('docs-list');
    if (!el) return;
    if (error) { el.innerHTML = \`<div class="alert alert-red">\${esc(error.message)}</div>\`; return; }
    if (!docs.length) {
      el.innerHTML = '<div class="empty" style="padding:20px 0"><div class="empty-icon">📂</div>No documents uploaded yet.</div>';
      return;
    }
    el.innerHTML = docs.map(d => {
      const icon = d.mime_type?.startsWith('image/') ? '🖼️' :
                   d.mime_type === 'application/pdf' ? '📄' : '📎';
      const size = d.file_size ? (d.file_size > 1048576 ? \`\${(d.file_size/1048576).toFixed(1)} MB\` : \`\${Math.round(d.file_size/1024)} KB\`) : '';
      return \`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:22px">\${icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:500;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(d.file_name)}</div>
          <div style="font-size:11px;color:var(--muted)">\${new Date(d.uploaded_at).toLocaleDateString()} \${size ? '· ' + size : ''}</div>
          \${d.note ? \`<div style="font-size:12px;color:var(--muted);margin-top:2px">\${esc(d.note)}</div>\` : ''}
        </div>
        <button onclick="viewClientDoc('\${esc(d.file_path)}','\${esc(d.file_name)}')"
          style="background:none;border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;color:var(--text)">View</button>
      </div>\`;
    }).join('');
  }
  await loadDocs();

  // View doc via signed URL
  window.viewClientDoc = async function(path, name) {
    const { data, error } = await sb.storage.from('client-documents').createSignedUrl(path, 300);
    if (error) { alert('Could not open file: ' + error.message); return; }
    window.open(data.signedUrl, '_blank');
  };

  // ── Load billing (business only) ──
  async function loadBilling() {
    const el = document.getElementById('billing-list');
    const badge = document.getElementById('billing-badge');
    if (!el) return;
    const { data: bills } = await sb.from('client_billing')
      .select('*').eq('client_id', c.id).order('created_at', { ascending: false });
    if (!bills || !bills.length) {
      el.innerHTML = '<div class="empty" style="padding:16px 0"><div class="empty-icon">💳</div>No charges yet.</div>';
      if (badge) badge.textContent = '';
      return;
    }
    const unpaid = bills.filter(b => b.status === 'unpaid');
    const unpaidTotal = unpaid.reduce((s, b) => s + parseFloat(b.amount), 0);
    if (badge) badge.textContent = unpaid.length ? \`$\${unpaidTotal.toFixed(2)} outstanding\` : 'All paid ✓';
    el.innerHTML = bills.map(b => {
      const statusColor = { unpaid: 'var(--red)', paid: 'var(--green)', void: 'var(--muted)' }[b.status] || 'var(--muted)';
      const statusLabel = { unpaid: 'Unpaid', paid: 'Paid', void: 'Void' }[b.status] || b.status;
      const due = b.due_date ? \`Due \${new Date(b.due_date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}\` : '';
      return \`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px">\${esc(b.description)}</div>
          \${b.notes ? \`<div style="font-size:12px;color:var(--muted);margin-top:2px">\${esc(b.notes)}</div>\` : ''}
          \${due ? \`<div style="font-size:11px;color:var(--muted);margin-top:3px">\${due}</div>\` : ''}
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;font-size:15px">$\${parseFloat(b.amount).toFixed(2)}</div>
          <div style="font-size:11px;font-weight:600;color:\${statusColor};margin-top:2px">\${statusLabel}</div>
        </div>
      </div>\`;
    }).join('');
  }

  // ── Load client invoices (business only) ──
  async function loadInvoices() {
    const el = document.getElementById('invoices-list');
    if (!el) return;
    const { data: invs } = await sb.from('client_invoices')
      .select('*').eq('client_id', c.id).order('created_at', { ascending: false });
    if (!invs || !invs.length) {
      el.innerHTML = '<div class="empty" style="padding:16px 0"><div class="empty-icon">🧾</div>No invoices yet. Create your first one above.</div>';
      return;
    }
    el.innerHTML = invs.map(inv => {
      const statusColor = { draft:'var(--muted)', sent:'var(--gold)', paid:'var(--green)', void:'var(--red)' }[inv.status] || 'var(--muted)';
      const due = inv.due_date ? new Date(inv.due_date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '—';
      return \`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px">\${esc(inv.invoice_number)} · \${esc(inv.customer_name)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px">Due \${due} · <span style="font-weight:600;color:\${statusColor}">\${inv.status.toUpperCase()}</span></div>
        </div>
        <div style="font-weight:700;font-size:15px;margin-right:8px">$\${parseFloat(inv.total).toFixed(2)}</div>
        <div style="display:flex;gap:6px">
          <button onclick="openEditInvoiceModal('\${esc(inv.id)}')" style="border:1px solid var(--border);background:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;color:var(--text)">Edit</button>
          <button onclick="downloadInvoicePdf('\${esc(inv.id)}')" style="border:1px solid var(--gold);background:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;color:var(--gold)">⬇ PDF</button>
          \${inv.status !== 'paid' && inv.status !== 'void'
            ? \`<button onclick="markInvoicePaid('\${esc(inv.id)}')" style="border:1px solid var(--green);background:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;color:var(--green)">Mark Paid</button>\`
            : ''}
          <button onclick="deleteClientInvoice('\${esc(inv.id)}')" style="border:1px solid var(--red);background:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;color:var(--red)">Delete</button>
        </div>
      </div>\`;
    }).join('');
  }

  if (isBusiness) {
    await loadBilling();
    await loadInvoices();
  }

  // Invoice modal helpers
  window.closeInvoiceModal = function() {
    document.getElementById('invoice-modal').hidden = true;
  };

  function invoiceFormHtml(inv) {
    const items = inv?.line_items || [{ description: '', qty: 1, rate: '' }];
    return \`
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Invoice #</label>
            <input id="inv-number" class="input" value="\${esc(inv?.invoice_number || '')}" placeholder="INV-001">
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Issue Date</label>
            <input id="inv-issue-date" class="input" type="date" value="\${inv?.issue_date || new Date().toISOString().slice(0,10)}">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Customer Name *</label>
            <input id="inv-customer" class="input" value="\${esc(inv?.customer_name || '')}" placeholder="Customer or company name">
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Customer Email</label>
            <input id="inv-email" class="input" type="email" value="\${esc(inv?.customer_email || '')}" placeholder="customer@email.com">
          </div>
        </div>
        <div>
          <label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px">Due Date</label>
          <input id="inv-due-date" class="input" type="date" value="\${inv?.due_date || ''}">
        </div>
        <div>
          <label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px">Line Items</label>
          <div id="inv-line-items">
            \${items.map((it, i) => \`
              <div class="inv-item-row" style="display:grid;grid-template-columns:1fr 60px 90px 28px;gap:6px;margin-bottom:6px">
                <input class="input inv-desc" placeholder="Description" value="\${esc(it.description || '')}">
                <input class="input inv-qty" type="number" min="1" placeholder="Qty" value="\${it.qty || 1}" style="text-align:center">
                <input class="input inv-rate" type="number" min="0" step="0.01" placeholder="Rate $" value="\${it.rate || ''}">
                <button type="button" onclick="this.closest('.inv-item-row').remove();recalcInvoice()" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer">✕</button>
              </div>\`).join('')}
          </div>
          <button type="button" onclick="addInvoiceItem()" class="btn btn-secondary" style="font-size:12px;padding:4px 12px;margin-top:4px">+ Add Item</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end">
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Tax Rate (%)</label>
            <input id="inv-tax-rate" class="input" type="number" min="0" max="100" step="0.1" value="\${inv?.tax_rate || 0}" oninput="recalcInvoice()">
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:var(--muted)">Subtotal: <span id="inv-subtotal">$0.00</span></div>
            <div style="font-size:12px;color:var(--muted)">Tax: <span id="inv-tax-amt">$0.00</span></div>
            <div style="font-size:16px;font-weight:700;margin-top:4px">Total: <span id="inv-total">$0.00</span></div>
          </div>
        </div>
        <div>
          <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Status</label>
          <select id="inv-status" class="input">
            \${['draft','sent','paid','void'].map(s => \`<option value="\${s}" \${(inv?.status||'draft')===s?'selected':''}>\${s.charAt(0).toUpperCase()+s.slice(1)}</option>\`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Notes</label>
          <textarea id="inv-notes" class="input" rows="2" placeholder="Payment terms, thank you note…">\${esc(inv?.notes || '')}</textarea>
        </div>
        <div id="inv-err" style="color:var(--red);font-size:12px;min-height:14px"></div>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button class="btn btn-secondary" onclick="closeInvoiceModal()">Cancel</button>
          <button class="btn btn-primary" onclick="saveInvoice('\${inv?.id || ''}')">Save Invoice</button>
        </div>
      </div>\`;
  }

  window.addInvoiceItem = function() {
    const container = document.getElementById('inv-line-items');
    const row = document.createElement('div');
    row.className = 'inv-item-row';
    row.style.cssText = 'display:grid;grid-template-columns:1fr 60px 90px 28px;gap:6px;margin-bottom:6px';
    row.innerHTML = \`
      <input class="input inv-desc" placeholder="Description" value="">
      <input class="input inv-qty" type="number" min="1" placeholder="Qty" value="1" style="text-align:center">
      <input class="input inv-rate" type="number" min="0" step="0.01" placeholder="Rate $" value="">
      <button type="button" onclick="this.closest('.inv-item-row').remove();recalcInvoice()" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer">✕</button>\`;
    container.appendChild(row);
    recalcInvoice();
  };

  window.recalcInvoice = function() {
    let subtotal = 0;
    document.querySelectorAll('.inv-item-row').forEach(row => {
      const qty = parseFloat(row.querySelector('.inv-qty')?.value) || 0;
      const rate = parseFloat(row.querySelector('.inv-rate')?.value) || 0;
      subtotal += qty * rate;
    });
    const taxRate = parseFloat(document.getElementById('inv-tax-rate')?.value) || 0;
    const tax = subtotal * taxRate / 100;
    const total = subtotal + tax;
    const fmt = n => '$' + n.toFixed(2);
    const sub = document.getElementById('inv-subtotal'); if (sub) sub.textContent = fmt(subtotal);
    const taxEl = document.getElementById('inv-tax-amt'); if (taxEl) taxEl.textContent = fmt(tax);
    const tot = document.getElementById('inv-total'); if (tot) tot.textContent = fmt(total);
  };

  window.openNewInvoiceModal = function() {
    const modal = document.getElementById('invoice-modal');
    document.getElementById('invoice-modal-title').textContent = 'New Invoice';
    document.getElementById('invoice-modal-body').innerHTML = invoiceFormHtml(null);
    modal.hidden = false;
    // Auto-generate invoice number
    sb.from('client_invoices').select('invoice_number').eq('client_id', c.id).order('created_at', { ascending: false }).limit(1).then(({ data }) => {
      const last = data?.[0]?.invoice_number;
      const num = last ? parseInt(last.replace(/\\D/g,'')) + 1 : 1;
      const el = document.getElementById('inv-number');
      if (el && !el.value) el.value = \`INV-\${String(num).padStart(3,'0')}\`;
    });
    setTimeout(recalcInvoice, 50);
  };

  window.openEditInvoiceModal = async function(invId) {
    const { data: inv } = await sb.from('client_invoices').select('*').eq('id', invId).single();
    if (!inv) return;
    document.getElementById('invoice-modal-title').textContent = 'Edit Invoice';
    document.getElementById('invoice-modal-body').innerHTML = invoiceFormHtml(inv);
    document.getElementById('invoice-modal').hidden = false;
    setTimeout(recalcInvoice, 50);
  };

  window.saveInvoice = async function(existingId) {
    const errEl = document.getElementById('inv-err');
    const customer = document.getElementById('inv-customer')?.value.trim();
    if (!customer) { errEl.textContent = 'Customer name is required.'; return; }
    const lineItems = [];
    document.querySelectorAll('.inv-item-row').forEach(row => {
      const desc = row.querySelector('.inv-desc')?.value.trim();
      const qty = parseFloat(row.querySelector('.inv-qty')?.value) || 0;
      const rate = parseFloat(row.querySelector('.inv-rate')?.value) || 0;
      if (desc || rate) lineItems.push({ description: desc, qty, rate, amount: qty * rate });
    });
    const taxRate = parseFloat(document.getElementById('inv-tax-rate')?.value) || 0;
    const subtotal = lineItems.reduce((s, it) => s + it.amount, 0);
    const taxAmt = subtotal * taxRate / 100;
    const payload = {
      client_id: c.id,
      invoice_number: document.getElementById('inv-number')?.value.trim() || \`INV-\${Date.now()}\`,
      customer_name: customer,
      customer_email: document.getElementById('inv-email')?.value.trim() || null,
      issue_date: document.getElementById('inv-issue-date')?.value || new Date().toISOString().slice(0,10),
      due_date: document.getElementById('inv-due-date')?.value || null,
      status: document.getElementById('inv-status')?.value || 'draft',
      notes: document.getElementById('inv-notes')?.value.trim() || null,
      line_items: lineItems, subtotal, tax_rate: taxRate, tax_amount: taxAmt, total: subtotal + taxAmt,
      updated_at: new Date().toISOString()
    };
    const { data: savedInv, error } = existingId
      ? await sb.from('client_invoices').update(payload).eq('id', existingId).select().single()
      : await sb.from('client_invoices').insert(payload).select().single();
    if (error) { errEl.textContent = error.message; return; }

    // ── Accrual journal entry on NEW invoice (not draft) ──────────────
    // Debit Accounts Receivable / Credit Sales Revenue
    const isNewSentInvoice = !existingId && payload.status !== 'draft' && (parseFloat(payload.total) || 0) > 0;
    if (isNewSentInvoice && savedInv) {
      const { data: accts } = await sb.from('accounts')
        .select('id, name, type, subtype').eq('client_id', c.id).eq('is_active', true);
      const findAcct = (types, subtypes) => (accts || []).find(a =>
        types.map(t=>t.toLowerCase()).includes((a.type||'').toLowerCase()) &&
        (!subtypes || subtypes.some(s => (a.subtype||'').toLowerCase().includes(s) || (a.name||'').toLowerCase().includes(s)))
      );
      const arAcct = findAcct(['Asset','asset'], ['receivable', 'accounts receivable', 'accounts_receivable'])
                  || null;
      const revenueAcct = findAcct(['Income','income','Revenue','revenue'], ['service','sales','revenue','income'])
                       || findAcct(['Income','income','Revenue','revenue'], null);
      if (arAcct && revenueAcct) {
        const amount = parseFloat(payload.total) || 0;
        const entryDate = payload.issue_date || new Date().toISOString().slice(0,10);
        const ref = \`INV-\${(payload.invoice_number || '').slice(-8).toUpperCase()}\`;
        const desc = \`Invoice issued — \${payload.invoice_number || 'Invoice'}\${payload.customer_name ? ' to ' + payload.customer_name : ''}\`;
        const { data: je } = await sb.from('journal_entries').insert({
          client_id: c.id, entry_date: entryDate, reference: ref,
          description: desc, status: 'posted'
        }).select().single();
        if (je) {
          await sb.from('journal_lines').insert([
            { journal_entry_id: je.id, account_id: arAcct.id,      debit: amount, credit: 0,      memo: \`A/R — \${payload.customer_name || 'Customer'}\` },
            { journal_entry_id: je.id, account_id: revenueAcct.id, debit: 0,      credit: amount, memo: \`Revenue — \${payload.invoice_number || 'Invoice'}\` }
          ]);
          showToast(\`✓ Invoice saved · Journal entry posted (A/R / \${revenueAcct.name})\`, 'green');
        }
      }
    }

    closeInvoiceModal();
    await loadInvoices();
  };

  window.markInvoicePaid = async function(invId) {
    if (!confirm('Mark this invoice as paid? A revenue journal entry will be posted automatically.')) return;

    // 1. Fetch the invoice
    const { data: inv, error: invErr } = await sb.from('client_invoices').select('*').eq('id', invId).single();
    if (invErr || !inv) { alert('Could not load invoice: ' + (invErr?.message || 'not found')); return; }

    // 2. Mark paid
    const { error: updErr } = await sb.from('client_invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', invId);
    if (updErr) { alert('Error marking paid: ' + updErr.message); return; }

    // 3. Auto journal entry — accrual basis: Debit Cash / Credit A/R
    // (Revenue was already recorded when the invoice was created)
    const { data: accts } = await sb.from('accounts')
      .select('id, name, type, subtype')
      .eq('client_id', c.id)
      .eq('is_active', true);

    const findAcct = (types, subtypes) => (accts || []).find(a =>
      types.map(t=>t.toLowerCase()).includes((a.type||'').toLowerCase()) &&
      (!subtypes || subtypes.some(s => (a.subtype||'').toLowerCase().includes(s) || (a.name||'').toLowerCase().includes(s)))
    );

    const cashAcct = findAcct(['Asset','asset'], ['cash', 'checking', 'bank'])
                  || findAcct(['Asset','asset'], null);
    const arAcct   = findAcct(['Asset','asset'], ['receivable', 'accounts receivable', 'accounts_receivable']);

    // If A/R account exists, do the proper accrual clearing entry (Cash / A/R)
    // If not, fall back to Cash / Revenue (cash-basis style)
    const { data: revenueAcct } = !arAcct
      ? { data: findAcct(['Income','income','Revenue','revenue'], ['service','sales','revenue','income'])
                || findAcct(['Income','income','Revenue','revenue'], null) }
      : { data: null };

    const creditAcct = arAcct || revenueAcct;

    if (!cashAcct || !creditAcct) {
      await loadInvoices();
      alert('Invoice marked paid ✓\\n\\nNote: Could not auto-post a journal entry because this client\\'s chart of accounts is missing a Cash or Accounts Receivable account. Please post the entry manually.');
      return;
    }

    const amount = parseFloat(inv.total || 0);
    const entryDate = new Date().toISOString().slice(0, 10);
    const ref = \`INV-PAID-\${(inv.invoice_number || invId).slice(-8).toUpperCase()}\`;
    const desc = \`Payment received — \${inv.invoice_number || 'Invoice'}\${inv.customer_name ? ' from ' + inv.customer_name : ''}\`;
    const creditLabel = arAcct ? arAcct.name : (creditAcct.name || 'Revenue');

    const { data: je, error: jeErr } = await sb.from('journal_entries').insert({
      client_id: c.id, entry_date: entryDate, reference: ref,
      description: desc, status: 'posted'
    }).select().single();

    if (jeErr || !je) {
      await loadInvoices();
      alert('Invoice marked paid ✓\\n\\nNote: Could not auto-post journal entry: ' + (jeErr?.message || 'unknown error') + '. Please post manually.');
      return;
    }

    await sb.from('journal_lines').insert([
      { journal_entry_id: je.id, account_id: cashAcct.id,  debit: amount, credit: 0,      memo: desc, sort_order: 1 },
      { journal_entry_id: je.id, account_id: creditAcct.id, debit: 0,     credit: amount, memo: desc, sort_order: 2 }
    ]);

    await loadInvoices();
    showToast(\`✓ Paid · Journal entry posted (\${cashAcct.name} / \${creditLabel})\`, 'green');
  };

  window.deleteClientInvoice = async function(invId) {
    if (!confirm('Delete this invoice? This cannot be undone.')) return;
    await sb.from('client_invoices').delete().eq('id', invId);
    await loadInvoices();
  };

  window.downloadInvoicePdf = async function(invId) {
    const { data: inv } = await sb.from('client_invoices').select('*').eq('id', invId).single();
    if (!inv) { showToast('Could not load invoice', 'red'); return; }

    const businessName = c.full_name || 'Your Business';
    const businessEmail = c.email || '';
    const businessPhone = c.phone || '';
    const businessAddress = c.address || '';

    const statusColor = { draft:'#888', sent:'#d97706', paid:'#16a34a', void:'#dc2626' }[inv.status] || '#888';
    const lineItems = Array.isArray(inv.line_items) ? inv.line_items : [];
    const fmtMoney = n => '$' + parseFloat(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) : '—';

    const lineRows = lineItems.map(it => \`
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0">\${it.description || ''}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center">\${it.qty || 1}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right">\${fmtMoney(it.rate)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600">\${fmtMoney(it.amount)}</td>
      </tr>\`).join('');

    const html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice \${esc(inv.invoice_number)}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; background:#fff; padding:48px; font-size:14px; line-height:1.5; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; }
    .firm-name { font-size:26px; font-weight:800; color:#1a1a2e; letter-spacing:-0.5px; }
    .firm-name span { color:#d4a843; }
    .firm-details { font-size:12px; color:#666; margin-top:6px; line-height:1.6; }
    .invoice-meta { text-align:right; }
    .invoice-label { font-size:11px; font-weight:700; color:#888; letter-spacing:.08em; text-transform:uppercase; }
    .invoice-number { font-size:28px; font-weight:800; color:#1a1a2e; margin:4px 0; }
    .status-badge { display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#fff; background:\${statusColor}; margin-top:4px; }
    .divider { border:none; border-top:2px solid #d4a843; margin:0 0 32px 0; }
    .bill-section { display:flex; justify-content:space-between; margin-bottom:32px; }
    .bill-block { }
    .bill-label { font-size:11px; font-weight:700; color:#888; letter-spacing:.08em; text-transform:uppercase; margin-bottom:6px; }
    .bill-name { font-size:16px; font-weight:700; color:#1a1a2e; }
    .bill-detail { font-size:13px; color:#555; }
    .dates { display:flex; gap:48px; }
    .date-item { }
    .date-label { font-size:11px; font-weight:700; color:#888; letter-spacing:.08em; text-transform:uppercase; margin-bottom:4px; }
    .date-value { font-size:14px; font-weight:600; color:#1a1a2e; }
    table { width:100%; border-collapse:collapse; margin-bottom:24px; }
    thead tr { background:#1a1a2e; color:#fff; }
    thead th { padding:12px; text-align:left; font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
    thead th:last-child, thead th:nth-child(3) { text-align:right; }
    thead th:nth-child(2) { text-align:center; }
    tbody tr:last-child td { border-bottom:none; }
    .totals { margin-left:auto; width:280px; }
    .totals-row { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid #f0f0f0; font-size:14px; }
    .totals-row.total { border-bottom:none; border-top:2px solid #1a1a2e; padding-top:12px; margin-top:4px; font-size:17px; font-weight:800; color:#1a1a2e; }
    .notes { margin-top:40px; padding:16px; background:#f9f7f0; border-left:4px solid #d4a843; border-radius:4px; }
    .notes-label { font-size:11px; font-weight:700; color:#888; letter-spacing:.08em; text-transform:uppercase; margin-bottom:6px; }
    .footer { margin-top:56px; padding-top:20px; border-top:1px solid #eee; display:flex; justify-content:space-between; font-size:11px; color:#aaa; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="firm-name">\${esc(businessName)}</div>
      <div class="firm-details">
        \${businessEmail ? businessEmail + '<br>' : ''}
        \${businessPhone ? businessPhone + '<br>' : ''}
        \${businessAddress || ''}
      </div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-label">Invoice</div>
      <div class="invoice-number">\${esc(inv.invoice_number)}</div>
      <span class="status-badge">\${inv.status}</span>
    </div>
  </div>

  <hr class="divider">

  <div class="bill-section">
    <div class="bill-block">
      <div class="bill-label">Bill To</div>
      <div class="bill-name">\${esc(inv.customer_name)}</div>
      \${inv.customer_email ? \`<div class="bill-detail">\${esc(inv.customer_email)}</div>\` : ''}
    </div>
    <div class="dates">
      <div class="date-item">
        <div class="date-label">Issue Date</div>
        <div class="date-value">\${fmtDate(inv.issue_date)}</div>
      </div>
      \${inv.due_date ? \`<div class="date-item">
        <div class="date-label">Due Date</div>
        <div class="date-value">\${fmtDate(inv.due_date)}</div>
      </div>\` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Rate</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>\${lineRows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>\${fmtMoney(inv.subtotal)}</span></div>
    \${parseFloat(inv.tax_rate) > 0 ? \`<div class="totals-row"><span>Tax (\${inv.tax_rate}%)</span><span>\${fmtMoney(inv.tax_amount)}</span></div>\` : ''}
    <div class="totals-row total"><span>Total Due</span><span>\${fmtMoney(inv.total)}</span></div>
  </div>

  \${inv.notes ? \`<div class="notes"><div class="notes-label">Notes</div>\${esc(inv.notes)}</div>\` : ''}

  <div class="footer">
    <span>Thank you for your business!</span>
    <span>Powered by LedgerFlow</span>
  </div>
</body>
</html>\`;

    // Open in a new tab so the browser print dialog can save as PDF
    const win = window.open('', '_blank');
    if (!win) { showToast('Allow pop-ups to download PDF', 'gold'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  };

  // Upload files
  document.getElementById('doc-upload-input').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const prog = document.getElementById('doc-upload-progress');
    prog.innerHTML = \`<div style="padding:8px 0;font-size:13px;color:var(--muted)">Uploading \${files.length} file(s)…</div>\`;
    let uploaded = 0, failed = 0;
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const path = \`\${c.id}/\${Date.now()}-\${Math.random().toString(36).slice(2)}.\${ext}\`;
      const { error: upErr } = await sb.storage.from('client-documents').upload(path, file);
      if (upErr) { failed++; continue; }
      await sb.from('client_documents').insert({
        client_id: c.id,
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: (await sb.auth.getUser()).data.user?.id
      });
      uploaded++;
    }
    prog.innerHTML = \`<div style="padding:8px 0;font-size:13px;color:var(--green)">✓ \${uploaded} file(s) uploaded\${failed ? \` · \${failed} failed\` : ''}.</div>\`;
    e.target.value = '';
    setTimeout(() => { if (prog) prog.innerHTML = ''; }, 3000);
    await loadDocs();
  });
}

// ── CLIENTS ────────────────────────────────────────────────
async function renderClients(container) {
  container.innerHTML = pageShell('Clients', 'Firm Roster', "\\n    <button class=\\"btn btn-secondary\\" onclick=\\"openAddClientModal()\\">+ Add Client</button>\\n  ", '<div class="loading-block"><span class="spinner"></span> Loading clients…</div>');
  const {
    data,
    error
  } = await sb.from('clients').select('*').order('full_name');
  const main = container.querySelector('#main');
  if (error || !data) {
    main.innerHTML = '<div class="alert alert-red">Error loading clients: ' + esc(error === null || error === void 0 ? void 0 : error.message) + '</div>';
    return;
  }
  if (!data.length) {
    main.innerHTML = '<div class="empty"><div class="empty-icon">👥</div>No clients yet.</div>';
    return;
  }
  main.innerHTML = "\\n    <div class=\\"card\\">\\n      <table>\\n        <thead><tr>\\n          <th>Client</th><th>Business Type</th><th>EIN / ITIN</th><th>Contact</th><th>Status</th><th></th>\\n        </tr></thead>\\n        <tbody>".concat(data.map(c => "\\n          <tr class=\\"client-row\\" data-client-id=\\"".concat(esc(c.id), "\\" style=\\"cursor:pointer\\">\\n            <td><div style=\\"font-weight:600\\">").concat(esc(c.full_name), "</div>").concat(c.service_package ? "<div style=\\\\\\"font-size:11px;margin-top:2px;color:var(--gold);font-weight:600\\\\\\">".concat(({starter:'⭐ Starter',essentials:'✨ Essentials',growth:'🚀 Growth',premium:'💎 Premium'})[c.service_package]||c.service_package, "</div>") : '', "</td>\\n            <td>").concat(esc(c.entity_type || '—'), "</td>\\n            <td style=\\"font-family:monospace;font-size:12px\\">").concat(esc(c.email || '—'), "</td>\\n            <td style=\\"font-size:12px\\">").concat(esc(c.phone || '—'), "</td>\\n            <td><span class=\\"badge ").concat(c.status === 'active' ? 'badge-green' : 'badge-grey', "\\">").concat(esc(c.status || 'inactive'), "</span></td>\\n            <td style=\\"text-align:right;padding-right:8px\\"><button class=\\"btn btn-secondary client-view-btn\\" data-client-id=\\"").concat(esc(c.id), "\\" style=\\"font-size:12px;padding:3px 10px\\">View →</button></td>\\n          </tr>\\n        ")).join(''), "</tbody>\\n      </table>\\n    </div>\\n  ");

  // Wire up row / button clicks
  main.querySelectorAll('.client-view-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const c = data.find(cl => cl.id === btn.dataset.clientId);
      if (c) openClientDetail(c);
    });
  });
  main.querySelectorAll('.client-row').forEach(row => {
    row.addEventListener('click', () => {
      const c = data.find(cl => cl.id === row.dataset.clientId);
      if (c) openClientDetail(c);
    });
  });
}
function openClientDetail(c) {
  try {
    ensureModalStyles();
  } catch (e) {}
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'cdet-backdrop';
  const info = (label, val) => val ? "\\n    <div style=\\"display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)\\">\\n      <span style=\\"min-width:140px;font-size:12px;color:var(--muted)\\">".concat(label, "</span>\\n      <span style=\\"font-size:13px;font-weight:500\\">").concat(esc(val), "</span>\\n    </div>") : '';
  bd.innerHTML = "\\n    <div class=\\"modal\\" role=\\"dialog\\" style=\\"max-width:520px\\">\\n      <div class=\\"modal-header\\">\\n        <h3>".concat(esc(c.full_name), "</h3>\\n        <button class=\\"modal-close\\" onclick=\\"closeModal('cdet-backdrop')\\" aria-label=\\"Close\\">×</button>\\n      </div>\\n      <div class=\\"modal-body\\">\\n        <div style=\\"margin-bottom:16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap\\">\\n          <span class=\\"badge ").concat(c.status === 'active' ? 'badge-green' : 'badge-grey', "\\">").concat(esc(c.status || 'inactive'), "</span>\\n          <span style=\\"font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;").concat((c.client_type || 'personal') === 'business' ? 'background:rgba(234,179,8,.15);color:var(--gold)' : 'background:rgba(34,197,94,.12);color:var(--green)', "\\">").concat((c.client_type || 'personal') === 'business' ? '🏢 Business' : '👤 Personal', "</span>\\n          <span style=\\"font-size:13px;color:var(--muted)\\">").concat(esc(c.entity_type || ''), "</span>\\n        </div>\\n        ").concat(info('Email', c.email), "\\n        ").concat(info('Phone', c.phone), "\\n        ").concat(info('Address', c.address), "\\n        ").concat(info('EIN / ITIN', c.ein), "\\n        ").concat(info('State', c.state), "\\n        ").concat(info('Industry', c.industry), "\\n        ").concat(info('Service Package', c.service_package ? ({starter:'⭐ Starter — $149/mo', essentials:'✨ Essentials — $299/mo', growth:'🚀 Growth — $499/mo', premium:'💎 Premium — $799/mo'})[c.service_package] || c.service_package : null), "\\n        ").concat(info('Notes', c.notes), "\\n\\n        <div style=\\"margin-top:20px\\">\\n          <div style=\\"font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em;margin-bottom:10px\\">QUICK ACTIONS</div>\\n          <div style=\\"display:flex;flex-wrap:wrap;gap:8px\\">\\n            <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('cdet-backdrop');STATE.selectedClientId='").concat(esc(c.id), "';updateClientDropdown();navigateTo('journal')\\">📒 Journal Entries</button>\\n            <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('cdet-backdrop');STATE.selectedClientId='").concat(esc(c.id), "';updateClientDropdown();navigateTo('payroll')\\">💼 Payroll</button>\\n            <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('cdet-backdrop');STATE.selectedClientId='").concat(esc(c.id), "';updateClientDropdown();navigateTo('tax')\\">🏛 Tax Returns</button>\\n            <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('cdet-backdrop');STATE.selectedClientId='").concat(esc(c.id), "';updateClientDropdown();navigateTo('dashboard')\\">📊 Dashboard</button>\\n            <button class=\\"btn btn-secondary\\" id=\\"cdet-apply-coa-btn\\" onclick=\\"openApplyCOAPanel('").concat(esc(c.id), "')\\">📂 Apply COA Template</button>\\n          </div>\\n        </div>\\n\\n        <div id=\\"cdet-coa-panel\\" style=\\"display:none;margin-top:12px;padding:14px;background:var(--bg);border-radius:8px;border:1px solid var(--border)\\">\\n          <div style=\\"font-size:12px;font-weight:600;margin-bottom:8px\\">Select an industry template to load into this client's Chart of Accounts:</div>\\n          <select id=\\"cdet-coa-industry\\" style=\\"width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;margin-bottom:10px\\">\\n            <option value=\\"\\">— Pick an industry —</option>\\n            <option>Professional Services</option><option>Medical / Healthcare</option>\\n            <option>Salon & Beauty</option><option>Cleaning Services</option>\\n            <option>Landscaping & Lawn Care</option><option>Auto Repair & Mechanic</option>\\n            <option>Restaurant / Food Service</option><option>Catering</option>\\n            <option>Food Truck</option><option>Bar & Nightclub</option>\\n            <option>General Contractor</option><option>Plumbing & HVAC</option>\\n            <option>Electrical</option><option>Painting & Flooring</option>\\n            <option>Retail Store</option><option>E-Commerce/Online Store</option>\\n            <option>Wholesale & Distribution</option><option>Trucking/Freight</option>\\n            <option>Rideshare/Gig Worker</option><option>Moving Company</option>\\n            <option>Real Estate Agent/Broker</option><option>Property Management</option>\\n            <option>Short-Term Rental (Airbnb)</option><option>Tech/Software Company</option>\\n            <option>IT Services & Consulting</option><option>Marketing & Design Agency</option>\\n            <option>Nonprofit Organization</option><option>Church/Religious Organization</option>\\n            <option>General/Other</option>\\n          </select>\\n          <div style=\\"font-size:11px;color:var(--muted);margin-bottom:10px\\">⚠️ This will add template accounts to this client. Existing accounts are kept.</div>\\n          <div style=\\"display:flex;gap:8px\\">\\n            <button class=\\"btn btn-primary\\" id=\\"cdet-coa-apply-btn\\" style=\\"font-size:12px;padding:6px 14px\\">Apply Template</button>\\n            <button class=\\"btn\\" onclick=\\"document.getElementById('cdet-coa-panel').style.display='none'\\" style=\\"font-size:12px;padding:6px 14px;background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">Cancel</button>\\n          </div>\\n          <div id=\\"cdet-coa-msg\\" style=\\"font-size:12px;margin-top:8px;min-height:14px\\"></div>\\n        </div>\\n\\n        <div style=\\"margin-top:20px;padding:14px;background:var(--bg);border-radius:8px;border:1px solid var(--border)\\">\\n          <div style=\\"font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em;margin-bottom:10px\\">🔑 CLIENT PORTAL ACCESS</div>\\n          ").concat(c.auth_user_id ? "<div style=\\"display:flex;align-items:center;gap:8px\\">\\n                <span style=\\"color:var(--green);font-size:16px\\">✓</span>\\n                <span style=\\"font-size:13px;font-weight:500\\">Portal access linked</span>\\n              </div>\\n              <div style=\\"font-size:12px;color:var(--muted);margin-top:4px\\">Client email: <strong>".concat(esc(c.email || ''), "</strong></div>\\n              <button class=\\"btn btn-secondary\\" id=\\"cdet-resend-btn\\" style=\\"margin-top:10px;font-size:12px;padding:6px 12px\\">↺ Resend password email</button>\\n              <div id=\\"cdet-resend-msg\\" style=\\"font-size:12px;margin-top:6px;min-height:16px\\"></div>") : "<div style=\\"font-size:13px;color:var(--muted);margin-bottom:10px\\">This client does not have portal access yet.</div>\\n              <div style=\\"display:flex;align-items:center;gap:8px\\">\\n                <input id=\\"cdet-portal-email\\" type=\\"email\\" placeholder=\\"Client email\\" value=\\"".concat(esc(c.email || ''), "\\" style=\\"flex:1;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px\\">\\n                <button class=\\"btn btn-primary\\" id=\\"cdet-invite-btn\\" style=\\"white-space:nowrap;font-size:12px;padding:7px 14px\\">Create Login</button>\\n              </div>\\n              <div id=\\"cdet-invite-msg\\" style=\\"font-size:12px;margin-top:6px;min-height:16px\\"></div>"), "\\n        </div>\\n\\n        <div style=\\"margin-top:20px\\">\\n          <div style=\\"display:flex;align-items:center;justify-content:space-between;margin-bottom:10px\\">\\n            <div style=\\"font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em\\">📋 TASKS</div>\\n            <div style=\\"display:flex;gap:6px\\">\\n              <button class=\\"btn\\" id=\\"cdet-assign-year-btn\\" style=\\"font-size:11px;padding:4px 10px;background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">📅 Assign Year Tasks</button>\\n              <button class=\\"btn btn-primary\\" id=\\"cdet-add-task-btn\\" style=\\"font-size:11px;padding:4px 10px\\">+ Add Task</button>\\n            </div>\\n          </div>\\n\\n          <div id=\\"cdet-year-task-panel\\" style=\\"display:none;background:var(--bg);border-radius:8px;border:1px solid var(--border);padding:14px;margin-bottom:12px\\">\\n            <div style=\\"font-size:12px;font-weight:600;margin-bottom:8px\\">Select services to assign tasks for:</div>\\n            <div style=\\"display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px\\">\\n              <label style=\\"display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer\\"><input type=\\"checkbox\\" id=\\"yt-svc-tax\\" style=\\"width:auto;accent-color:var(--gold)\\" onchange=\\"ytUpdatePreview()\\"> 🏛 Tax Returns</label>\\n              <label style=\\"display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer\\"><input type=\\"checkbox\\" id=\\"yt-svc-bookkeeping\\" style=\\"width:auto;accent-color:var(--gold)\\" onchange=\\"ytUpdatePreview()\\"> 📒 Bookkeeping</label>\\n              <label style=\\"display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer\\"><input type=\\"checkbox\\" id=\\"yt-svc-payroll\\" style=\\"width:auto;accent-color:var(--gold)\\" onchange=\\"ytUpdatePreview()\\"> 💼 Payroll</label>\\n            </div>\\n            <div id=\\"yt-tasks-preview\\"></div>\\n            <div style=\\"display:flex;gap:8px;margin-top:10px\\">\\n              <button class=\\"btn btn-primary\\" id=\\"yt-assign-btn\\" style=\\"font-size:12px;padding:6px 14px\\">Assign Selected Tasks</button>\\n              <button class=\\"btn\\" onclick=\\"document.getElementById('cdet-year-task-panel').style.display='none';document.getElementById('cdet-assign-year-btn').style.display=''\\" style=\\"font-size:12px;padding:6px 14px;background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">Cancel</button>\\n            </div>\\n            <div id=\\"yt-err\\" style=\\"font-size:12px;color:var(--red);margin-top:6px;min-height:14px\\"></div>\\n          </div>\\n\\n          <div id=\\"cdet-task-form\\" style=\\"display:none;background:var(--bg);border-radius:8px;border:1px solid var(--border);padding:12px;margin-bottom:12px\\">\\n            <input id=\\"cdet-task-title\\" type=\\"text\\" placeholder=\\"Task title\\" style=\\"width:100%;box-sizing:border-box;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;margin-bottom:8px\\">\\n            <textarea id=\\"cdet-task-desc\\" placeholder=\\"Description (optional)\\" rows=\\"2\\" style=\\"width:100%;box-sizing:border-box;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;resize:vertical;margin-bottom:8px\\"></textarea>\\n            <div style=\\"display:flex;gap:8px;align-items:center\\">\\n              <select id=\\"cdet-task-priority\\" style=\\"padding:6px 8px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:12px\\">\\n                <option value=\\"normal\\">Normal</option>\\n                <option value=\\"urgent\\">🔴 Urgent</option>\\n                <option value=\\"low\\">⚪ Low</option>\\n              </select>\\n              <input id=\\"cdet-task-due\\" type=\\"date\\" style=\\"padding:6px 8px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:12px\\">\\n              <button class=\\"btn btn-primary\\" id=\\"cdet-task-save\\" style=\\"font-size:12px;padding:6px 12px\\">Save</button>\\n              <button class=\\"btn\\" id=\\"cdet-task-cancel\\" style=\\"font-size:12px;padding:6px 12px;background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">Cancel</button>\\n            </div>\\n            <div id=\\"cdet-task-err\\" style=\\"font-size:12px;color:var(--red);margin-top:6px;min-height:14px\\"></div>\\n          </div>\\n          <div id=\\"cdet-tasks-list\\"><span class=\\"spinner\\" style=\\"width:14px;height:14px\\"></span></div>\\n        </div>\\n\\n        <div style=\\"margin-top:20px\\">\\n          <div style=\\"font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em;margin-bottom:10px\\">📁 CLIENT DOCUMENTS</div>\\n          <div id=\\"cdet-docs-list\\"><span class=\\"spinner\\" style=\\"width:14px;height:14px\\"></span></div>\\n        </div>\\n\\n        <div style=\\"margin-top:20px\\">\\n          <div style=\\"display:flex;align-items:center;justify-content:space-between;margin-bottom:10px\\">\\n            <div style=\\"font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em\\">💳 BILLING</div>\\n            <button class=\\"btn btn-primary\\" id=\\"cdet-add-bill-btn\\" style=\\"font-size:11px;padding:4px 10px\\">+ Add Charge</button>\\n          </div>\\n          <div id=\\"cdet-bill-form\\" style=\\"display:none;background:var(--bg);border-radius:8px;border:1px solid var(--border);padding:12px;margin-bottom:12px\\">\\n            <input id=\\"cdet-bill-desc\\" type=\\"text\\" placeholder=\\"Description (e.g. Tax prep 2024)\\" style=\\"width:100%;box-sizing:border-box;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;margin-bottom:8px\\">\\n            <div style=\\"display:flex;gap:8px;margin-bottom:8px\\">\\n              <input id=\\"cdet-bill-amount\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"Amount $\\" style=\\"flex:1;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px\\">\\n              <input id=\\"cdet-bill-due\\" type=\\"date\\" style=\\"flex:1;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px\\">\\n              <select id=\\"cdet-bill-status\\" style=\\"flex:1;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px\\">\\n                <option value=\\"unpaid\\">Unpaid</option>\\n                <option value=\\"paid\\">Paid</option>\\n                <option value=\\"void\\">Void</option>\\n              </select>\\n            </div>\\n            <input id=\\"cdet-bill-notes\\" type=\\"text\\" placeholder=\\"Notes (optional)\\" style=\\"width:100%;box-sizing:border-box;padding:7px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;margin-bottom:8px\\">\\n            <div style=\\"display:flex;gap:8px\\">\\n              <button class=\\"btn btn-primary\\" id=\\"cdet-bill-save\\" style=\\"font-size:12px;padding:6px 12px\\">Save Charge</button>\\n              <button class=\\"btn\\" id=\\"cdet-bill-cancel\\" style=\\"font-size:12px;padding:6px 12px;background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">Cancel</button>\\n            </div>\\n            <div id=\\"cdet-bill-err\\" style=\\"font-size:12px;color:var(--red);margin-top:6px;min-height:14px\\"></div>\\n          </div>\\n          <div id=\\"cdet-billing-list\\"><span class=\\"spinner\\" style=\\"width:14px;height:14px\\"></span></div>\\n        </div>\\n\\n        <div style=\\"margin-top:20px\\">\\n          <div style=\\"font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em;margin-bottom:10px\\">🧾 CLIENT INVOICES</div>\\n          <div id=\\"cdet-invoices-list\\"><span class=\\"spinner\\" style=\\"width:14px;height:14px\\"></span></div>\\n        </div>\\n\\n      </div>\\n      <div class=\\"modal-footer\\">\\n        <button class=\\"btn\\" onclick=\\"closeModal('cdet-backdrop')\\" style=\\"background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">Close</button>\\n        <button class=\\"btn\\" id=\\"cdet-edit-btn\\" style=\\"margin-left:auto;background:var(--surface);color:var(--text);border:1.5px solid var(--border)\\">✏️ Edit Info</button>\\n        <button class=\\"btn btn-primary\\" onclick=\\"closeModal('cdet-backdrop');STATE.selectedClientId='").concat(esc(c.id), "';updateClientDropdown();navigateTo('dashboard')\\">Select Client →</button>\\n      </div>\\n    </div>");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('cdet-backdrop');
  });

  // ── Admin tasks section ──
  async function loadAdminTasks() {
    const { data: tasks, error } = await sb.from('client_tasks')
      .select('*').eq('client_id', c.id).order('completed').order('priority', { ascending: false }).order('due_date', { nullsFirst: false });
    const el = document.getElementById('cdet-tasks-list');
    if (!el) return;
    if (error) { el.innerHTML = \`<div style="font-size:12px;color:var(--red)">\${esc(error.message)}</div>\`; return; }
    if (!tasks || !tasks.length) {
      el.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0">No tasks yet. Add one above.</div>';
      return;
    }
    el.innerHTML = tasks.map(t => {
      const priorityColor = { urgent: 'var(--red)', normal: 'var(--gold)', low: 'var(--muted)' }[t.priority] || 'var(--muted)';
      const due = t.due_date ? \` · Due \${new Date(t.due_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\` : '';
      return \`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);\${t.completed ? 'opacity:.5' : ''}">
        <input type="checkbox" data-atask-id="\${esc(t.id)}" \${t.completed ? 'checked' : ''}
          style="width:15px;height:15px;cursor:pointer;accent-color:var(--green);flex-shrink:0"
          onchange="toggleAdminTask(this)">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;\${t.completed ? 'text-decoration:line-through' : ''}">\${esc(t.title)}</div>
          \${t.description ? \`<div style="font-size:11px;color:var(--muted)">\${esc(t.description)}</div>\` : ''}
          <div style="font-size:11px;color:\${priorityColor};font-weight:600">\${{ urgent:'🔴', normal:'🟡', low:'⚪' }[t.priority] || ''}\${due}</div>
        </div>
        <button onclick="deleteAdminTask('\${esc(t.id)}')"
          style="background:none;border:none;cursor:pointer;color:var(--red);font-size:14px;padding:0 4px;flex-shrink:0" title="Delete task">🗑</button>
      </div>\`;
    }).join('');
  }
  loadAdminTasks();

  // ── Assign Year Tasks panel ──
  const assignYearBtn = document.getElementById('cdet-assign-year-btn');
  if (assignYearBtn) {
    assignYearBtn.addEventListener('click', () => {
      assignYearBtn.style.display = 'none';
      const panel = document.getElementById('cdet-year-task-panel');
      panel.style.display = 'block';
      // Pre-check based on client's existing services
      const svcs = c.services || ['tax'];
      const taxCb = document.getElementById('yt-svc-tax');
      const bkCb  = document.getElementById('yt-svc-bookkeeping');
      const prCb  = document.getElementById('yt-svc-payroll');
      if (taxCb) taxCb.checked = svcs.includes('tax');
      if (bkCb)  bkCb.checked  = svcs.includes('bookkeeping');
      if (prCb)  prCb.checked  = svcs.includes('payroll');
      ytUpdatePreview();
    });
  }

  window.ytUpdatePreview = function() {
    const hasTax = document.getElementById('yt-svc-tax')?.checked;
    const hasBk  = document.getElementById('yt-svc-bookkeeping')?.checked;
    const hasPr  = document.getElementById('yt-svc-payroll')?.checked;
    const preview = document.getElementById('yt-tasks-preview');
    if (!preview) return;
    const tasks = [];
    if (hasTax) tasks.push(...ONBOARDING_TASKS.tax);
    if (hasBk)  tasks.push(...ONBOARDING_TASKS.bookkeeping);
    if (hasPr)  tasks.push(...ONBOARDING_TASKS.payroll);
    if (!tasks.length) {
      preview.innerHTML = '<div style="font-size:12px;color:var(--muted)">Select at least one service.</div>';
      preview.dataset.tasks = '[]';
      return;
    }
    preview.dataset.tasks = JSON.stringify(tasks);
    preview.innerHTML = tasks.map((t, i) => \`
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
        <input type="checkbox" id="yt-task-\${i}" style="width:auto;accent-color:var(--green);flex-shrink:0" checked>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:500">\${esc(t.title)}</div>
          <div style="font-size:11px;color:var(--muted)">\${esc(t.description)}</div>
        </div>
        <span style="font-size:10px;font-weight:600;color:\${t.priority==='urgent'?'var(--red)':'var(--muted)'}">\${t.priority==='urgent'?'🔴 Urgent':'Normal'}</span>
      </div>\`).join('');
  };

  const ytAssignBtn = document.getElementById('yt-assign-btn');
  if (ytAssignBtn) {
    ytAssignBtn.addEventListener('click', async () => {
      const preview = document.getElementById('yt-tasks-preview');
      const allTasks = JSON.parse(preview?.dataset.tasks || '[]');
      const selected = allTasks.filter((_, i) => document.getElementById(\`yt-task-\${i}\`)?.checked);
      const errEl = document.getElementById('yt-err');
      if (!selected.length) { errEl.textContent = 'Select at least one task.'; return; }
      ytAssignBtn.disabled = true;
      ytAssignBtn.textContent = 'Assigning…';
      errEl.textContent = '';
      const { error } = await sb.from('client_tasks').insert(
        selected.map(t => ({ client_id: c.id, title: t.title, description: t.description, priority: t.priority }))
      );
      if (error) {
        errEl.textContent = 'Error: ' + error.message;
        ytAssignBtn.disabled = false;
        ytAssignBtn.textContent = 'Assign Selected Tasks';
        return;
      }
      document.getElementById('cdet-year-task-panel').style.display = 'none';
      document.getElementById('cdet-assign-year-btn').style.display = '';
      ytAssignBtn.disabled = false;
      ytAssignBtn.textContent = 'Assign Selected Tasks';
      loadAdminTasks();
    });
  }

  window.toggleAdminTask = async function(cb) {
    const taskId = cb.dataset.ataskId;
    cb.disabled = true;
    await sb.from('client_tasks').update({
      completed: cb.checked,
      completed_at: cb.checked ? new Date().toISOString() : null
    }).eq('id', taskId);
    loadAdminTasks();
  };

  window.deleteAdminTask = async function(taskId) {
    if (!confirm('Delete this task?')) return;
    await sb.from('client_tasks').delete().eq('id', taskId);
    loadAdminTasks();
  };

  const addTaskBtn = document.getElementById('cdet-add-task-btn');
  const taskForm = document.getElementById('cdet-task-form');
  if (addTaskBtn && taskForm) {
    addTaskBtn.addEventListener('click', () => { taskForm.style.display = 'block'; addTaskBtn.style.display = 'none'; });
    document.getElementById('cdet-task-cancel').addEventListener('click', () => { taskForm.style.display = 'none'; addTaskBtn.style.display = ''; });
    document.getElementById('cdet-task-save').addEventListener('click', async () => {
      const title = document.getElementById('cdet-task-title').value.trim();
      const errEl = document.getElementById('cdet-task-err');
      if (!title) { errEl.textContent = 'Title is required.'; return; }
      errEl.textContent = '';
      document.getElementById('cdet-task-save').disabled = true;
      document.getElementById('cdet-task-save').textContent = 'Saving…';
      const dueVal = document.getElementById('cdet-task-due').value;
      const { error } = await sb.from('client_tasks').insert({
        client_id: c.id,
        title,
        description: document.getElementById('cdet-task-desc').value.trim() || null,
        priority: document.getElementById('cdet-task-priority').value,
        due_date: dueVal || null
      });
      if (error) {
        errEl.textContent = error.message;
        document.getElementById('cdet-task-save').disabled = false;
        document.getElementById('cdet-task-save').textContent = 'Save';
        return;
      }
      document.getElementById('cdet-task-title').value = '';
      document.getElementById('cdet-task-desc').value = '';
      document.getElementById('cdet-task-due').value = '';
      taskForm.style.display = 'none';
      addTaskBtn.style.display = '';
      document.getElementById('cdet-task-save').disabled = false;
      document.getElementById('cdet-task-save').textContent = 'Save';
      loadAdminTasks();
    });
  }

  // ── Admin documents section ──
  async function loadAdminDocs() {
    const { data: docs, error } = await sb.from('client_documents')
      .select('*').eq('client_id', c.id).order('uploaded_at', { ascending: false });
    const el = document.getElementById('cdet-docs-list');
    if (!el) return;
    if (error) { el.innerHTML = \`<div style="font-size:12px;color:var(--red)">\${esc(error.message)}</div>\`; return; }
    if (!docs || !docs.length) {
      el.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0">No documents uploaded yet.</div>';
      return;
    }
    el.innerHTML = docs.map(d => {
      const icon = d.mime_type?.startsWith('image/') ? '🖼️' : d.mime_type === 'application/pdf' ? '📄' : '📎';
      const size = d.file_size ? (d.file_size > 1048576 ? \`\${(d.file_size/1048576).toFixed(1)} MB\` : \`\${Math.round(d.file_size/1024)} KB\`) : '';
      const uploadedDate = new Date(d.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const reviewedBadge = d.reviewed
        ? \`<span style="font-size:10px;font-weight:600;color:var(--green);background:rgba(34,197,94,.12);padding:2px 7px;border-radius:10px">✓ Reviewed</span>\`
        : \`<span style="font-size:10px;font-weight:600;color:var(--gold);background:rgba(234,179,8,.12);padding:2px 7px;border-radius:10px">Pending review</span>\`;
      return \`<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:20px;flex-shrink:0">\${icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:500;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(d.file_name)}</div>
          <div style="font-size:11px;color:var(--muted)">\${uploadedDate}\${size ? ' · ' + size : ''}</div>
          <div style="margin-top:3px">\${reviewedBadge}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button onclick="viewAdminDoc('\${esc(d.file_path)}','\${esc(d.file_name)}')"
            style="background:none;border:1px solid var(--border);border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;color:var(--text)">View</button>
          \${!d.reviewed ? \`<button onclick="markDocReviewed('\${esc(d.id)}')"
            style="background:none;border:1px solid var(--green);border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;color:var(--green)">✓ Mark reviewed</button>\` : ''}
        </div>
      </div>\`;
    }).join('');
  }
  loadAdminDocs();

  // ── Admin billing section ──
  async function loadAdminBilling() {
    const el = document.getElementById('cdet-billing-list');
    if (!el) return;
    const { data: bills } = await sb.from('client_billing')
      .select('*').eq('client_id', c.id).order('created_at', { ascending: false });
    if (!bills || !bills.length) {
      el.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0">No charges yet.</div>';
      return;
    }
    el.innerHTML = bills.map(b => {
      const statusColor = { unpaid:'var(--red)', paid:'var(--green)', void:'var(--muted)' }[b.status] || 'var(--muted)';
      const due = b.due_date ? \` · Due \${new Date(b.due_date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}\` : '';
      return \`<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500">\${esc(b.description)}</div>
          \${b.notes ? \`<div style="font-size:11px;color:var(--muted)">\${esc(b.notes)}</div>\` : ''}
          <div style="font-size:11px;color:var(--muted)">$\${parseFloat(b.amount).toFixed(2)}\${due} · <span style="font-weight:600;color:\${statusColor}">\${b.status.toUpperCase()}</span></div>
        </div>
        <div style="display:flex;gap:5px;flex-shrink:0">
          \${b.status === 'unpaid' ? \`<button onclick="markBillPaid('\${esc(b.id)}')" style="border:1px solid var(--green);background:none;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;color:var(--green)">Mark Paid</button>\` : ''}
          <button onclick="voidBill('\${esc(b.id)}')" style="border:1px solid var(--border);background:none;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;color:var(--muted)">Void</button>
          <button onclick="deleteBill('\${esc(b.id)}')" style="border:1px solid var(--red);background:none;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;color:var(--red)">🗑</button>
        </div>
      </div>\`;
    }).join('');
  }
  loadAdminBilling();

  const addBillBtn = document.getElementById('cdet-add-bill-btn');
  const billForm = document.getElementById('cdet-bill-form');
  if (addBillBtn && billForm) {
    addBillBtn.addEventListener('click', () => { billForm.style.display = 'block'; addBillBtn.style.display = 'none'; });
    document.getElementById('cdet-bill-cancel').addEventListener('click', () => { billForm.style.display = 'none'; addBillBtn.style.display = ''; });
    document.getElementById('cdet-bill-save').addEventListener('click', async () => {
      const errEl = document.getElementById('cdet-bill-err');
      const desc = document.getElementById('cdet-bill-desc').value.trim();
      const amount = parseFloat(document.getElementById('cdet-bill-amount').value);
      if (!desc) { errEl.textContent = 'Description is required.'; return; }
      if (!amount || amount <= 0) { errEl.textContent = 'Enter a valid amount.'; return; }
      errEl.textContent = '';
      document.getElementById('cdet-bill-save').disabled = true;
      document.getElementById('cdet-bill-save').textContent = 'Saving…';
      const { error } = await sb.from('client_billing').insert({
        client_id: c.id,
        description: desc,
        amount,
        due_date: document.getElementById('cdet-bill-due').value || null,
        status: document.getElementById('cdet-bill-status').value,
        notes: document.getElementById('cdet-bill-notes').value.trim() || null
      });
      document.getElementById('cdet-bill-save').disabled = false;
      document.getElementById('cdet-bill-save').textContent = 'Save Charge';
      if (error) { errEl.textContent = error.message; return; }
      document.getElementById('cdet-bill-desc').value = '';
      document.getElementById('cdet-bill-amount').value = '';
      document.getElementById('cdet-bill-due').value = '';
      document.getElementById('cdet-bill-notes').value = '';
      document.getElementById('cdet-bill-status').value = 'unpaid';
      billForm.style.display = 'none';
      addBillBtn.style.display = '';
      loadAdminBilling();
    });
  }

  window.markBillPaid = async function(billId) {
    await sb.from('client_billing').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', billId);
    loadAdminBilling();
  };
  window.voidBill = async function(billId) {
    if (!confirm('Mark this charge as void?')) return;
    await sb.from('client_billing').update({ status: 'void' }).eq('id', billId);
    loadAdminBilling();
  };
  window.deleteBill = async function(billId) {
    if (!confirm('Delete this charge? This cannot be undone.')) return;
    await sb.from('client_billing').delete().eq('id', billId);
    loadAdminBilling();
  };

  // ── Admin: read-only view of client's own invoices ──
  async function loadAdminInvoices() {
    const el = document.getElementById('cdet-invoices-list');
    if (!el) return;
    const { data: invs, error } = await sb.from('client_invoices')
      .select('*').eq('client_id', c.id).order('issue_date', { ascending: false });
    if (error) { el.innerHTML = \`<div style="font-size:12px;color:var(--red)">Error loading invoices: \${esc(error.message)}</div>\`; return; }
    if (!invs || invs.length === 0) {
      el.innerHTML = \`<div style="font-size:12px;color:var(--muted);padding:10px 0">No invoices yet. This client hasn't created any invoices.</div>\`;
      return;
    }
    // Revenue summary
    const totalInvoiced = invs.reduce((s, i) => s + parseFloat(i.total || 0), 0);
    const totalPaid = invs.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.total || 0), 0);
    const totalOutstanding = invs.filter(i => i.status === 'sent' || i.status === 'draft').reduce((s, i) => s + parseFloat(i.total || 0), 0);
    const fmt = v => '$' + parseFloat(v).toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
    const statusColor = s => s === 'paid' ? 'var(--green)' : s === 'void' ? 'var(--muted)' : 'var(--gold)';
    el.innerHTML = \`
      <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:80px;background:var(--bg);border-radius:8px;padding:10px 12px;border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--muted);margin-bottom:3px">Total Invoiced</div>
          <div style="font-size:15px;font-weight:700">\${fmt(totalInvoiced)}</div>
        </div>
        <div style="flex:1;min-width:80px;background:var(--bg);border-radius:8px;padding:10px 12px;border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--muted);margin-bottom:3px">Collected</div>
          <div style="font-size:15px;font-weight:700;color:var(--green)">\${fmt(totalPaid)}</div>
        </div>
        <div style="flex:1;min-width:80px;background:var(--bg);border-radius:8px;padding:10px 12px;border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--muted);margin-bottom:3px">Outstanding</div>
          <div style="font-size:15px;font-weight:700;color:var(--gold)">\${fmt(totalOutstanding)}</div>
        </div>
      </div>
      \${invs.map(inv => \`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600">\${esc(inv.invoice_number || '—')}</div>
          <div style="font-size:12px;color:var(--muted)">\${esc(inv.customer_name || 'No customer')}\${inv.issue_date ? ' · ' + inv.issue_date : ''}</div>
          \${inv.due_date ? \`<div style="font-size:11px;color:var(--muted)">Due: \${esc(inv.due_date)}</div>\` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
          <span style="font-size:13px;font-weight:700">\${fmt(inv.total || 0)}</span>
          <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:rgba(128,128,128,.1);color:\${statusColor(inv.status)}">\${esc(inv.status || 'draft')}</span>
        </div>
      </div>\`).join('')}
    \`;
  }
  loadAdminInvoices();

  window.viewAdminDoc = async function(path, name) {
    const { data, error } = await sb.storage.from('client-documents').createSignedUrl(path, 300);
    if (error) { alert('Could not open file: ' + error.message); return; }
    window.open(data.signedUrl, '_blank');
  };

  window.markDocReviewed = async function(docId) {
    const { data: { user } } = await sb.auth.getUser();
    const { error } = await sb.from('client_documents').update({
      reviewed: true,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id
    }).eq('id', docId);
    if (error) { alert('Error: ' + error.message); return; }
    loadAdminDocs();
  };

  // Wire up "Create Login" button if present (client has no portal access yet)
  const inviteBtn = document.getElementById('cdet-invite-btn');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', async () => {
      var _document$getElementB;
      const email = (_document$getElementB = document.getElementById('cdet-portal-email')) === null || _document$getElementB === void 0 || (_document$getElementB = _document$getElementB.value) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.trim();
      const msg = document.getElementById('cdet-invite-msg');
      if (!email) {
        msg.textContent = 'Enter an email address.';
        msg.style.color = 'var(--red)';
        return;
      }
      inviteBtn.disabled = true;
      inviteBtn.textContent = 'Creating…';
      msg.textContent = '';
      msg.style.color = '';

      // Call the Edge Function which uses the service role to create the user
      // and link it in one atomic operation — no FK issues.
      let result, resp;
      try {
        const {
          data: {
            session
          }
        } = await sb.auth.getSession();
        const token = session === null || session === void 0 ? void 0 : session.access_token;
        if (!token) throw new Error('Not signed in — please reload and sign in again.');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        resp = await fetch("".concat(SUPA_URL, "/functions/v1/create-client-login"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer ".concat(token),
            'apikey': SUPA_ANON
          },
          body: JSON.stringify({
            client_id: c.id,
            email
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);
        result = await resp.json();
      } catch (fetchErr) {
        msg.textContent = 'Error: ' + (fetchErr.name === 'AbortError' ? 'Request timed out. Try again.' : fetchErr.message);
        msg.style.color = 'var(--red)';
        inviteBtn.disabled = false;
        inviteBtn.textContent = 'Create Login';
        return;
      }
      if (!resp.ok || result.error) {
        msg.textContent = 'Error: ' + (result.error || resp.status);
        msg.style.color = 'var(--red)';
        inviteBtn.disabled = false;
        inviteBtn.textContent = 'Create Login';
        return;
      }
      msg.textContent = result.existing ? '✓ Linked to existing account. A password-reset email was sent to ' + email : '✓ Portal access created! A password-setup email was sent to ' + email;
      msg.style.color = 'var(--green)';
      inviteBtn.textContent = 'Done ✓';
    });
  }
  const resendBtn = document.getElementById('cdet-resend-btn');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      const msg = document.getElementById('cdet-resend-msg');
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending…';
      msg.textContent = '';
      msg.style.color = '';
      try {
        const {
          data: {
            session
          }
        } = await sb.auth.getSession();
        const token = session === null || session === void 0 ? void 0 : session.access_token;
        if (!token) throw new Error('Not signed in');
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 15000);
        const resp = await fetch("".concat(SUPA_URL, "/functions/v1/create-client-login"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer ".concat(token),
            'apikey': SUPA_ANON
          },
          body: JSON.stringify({
            client_id: c.id,
            email: c.email,
            resend: true
          }),
          signal: controller.signal
        });
        const result = await resp.json();
        if (!resp.ok || result.error) throw new Error(result.error || resp.status);
        msg.textContent = '✓ Password email sent to ' + c.email;
        msg.style.color = 'var(--green)';
        resendBtn.textContent = 'Sent ✓';
      } catch (e) {
        msg.textContent = 'Error: ' + e.message;
        msg.style.color = 'var(--red)';
        resendBtn.disabled = false;
        resendBtn.textContent = '↺ Resend password email';
      }
    });
  }

  // ── Apply COA Template panel ──
  window.openApplyCOAPanel = function(clientId) {
    const panel = document.getElementById('cdet-coa-panel');
    if (panel) panel.style.display = 'block';
    const applyBtn = document.getElementById('cdet-coa-apply-btn');
    if (!applyBtn) return;
    applyBtn.onclick = async () => {
      const industry = document.getElementById('cdet-coa-industry').value;
      const msgEl = document.getElementById('cdet-coa-msg');
      if (!industry) { msgEl.textContent = 'Please select an industry.'; msgEl.style.color = 'var(--red)'; return; }
      applyBtn.disabled = true; applyBtn.textContent = 'Loading…'; msgEl.textContent = ''; msgEl.style.color = '';
      const { data: templates, error: tmplErr } = await sb.from('coa_templates')
        .select('account_number, name, type, subtype').eq('industry', industry).order('account_number');
      if (tmplErr || !templates?.length) {
        msgEl.textContent = tmplErr ? tmplErr.message : 'No template found for that industry.';
        msgEl.style.color = 'var(--red)';
        applyBtn.disabled = false; applyBtn.textContent = 'Apply Template'; return;
      }
      // Get existing account numbers for this client to avoid duplicates
      const { data: existing } = await sb.from('accounts').select('account_number').eq('client_id', clientId);
      const existingNums = new Set((existing || []).map(a => a.account_number));
      const newRows = templates
        .filter(t => !existingNums.has(t.account_number))
        .map(t => ({ client_id: clientId, account_number: t.account_number, name: t.name, type: t.type, subtype: t.subtype || null, is_active: true }));
      if (!newRows.length) {
        msgEl.textContent = '✓ All accounts from this template already exist for this client.';
        msgEl.style.color = 'var(--green)';
        applyBtn.disabled = false; applyBtn.textContent = 'Apply Template'; return;
      }
      const { error: insErr } = await sb.from('accounts').insert(newRows);
      if (insErr) {
        msgEl.textContent = 'Error: ' + insErr.message; msgEl.style.color = 'var(--red)';
        applyBtn.disabled = false; applyBtn.textContent = 'Apply Template'; return;
      }
      msgEl.textContent = \`✓ Added \${newRows.length} accounts from the \${industry} template.\`;
      msgEl.style.color = 'var(--green)';
      applyBtn.disabled = false; applyBtn.textContent = 'Apply Template';
    };
  };

  // ── EDIT INFO button ──
  const editBtn = document.getElementById('cdet-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // Replace modal body with an editable form
      const modalBody = document.querySelector('#cdet-backdrop .modal-body');
      const modalFooter = document.querySelector('#cdet-backdrop .modal-footer');
      if (!modalBody || !modalFooter) return;

      modalBody.innerHTML = \`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">FULL NAME</label>
            <input id="edit-name" type="text" value="\${esc(c.full_name||'')}" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box">
          </div>
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">EMAIL</label>
            <input id="edit-email" type="email" value="\${esc(c.email||'')}" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box">
            <div style="font-size:11px;color:var(--muted);margin-top:4px">⚠️ Changing the email will also update the client portal login email.</div>
          </div>
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">PHONE</label>
            <input id="edit-phone" type="tel" value="\${esc(c.phone||'')}" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box">
          </div>
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">ADDRESS</label>
            <input id="edit-address" type="text" value="\${esc(c.address||'')}" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box">
          </div>
          <div style="display:flex;gap:12px">
            <div class="form-group" style="margin:0;flex:1">
              <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">EIN / ITIN</label>
              <input id="edit-ein" type="text" value="\${esc(c.ein||'')}" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box">
            </div>
            <div class="form-group" style="margin:0;flex:1">
              <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">STATE</label>
              <input id="edit-state" type="text" value="\${esc(c.state||'')}" maxlength="2" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box;text-transform:uppercase">
            </div>
          </div>
          <div style="display:flex;gap:12px">
            <div class="form-group" style="margin:0;flex:1">
              <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">STATUS</label>
              <select id="edit-status" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px">
                <option value="active" \${c.status==='active'?'selected':''}>Active</option>
                <option value="inactive" \${c.status==='inactive'?'selected':''}>Inactive</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;flex:1">
              <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">CLIENT TYPE</label>
              <select id="edit-client-type" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px">
                <option value="personal" \${(c.client_type||'personal')==='personal'?'selected':''}>👤 Personal</option>
                <option value="business" \${c.client_type==='business'?'selected':''}>🏢 Business</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">SERVICES (controls client portal menu)</label>
            <div style="display:flex;gap:20px;padding:10px 0">
              <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:14px">
                <input type="checkbox" id="edit-svc-tax" style="width:16px;height:16px" \${(c.services||['tax']).includes('tax')?'checked':''}>
                🏛 Tax Returns
              </label>
              <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:14px">
                <input type="checkbox" id="edit-svc-bookkeeping" style="width:16px;height:16px" \${(c.services||[]).includes('bookkeeping')?'checked':''}>
                📋 Bookkeeping
              </label>
              <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:14px">
                <input type="checkbox" id="edit-svc-payroll" style="width:16px;height:16px" \${(c.services||[]).includes('payroll')?'checked':''}>
                💼 Payroll
              </label>
            </div>
          </div>
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">SERVICE PACKAGE</label>
            <select id="edit-package" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px">
              <option value="" \${!c.service_package?'selected':''}>— None selected —</option>
              <option value="starter"    \${c.service_package==='starter'?'selected':''}>Starter — $149/mo</option>
              <option value="essentials" \${c.service_package==='essentials'?'selected':''}>Essentials — $299/mo</option>
              <option value="growth"     \${c.service_package==='growth'?'selected':''}>Growth — $499/mo</option>
              <option value="premium"    \${c.service_package==='premium'?'selected':''}>Premium — $799/mo</option>
            </select>
          </div>
          <div class="form-group" style="margin:0">
            <label style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.05em">NOTES</label>
            <textarea id="edit-notes" rows="3" style="width:100%;padding:8px 10px;border-radius:6px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;box-sizing:border-box;resize:vertical">\${esc(c.notes||'')}</textarea>
          </div>
          <div id="edit-msg" style="font-size:13px;min-height:18px"></div>
        </div>\`;

      modalFooter.innerHTML = \`
        <button class="btn btn-secondary" id="edit-cancel-btn">Cancel</button>
        <button class="btn btn-primary" id="edit-save-btn" style="margin-left:auto">Save Changes</button>\`;

      document.getElementById('edit-cancel-btn').addEventListener('click', () => {
        openClientDetail(c);
      });

      document.getElementById('edit-save-btn').addEventListener('click', async () => {
        const saveBtn = document.getElementById('edit-save-btn');
        const msg = document.getElementById('edit-msg');
        const svcs = [];
        if (document.getElementById('edit-svc-tax').checked)         svcs.push('tax');
        if (document.getElementById('edit-svc-bookkeeping').checked)  svcs.push('bookkeeping');
        if (document.getElementById('edit-svc-payroll').checked)      svcs.push('payroll');
        const updates = {
          full_name: document.getElementById('edit-name').value.trim(),
          email:     document.getElementById('edit-email').value.trim(),
          phone:     document.getElementById('edit-phone').value.trim(),
          address:   document.getElementById('edit-address').value.trim(),
          ein:       document.getElementById('edit-ein').value.trim(),
          state:     document.getElementById('edit-state').value.trim().toUpperCase(),
          status:      document.getElementById('edit-status').value,
          client_type: document.getElementById('edit-client-type').value,
          notes:           document.getElementById('edit-notes').value.trim(),
          services:        svcs.length ? svcs : ['tax'],
          service_package: document.getElementById('edit-package').value || null,
        };
        if (!updates.full_name) { msg.style.color='var(--red)'; msg.textContent='Name is required.'; return; }
        if (!updates.email)     { msg.style.color='var(--red)'; msg.textContent='Email is required.'; return; }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
        msg.textContent = '';

        const { error } = await sb.from('clients').update(updates).eq('id', c.id);
        if (error) {
          msg.style.color = 'var(--red)';
          msg.textContent = error.message;
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Changes';
        } else {
          // Update local state so re-opening shows fresh data
          const idx = STATE.clientRows.findIndex(r => r.id === c.id);
          if (idx !== -1) STATE.clientRows[idx] = { ...STATE.clientRows[idx], ...updates };
          // Re-open modal with updated data
          openClientDetail({ ...c, ...updates });
        }
      });
    });
  }
}
function updateClientDropdown() {
  const sel = document.getElementById('client-select');
  if (sel) sel.value = STATE.selectedClientId || '';
}

// ── CHART OF ACCOUNTS ──────────────────────────────────────
async function renderAccounts(container) {
  container.innerHTML = pageShell('Chart of Accounts', STATE.isStaff ? selectedClientName() : '', "\\n    <button class=\\"btn btn-secondary\\">+ Add Account</button>\\n  ", '<div class="loading-block"><span class="spinner"></span> Loading accounts…</div>');

  // Fetch accounts and journal lines in parallel
  const acctQ = applyClientFilter(sb.from('accounts').select('*').order('account_number'));

  // For lines: filter by client via the journal_entries join
  // If a client is selected (staff view or client portal), filter accordingly
  const cf = clientFilter();
  let linesQ;
  if (cf) {
    // Filter journal_lines by joining journal_entries where client_id matches
    linesQ = sb.from('journal_lines')
      .select('account_id, debit, credit, journal_entries!inner(client_id)')
      .eq('journal_entries.client_id', cf.value);
  } else {
    // Staff with no client selected: get all lines
    linesQ = sb.from('journal_lines')
      .select('account_id, debit, credit');
  }

  const [{ data, error }, { data: lines, error: linesErr }] = await Promise.all([acctQ, linesQ]);

  const main = container.querySelector('#main');
  if (error) {
    main.innerHTML = "<div class=\\"alert alert-red\\">".concat(esc(error.message), "</div>");
    return;
  }

  // Build balance map: account_id → balance
  // Asset/Expense: debit − credit (increases with debits)
  // Liability/Equity/Income: credit − debit (increases with credits)
  const debitNormal = new Set(['asset', 'expense']);
  const totals = {}; // account_id → { dr: number, cr: number }
  for (const l of (lines || [])) {
    if (!totals[l.account_id]) totals[l.account_id] = { dr: 0, cr: 0 };
    totals[l.account_id].dr += parseFloat(l.debit) || 0;
    totals[l.account_id].cr += parseFloat(l.credit) || 0;
  }
  const getBalance = (a) => {
    const t = totals[a.id] || { dr: 0, cr: 0 };
    return debitNormal.has((a.type || '').toLowerCase())
      ? t.dr - t.cr
      : t.cr - t.dr;
  };

  const types = [...new Set(data.map(a => a.type))];
  main.innerHTML = types.map(t => {
    const rows = data.filter(a => a.type === t);
    const typeTotal = rows.reduce((s, a) => s + getBalance(a), 0);
    return "\\n      <div class=\\"card\\" style=\\"margin-bottom:16px\\">\\n        <div class=\\"acct-type\\" style=\\"display:flex;justify-content:space-between;align-items:center\\">\\n          <span>".concat(esc(t), "</span>\\n          <span style=\\"font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--muted)\\">Total: ").concat(fmt(typeTotal), "</span>\\n        </div>\\n        <table>\\n          <thead><tr><th>Number</th><th>Name</th><th>Sub-type</th><th style=\\"text-align:right\\">Balance</th></tr></thead>\\n          <tbody>").concat(rows.map(a => {
      const bal = getBalance(a);
      const hasActivity = totals[a.id];
      return "\\n            <tr>\\n              <td style=\\"font-family:monospace;font-size:12px\\">".concat(esc(a.account_number), "</td>\\n              <td style=\\"font-weight:500\\">").concat(esc(a.name), "</td>\\n              <td style=\\"font-size:12px;color:var(--muted)\\">").concat(esc(a.subtype || ''), "</td>\\n              <td style=\\"text-align:right;font-variant-numeric:tabular-nums;").concat(hasActivity ? 'font-weight:600' : 'color:var(--muted)', "\\">").concat(fmt(bal), "</td>\\n            </tr>\\n          ");
    }).join(''), "</tbody>\\n        </table>\\n      </div>\\n    ");
  }).join('');
}

// ════════════════════════════════════════════════════════════
//  EXPENSES
// ════════════════════════════════════════════════════════════
async function renderExpenses(container) {
  const clientName = STATE.isStaff ? selectedClientName() : (STATE.clientRow?.full_name || '');
  const clientId   = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;

  const addBtn = STATE.isStaff
    ? \`<button class="btn btn-secondary" onclick="openExpenseModal()">+ Add Expense</button>\`
    : \`<button class="btn btn-secondary" onclick="openExpenseModal()">+ Log Expense</button>\`;

  container.innerHTML = pageShell('Expenses', clientName, addBtn,
    '<div class="loading-block"><span class="spinner"></span> Loading expenses…</div>');

  if (!clientId) {
    document.querySelector('#screen-container .card-body, #screen-container main')?.innerHTML
      || (container.innerHTML = pageShell('Expenses', '', '', '<div class="alert alert-red" style="margin:28px">Please select a client first.</div>'));
    return;
  }

  // Load expenses + accounts for this client
  const [{ data: rawExpenses, error }, { data: accounts }] = await Promise.all([
    sb.from('expenses').select('*').eq('client_id', clientId).order('expense_date', { ascending: false }).order('created_at', { ascending: false }),
    sb.from('accounts').select('id,account_number,name,type').eq('client_id', clientId).eq('type','Expense').eq('is_active',true).order('account_number')
  ]);

  // Generate signed URLs for receipts (bucket is private)
  let expenses = rawExpenses;
  if (rawExpenses?.length) {
    expenses = await Promise.all(rawExpenses.map(async e => {
      if (!e.receipt_url) return e;
      // If it's already a full URL (old data), keep it; otherwise generate signed URL from path
      if (e.receipt_url.startsWith('http')) return e;
      const { data } = await sb.storage.from('receipts').createSignedUrl(e.receipt_url, 300);
      return { ...e, receipt_url: data?.signedUrl || null };
    }));
  }

  const main = container.querySelector('[data-main], .card-body') || container;
  const mainEl = container.querySelector('[data-page-main]') || container;

  // Store accounts globally for modal use
  window._expenseAccounts = accounts || [];

  if (error) {
    container.innerHTML = pageShell('Expenses', clientName, addBtn,
      \`<div class="alert alert-red" style="margin:28px">\${esc(error.message)}</div>\`);
    return;
  }

  // ── Summary tiles ──
  const now = new Date();
  const thisMonth = \`\${now.getFullYear()}-\${String(now.getMonth()+1).padStart(2,'0')}\`;
  const thisYear  = String(now.getFullYear());
  const monthTotal = (expenses||[]).filter(e => e.expense_date?.startsWith(thisMonth)).reduce((s,e) => s + parseFloat(e.amount||0), 0);
  const yearTotal  = (expenses||[]).filter(e => e.expense_date?.startsWith(thisYear)).reduce((s,e) => s + parseFloat(e.amount||0), 0);
  const pending    = (expenses||[]).filter(e => e.status === 'pending').length;

  // ── Category totals (top 5 this year) ──
  const catMap = {};
  (expenses||[]).filter(e => e.expense_date?.startsWith(thisYear)).forEach(e => {
    const k = e.category || 'Uncategorized';
    catMap[k] = (catMap[k]||0) + parseFloat(e.amount||0);
  });
  const topCats = Object.entries(catMap).sort((a,b) => b[1]-a[1]).slice(0,5);

  const statusColor = { pending:'var(--gold)', reviewed:'var(--navy)', approved:'var(--green)' };
  const methodIcon  = { cash:'💵', credit_card:'💳', debit_card:'💳', check:'📝', other:'🔁' };

  const listHtml = !expenses?.length
    ? \`<div class="empty" style="padding:40px 20px"><div class="empty-icon">🧾</div>No expenses logged yet.</div>\`
    : \`<table class="data-table">
        <thead><tr>
          <th>Date</th><th>Merchant / Vendor</th><th>Category</th>
          <th>Method</th><th style="text-align:right">Amount</th>
          <th>Status</th><th></th>
        </tr></thead>
        <tbody>
        \${expenses.map(e => \`
          <tr>
            <td style="font-size:12px;white-space:nowrap">\${esc(e.expense_date||'')}</td>
            <td style="font-weight:500">\${esc(e.merchant||'')}\${e.notes ? \`<div style="font-size:11px;color:var(--muted)">\${esc(e.notes)}</div>\` : ''}</td>
            <td style="font-size:12px;color:var(--muted)">\${esc(e.category||'—')}</td>
            <td style="font-size:13px">\${methodIcon[e.payment_method]||''} \${esc(e.payment_method?.replace('_',' ')||'—')}</td>
            <td style="text-align:right;font-variant-numeric:tabular-nums;font-weight:600">$\${parseFloat(e.amount||0).toFixed(2)}</td>
            <td><span style="font-size:11px;font-weight:700;color:\${statusColor[e.status]||'var(--muted)'}">\${esc(e.status||'')}</span>
                \${e.entered_by_role==='client'?'<span style="font-size:10px;color:var(--muted);margin-left:4px">(client)</span>':''}</td>
            <td style="white-space:nowrap">
              \${STATE.isStaff ? \`<button onclick="openExpenseModal(\${JSON.stringify(e).replace(/"/g,'&quot;')})" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px" title="Edit">✏️</button>
              <button onclick="deleteExpense('\${esc(e.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px;color:var(--red)" title="Delete">🗑</button>\`
              : (e.status === 'pending' ? \`<button onclick="openExpenseModal(\${JSON.stringify(e).replace(/"/g,'&quot;')})" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px" title="Edit">✏️</button>\` : '<span style="font-size:11px;color:var(--muted)">locked</span>')}
              \${e.receipt_url ? \`<a href="\${esc(e.receipt_url)}" target="_blank" title="View receipt"><img src="\${esc(e.receipt_url)}" style="width:28px;height:28px;object-fit:cover;border-radius:4px;border:1px solid var(--border);vertical-align:middle;margin-left:4px" onerror="this.replaceWith(Object.assign(document.createElement('a'),{href:'\${esc(e.receipt_url)}',target:'_blank',textContent:'📎',style:'font-size:14px;margin-left:4px'}))"></a>\` : ''}
            </td>
          </tr>\`).join('')}
        </tbody>
      </table>\`;

  container.innerHTML = pageShell('Expenses', clientName, addBtn, \`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">THIS MONTH</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums">$\${monthTotal.toFixed(2)}</div>
      </div></div>
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">YEAR TO DATE</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums">$\${yearTotal.toFixed(2)}</div>
      </div></div>
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">PENDING REVIEW</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;color:\${pending?'var(--gold)':'var(--text)'}">\${pending}</div>
      </div></div>
    </div>

    \${topCats.length ? \`<div class="card" style="margin-bottom:24px"><div class="card-h">Top Categories (\${thisYear})</div><div class="card-body">
      \${topCats.map(([cat,amt]) => {
        const pct = yearTotal ? Math.round(amt/yearTotal*100) : 0;
        return \`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="min-width:140px;font-size:13px;font-weight:500">\${esc(cat)}</div>
          <div style="flex:1;background:var(--border);border-radius:4px;height:8px;overflow:hidden">
            <div style="width:\${pct}%;background:var(--green);height:100%;border-radius:4px"></div>
          </div>
          <div style="font-size:13px;font-variant-numeric:tabular-nums;font-weight:600;min-width:70px;text-align:right">$\${amt.toFixed(2)}</div>
          <div style="font-size:11px;color:var(--muted);min-width:30px">\${pct}%</div>
        </div>\`;
      }).join('')}
    </div></div>\` : ''}

    <div class="card"><div class="card-h" style="display:flex;align-items:center;justify-content:space-between">
      <span>All Expenses</span>
      \${STATE.isStaff && expenses?.some(e=>e.status==='pending') ? \`<button class="btn btn-secondary" style="font-size:11px;padding:4px 10px" onclick="markAllReviewed('\${clientId}')">✓ Mark All Reviewed</button>\` : ''}
    </div><div class="card-body" style="padding:0;overflow-x:auto">\${listHtml}</div></div>
  \`);
}

async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  const { error } = await sb.from('expenses').delete().eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  renderExpenses(document.getElementById('screen-container'));
}

async function markAllReviewed(clientId) {
  const { error } = await sb.from('expenses').update({ status: 'reviewed' }).eq('client_id', clientId).eq('status','pending');
  if (error) { alert('Error: ' + error.message); return; }
  renderExpenses(document.getElementById('screen-container'));
}

function openExpenseModal(expense) {
  const clientId = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;
  if (!clientId) { alert('Please select a client first.'); return; }

  const isEdit  = !!expense?.id;
  const accounts = window._expenseAccounts || [];
  const today    = new Date().toISOString().slice(0,10);

  // Build account options
  const acctOptions = accounts.map(a =>
    \`<option value="\${esc(a.id)}" data-name="\${esc(a.name)}" \${expense?.account_id===a.id?'selected':''}>\${esc(a.account_number)} — \${esc(a.name)}</option>\`
  ).join('');

  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'exp-modal-backdrop';
  bd.innerHTML = \`
    <div class="modal" role="dialog" style="max-width:520px">
      <div class="modal-header">
        <h3>\${isEdit ? '✏️ Edit Expense' : '🧾 Log Expense'}</h3>
        <button class="modal-close" onclick="closeModal('exp-modal-backdrop')" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="exp-date">Date *</label>
            <input id="exp-date" type="date" value="\${esc(expense?.expense_date||today)}">
          </div>
          <div class="form-group">
            <label for="exp-amount">Amount ($) *</label>
            <input id="exp-amount" type="number" min="0" step="0.01" placeholder="0.00" value="\${expense?.amount||''}">
          </div>
        </div>
        <div class="form-group">
          <label for="exp-merchant">Merchant / Vendor *</label>
          <input id="exp-merchant" type="text" placeholder="e.g. Office Depot, Shell, Amazon" value="\${esc(expense?.merchant||'')}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="exp-account">Category (COA)</label>
            <select id="exp-account">
              <option value="">— Select account —</option>
              \${acctOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="exp-category">Category Label</label>
            <input id="exp-category" type="text" placeholder="Auto-filled from COA, or type freely" value="\${esc(expense?.category||'')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="exp-method">Payment Method</label>
            <select id="exp-method">
              <option value="">— Select —</option>
              <option value="credit_card"  \${expense?.payment_method==='credit_card'?'selected':''}>💳 Credit Card</option>
              <option value="debit_card"   \${expense?.payment_method==='debit_card'?'selected':''}>💳 Debit Card</option>
              <option value="cash"         \${expense?.payment_method==='cash'?'selected':''}>💵 Cash</option>
              <option value="check"        \${expense?.payment_method==='check'?'selected':''}>📝 Check</option>
              <option value="other"        \${expense?.payment_method==='other'?'selected':''}>🔁 Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="exp-ref">Reference # <span style="font-weight:400;color:var(--muted)">(check #, last-4)</span></label>
            <input id="exp-ref" type="text" placeholder="Optional" value="\${esc(expense?.reference||'')}">
          </div>
        </div>
        <div class="form-group">
          <label for="exp-notes">Notes</label>
          <textarea id="exp-notes" placeholder="Purpose, project name, etc." style="height:60px">\${esc(expense?.notes||'')}</textarea>
        </div>
        <div class="form-group">
          <label>Receipt Photo / File <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
          \${expense?.receipt_url ? \`<div style="margin-bottom:8px;display:flex;align-items:center;gap:10px">
            <img src="\${esc(expense.receipt_url)}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid var(--border)" onerror="this.style.display='none'">
            <div>
              <a href="\${esc(expense.receipt_url)}" target="_blank" style="font-size:12px">View current receipt</a>
              <div style="font-size:11px;color:var(--muted)">Upload a new file to replace it</div>
            </div>
          </div>\` : ''}
          <label for="exp-receipt-file" style="display:flex;align-items:center;gap:8px;padding:10px 14px;border:2px dashed var(--border);border-radius:8px;cursor:pointer;background:var(--bg);transition:border-color .2s" id="exp-receipt-label">
            <span style="font-size:20px">📸</span>
            <span id="exp-receipt-name" style="font-size:13px;color:var(--muted)">Tap to take a photo or choose a file…</span>
          </label>
          <input id="exp-receipt-file" type="file" accept="image/*,application/pdf" capture="environment" style="display:none">
        </div>
        \${STATE.isStaff ? \`<div class="form-group">
          <label for="exp-status">Status</label>
          <select id="exp-status">
            <option value="pending"  \${(expense?.status||'pending')==='pending'?'selected':''}>⏳ Pending</option>
            <option value="reviewed" \${expense?.status==='reviewed'?'selected':''}>👁 Reviewed</option>
            <option value="approved" \${expense?.status==='approved'?'selected':''}>✅ Approved</option>
          </select>
        </div>\` : ''}
        <div class="modal-error" id="exp-error" style="margin-top:8px"></div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('exp-modal-backdrop')" style="background:var(--surface);color:var(--text);border:1.5px solid var(--border)">Cancel</button>
        <button class="btn btn-primary" id="exp-save-btn" onclick="saveExpense('\${clientId}',\${isEdit?\`'\${esc(expense.id)}'\`:'null'})">
          \${isEdit ? '💾 Save Changes' : '🧾 Save Expense'}
        </button>
      </div>
    </div>\`;

  // Auto-fill category label when COA account is selected
  bd.querySelector('#exp-account').addEventListener('change', function() {
    const opt = this.options[this.selectedIndex];
    const name = opt?.dataset?.name || '';
    if (name) document.getElementById('exp-category').value = name;
  });

  document.body.appendChild(bd);

  // Receipt file preview
  document.getElementById('exp-receipt-file').addEventListener('change', function() {
    const file = this.files[0];
    const nameEl = document.getElementById('exp-receipt-name');
    const label  = document.getElementById('exp-receipt-label');
    if (!file) return;
    nameEl.textContent = file.name;
    nameEl.style.color = 'var(--green)';
    label.style.borderColor = 'var(--green)';
    // Show image preview if it's an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        let prev = document.getElementById('exp-receipt-preview');
        if (!prev) {
          prev = document.createElement('img');
          prev.id = 'exp-receipt-preview';
          prev.style.cssText = 'width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid var(--border);margin-top:8px;display:block';
          label.after(prev);
        }
        prev.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  bd.addEventListener('click', e => { if (e.target === bd) closeModal('exp-modal-backdrop'); });
  document.getElementById('exp-date').focus();
}

async function saveExpense(clientId, expenseId) {
  const errEl  = document.getElementById('exp-error');
  const btn    = document.getElementById('exp-save-btn');
  errEl.textContent = '';

  const date     = document.getElementById('exp-date').value;
  const merchant = document.getElementById('exp-merchant').value.trim();
  const amount   = parseFloat(document.getElementById('exp-amount').value);
  const accountId = document.getElementById('exp-account').value || null;
  const category  = document.getElementById('exp-category').value.trim() || null;
  const method    = document.getElementById('exp-method').value || null;
  const ref       = document.getElementById('exp-ref').value.trim() || null;
  const notes     = document.getElementById('exp-notes').value.trim() || null;
  const status    = document.getElementById('exp-status')?.value || 'pending';

  if (!date)     { errEl.textContent = 'Date is required.'; return; }
  if (!merchant) { errEl.textContent = 'Merchant name is required.'; return; }
  if (isNaN(amount) || amount < 0) { errEl.textContent = 'Enter a valid amount.'; return; }

  btn.disabled = true; btn.textContent = 'Saving…';

  // Upload receipt if one was selected
  let receiptUrl = null;
  const receiptFile = document.getElementById('exp-receipt-file')?.files?.[0];
  if (receiptFile) {
    btn.textContent = 'Uploading receipt…';
    const { data: { user } } = await sb.auth.getUser();
    const ext  = receiptFile.name.split('.').pop().toLowerCase();
    const path = \`\${user.id}/expenses/\${Date.now()}-\${Math.random().toString(36).slice(2)}.\${ext}\`;
    const { error: upErr } = await sb.storage.from('receipts').upload(path, receiptFile, { upsert: false });
    if (upErr) {
      errEl.textContent = 'Receipt upload failed: ' + upErr.message;
      btn.disabled = false; btn.textContent = expenseId ? '💾 Save Changes' : '🧾 Save Expense';
      return;
    }
    const { data: urlData } = sb.storage.from('receipts').getPublicUrl(path);
    // Use signed URL approach — store the path and generate signed URLs on view
    receiptUrl = path; // store path; we'll generate signed URL for display
    // Actually store the full public URL for simplicity (bucket is private so we store path)
    receiptUrl = path;
    btn.textContent = 'Saving…';
  }

  const payload = {
    client_id: clientId, expense_date: date, merchant, amount,
    account_id: accountId, category, payment_method: method,
    reference: ref, notes, status,
    entered_by_role: STATE.isStaff ? 'staff' : 'client'
  };
  if (receiptUrl) payload.receipt_url = receiptUrl;

  let error;
  if (expenseId) {
    ({ error } = await sb.from('expenses').update(payload).eq('id', expenseId));
  } else {
    const { data: { user } } = await sb.auth.getUser();
    payload.entered_by = user?.id;
    ({ error } = await sb.from('expenses').insert(payload));
  }

  if (error) {
    errEl.textContent = 'Error: ' + error.message;
    btn.disabled = false; btn.textContent = expenseId ? '💾 Save Changes' : '🧾 Save Expense';
    return;
  }

  closeModal('exp-modal-backdrop');
  renderExpenses(document.getElementById('screen-container'));
}

// ════════════════════════════════════════════════════════════
//  CLIENT INVOICES SCREEN
// ════════════════════════════════════════════════════════════
async function renderClientInvoices(container) {
  const clientId   = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;
  const clientName = STATE.isStaff ? selectedClientName() : (STATE.clientRow?.full_name || '');

  const addBtn = \`<button class="btn btn-secondary" onclick="openClientNewInvoiceModal()">+ New Invoice</button>\`;

  container.innerHTML = pageShell('My Invoices', clientName, addBtn,
    '<div class="loading-block"><span class="spinner"></span> Loading invoices…</div>');

  if (!clientId) {
    container.innerHTML = pageShell('My Invoices', '', '', '<div class="alert alert-red" style="margin:28px">Please select a client first.</div>');
    return;
  }

  const { data: invs, error } = await sb
    .from('client_invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = pageShell('My Invoices', clientName, addBtn,
      \`<div class="alert alert-red" style="margin:28px">\${esc(error.message)}</div>\`);
    return;
  }

  // ── Summary tiles ──
  const total      = (invs||[]).reduce((s,i) => s + parseFloat(i.total||0), 0);
  const paid       = (invs||[]).filter(i => i.status === 'paid').reduce((s,i) => s + parseFloat(i.total||0), 0);
  const outstanding= (invs||[]).filter(i => i.status !== 'paid').reduce((s,i) => s + parseFloat(i.total||0), 0);
  const overdueCount = (invs||[]).filter(i => i.status !== 'paid' && i.due_date && new Date(i.due_date) < new Date()).length;

  const statusColor = { paid:'var(--green)', sent:'var(--navy)', draft:'var(--muted)', overdue:'var(--red)' };
  const statusIcon  = { paid:'✅', sent:'📤', draft:'📝', overdue:'⚠️' };

  const getStatus = inv => {
    if (inv.status === 'paid') return 'paid';
    if (inv.due_date && new Date(inv.due_date) < new Date()) return 'overdue';
    return inv.status || 'draft';
  };

  const listHtml = !invs?.length
    ? \`<div class="empty" style="padding:40px 20px"><div class="empty-icon">📄</div>No invoices yet. Create your first one above.</div>\`
    : \`<table class="data-table">
        <thead><tr>
          <th>Invoice #</th><th>Customer</th><th>Date</th><th>Due Date</th>
          <th style="text-align:right">Total</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>
        \${invs.map(inv => {
          const st = getStatus(inv);
          return \`<tr>
            <td style="font-weight:600;font-family:monospace;font-size:13px">\${esc(inv.invoice_number||'—')}</td>
            <td style="font-weight:500">\${esc(inv.customer_name||'—')}</td>
            <td style="font-size:12px;white-space:nowrap">\${esc(inv.invoice_date||'')}</td>
            <td style="font-size:12px;white-space:nowrap;color:\${st==='overdue'?'var(--red)':'inherit'}">\${esc(inv.due_date||'—')}</td>
            <td style="text-align:right;font-variant-numeric:tabular-nums;font-weight:600">$\${parseFloat(inv.total||0).toFixed(2)}</td>
            <td><span style="font-size:11px;font-weight:700;color:\${statusColor[st]||'var(--muted)'};">\${statusIcon[st]||''} \${st}</span></td>
            <td style="white-space:nowrap">
              <button onclick="openClientEditInvoiceModal('\${esc(inv.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px" title="Edit">✏️</button>
              \${inv.status !== 'paid' ? \`<button onclick="markClientInvoicePaid('\${esc(inv.id)}')" style="background:none;border:none;cursor:pointer;font-size:12px;padding:2px 6px;color:var(--green)" title="Mark paid">✅</button>\` : ''}
              <button onclick="deleteClientInvoiceFromScreen('\${esc(inv.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px;color:var(--red)" title="Delete">🗑</button>
            </td>
          </tr>\`;
        }).join('')}
        </tbody>
      </table>\`;

  container.innerHTML = pageShell('My Invoices', clientName, addBtn, \`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">TOTAL INVOICED</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums">$\${total.toFixed(2)}</div>
      </div></div>
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">COLLECTED</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;color:var(--green);font-variant-numeric:tabular-nums">$\${paid.toFixed(2)}</div>
      </div></div>
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">OUTSTANDING\${overdueCount ? \` <span style="color:var(--red)">(\${overdueCount} overdue)</span>\` : ''}</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;color:\${outstanding>0?'var(--gold)':'var(--text)'};font-variant-numeric:tabular-nums">$\${outstanding.toFixed(2)}</div>
      </div></div>
    </div>

    <div class="card"><div class="card-h">All Invoices</div>
      <div class="card-body" style="padding:0;overflow-x:auto">\${listHtml}</div>
    </div>

    <!-- Invoice modal (reused) -->
    <div id="ci-modal" hidden style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px">
      <div style="background:var(--surface);border-radius:12px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border)">
          <div style="font-weight:700;font-size:16px" id="ci-modal-title">New Invoice</div>
          <button onclick="document.getElementById('ci-modal').hidden=true" style="font-size:20px;color:var(--muted);background:none;border:none;cursor:pointer">✕</button>
        </div>
        <div style="padding:24px" id="ci-modal-body"></div>
      </div>
    </div>
  \`);
}

window.openClientNewInvoiceModal = async function() {
  const clientId = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;
  const modal = document.getElementById('ci-modal');
  document.getElementById('ci-modal-title').textContent = 'New Invoice';
  // Auto-generate invoice number
  const { data } = await sb.from('client_invoices').select('invoice_number').eq('client_id', clientId).order('created_at', { ascending: false }).limit(1);
  let nextNum = 'INV-001';
  if (data?.[0]?.invoice_number) {
    const m = data[0].invoice_number.match(/(\\d+)$/);
    if (m) nextNum = data[0].invoice_number.replace(/\\d+$/, String(parseInt(m[1])+1).padStart(3,'0'));
  }
  document.getElementById('ci-modal-body').innerHTML = clientInvoiceFormHtml(null, nextNum);
  modal.hidden = false;
};

window.openClientEditInvoiceModal = async function(id) {
  const { data: inv } = await sb.from('client_invoices').select('*').eq('id', id).single();
  document.getElementById('ci-modal-title').textContent = 'Edit Invoice';
  document.getElementById('ci-modal-body').innerHTML = clientInvoiceFormHtml(inv);
  document.getElementById('ci-modal').hidden = false;
};

window.markClientInvoicePaid = async function(id) {
  if (!confirm('Mark this invoice as paid?')) return;
  await sb.from('client_invoices').update({ status: 'paid' }).eq('id', id);
  renderClientInvoices(document.getElementById('screen-container'));
};

window.deleteClientInvoiceFromScreen = async function(id) {
  if (!confirm('Delete this invoice? This cannot be undone.')) return;
  await sb.from('client_invoices').delete().eq('id', id);
  renderClientInvoices(document.getElementById('screen-container'));
};

function clientInvoiceFormHtml(inv, autoNum) {
  const items = inv?.items || [{ description: '', qty: 1, rate: '', amount: '' }];
  return \`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Invoice #</label>
        <input id="ci-number" class="input" value="\${esc(inv?.invoice_number || autoNum || '')}" placeholder="INV-001"></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Status</label>
        <select id="ci-status" class="input">
          <option value="draft"   \${(inv?.status||'draft')==='draft'?'selected':''}>📝 Draft</option>
          <option value="sent"    \${inv?.status==='sent'?'selected':''}>📤 Sent</option>
          <option value="paid"    \${inv?.status==='paid'?'selected':''}>✅ Paid</option>
        </select></div>
    </div>
    <div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Customer / Bill To *</label>
      <input id="ci-customer" class="input" value="\${esc(inv?.customer_name||'')}" placeholder="Customer or company name"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Invoice Date</label>
        <input id="ci-date" class="input" type="date" value="\${esc(inv?.invoice_date || new Date().toISOString().slice(0,10))}"></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Due Date</label>
        <input id="ci-due" class="input" type="date" value="\${esc(inv?.due_date||'')}"></div>
    </div>
    <div style="font-weight:600;font-size:13px;margin-bottom:8px">Line Items</div>
    <div id="ci-items">
      \${items.map((it,i) => \`
        <div class="ci-item-row" style="display:grid;grid-template-columns:1fr 60px 90px 90px 28px;gap:6px;margin-bottom:6px;align-items:center">
          <input class="input ci-desc" placeholder="Description" value="\${esc(it.description||'')}" style="font-size:12px">
          <input class="input ci-qty"  type="number" min="0" step="0.01" placeholder="Qty"  value="\${it.qty||1}" oninput="recalcCIInvoice()" style="font-size:12px;text-align:center">
          <input class="input ci-rate" type="number" min="0" step="0.01" placeholder="Rate" value="\${it.rate||''}" oninput="recalcCIInvoice()" style="font-size:12px;text-align:right">
          <input class="input ci-amt"  type="number" readonly placeholder="Amt"  value="\${it.amount||''}" style="font-size:12px;text-align:right;background:var(--bg);color:var(--muted)">
          <button type="button" onclick="this.closest('.ci-item-row').remove();recalcCIInvoice()" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer">✕</button>
        </div>\`).join('')}
    </div>
    <button type="button" onclick="addCIItem()" class="btn btn-secondary" style="font-size:12px;padding:4px 12px;margin-bottom:16px">+ Add Item</button>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Tax Rate (%)</label>
        <input id="ci-tax" class="input" type="number" min="0" max="100" step="0.1" value="\${inv?.tax_rate||0}" oninput="recalcCIInvoice()"></div>
      <div style="text-align:right;padding-top:20px">
        <div style="font-size:12px;color:var(--muted)">Subtotal: <span id="ci-subtotal">$0.00</span></div>
        <div style="font-size:12px;color:var(--muted)">Tax: <span id="ci-tax-amt">$0.00</span></div>
        <div style="font-size:16px;font-weight:700;margin-top:4px">Total: <span id="ci-total">$0.00</span></div>
      </div>
    </div>
    <div style="margin-bottom:16px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Notes / Terms</label>
      <textarea id="ci-notes" class="input" style="height:60px;resize:none" placeholder="Payment terms, thank-you note, etc.">\${esc(inv?.notes||'')}</textarea></div>
    <div id="ci-err" style="color:var(--red);font-size:13px;margin-bottom:8px"></div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="document.getElementById('ci-modal').hidden=true">Cancel</button>
      <button class="btn btn-primary" onclick="saveCIInvoice('\${esc(inv?.id||'')}')">💾 Save Invoice</button>
    </div>
    <script>setTimeout(recalcCIInvoice,50);<\\/script>\`;
}

window.addCIItem = function() {
  const row = document.createElement('div');
  row.className = 'ci-item-row';
  row.style.cssText = 'display:grid;grid-template-columns:1fr 60px 90px 90px 28px;gap:6px;margin-bottom:6px;align-items:center';
  row.innerHTML = \`<input class="input ci-desc" placeholder="Description" style="font-size:12px">
    <input class="input ci-qty"  type="number" min="0" step="0.01" value="1" oninput="recalcCIInvoice()" style="font-size:12px;text-align:center">
    <input class="input ci-rate" type="number" min="0" step="0.01" placeholder="Rate" oninput="recalcCIInvoice()" style="font-size:12px;text-align:right">
    <input class="input ci-amt"  type="number" readonly style="font-size:12px;text-align:right;background:var(--bg);color:var(--muted)">
    <button type="button" onclick="this.closest('.ci-item-row').remove();recalcCIInvoice()" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer">✕</button>\`;
  document.getElementById('ci-items').appendChild(row);
};

window.recalcCIInvoice = function() {
  let subtotal = 0;
  document.querySelectorAll('.ci-item-row').forEach(row => {
    const qty  = parseFloat(row.querySelector('.ci-qty')?.value) || 0;
    const rate = parseFloat(row.querySelector('.ci-rate')?.value) || 0;
    const amt  = qty * rate;
    const amtEl = row.querySelector('.ci-amt');
    if (amtEl) amtEl.value = amt.toFixed(2);
    subtotal += amt;
  });
  const taxRate = parseFloat(document.getElementById('ci-tax')?.value) || 0;
  const taxAmt  = subtotal * taxRate / 100;
  const total   = subtotal + taxAmt;
  const s = document.getElementById('ci-subtotal'); if (s) s.textContent = '$'+subtotal.toFixed(2);
  const t = document.getElementById('ci-tax-amt');  if (t) t.textContent = '$'+taxAmt.toFixed(2);
  const tt= document.getElementById('ci-total');    if (tt) tt.textContent = '$'+total.toFixed(2);
};

window.saveCIInvoice = async function(existingId) {
  const errEl = document.getElementById('ci-err');
  const customer = document.getElementById('ci-customer')?.value.trim();
  if (!customer) { errEl.textContent = 'Customer name is required.'; return; }

  const clientId = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;
  const items = Array.from(document.querySelectorAll('.ci-item-row')).map(row => ({
    description: row.querySelector('.ci-desc')?.value.trim() || '',
    qty:  parseFloat(row.querySelector('.ci-qty')?.value)  || 0,
    rate: parseFloat(row.querySelector('.ci-rate')?.value) || 0,
    amount: parseFloat(row.querySelector('.ci-amt')?.value) || 0
  }));

  const taxRate  = parseFloat(document.getElementById('ci-tax')?.value) || 0;
  const subtotal = items.reduce((s,i) => s + i.amount, 0);
  const total    = subtotal + subtotal * taxRate / 100;

  const payload = {
    client_id: clientId,
    invoice_number: document.getElementById('ci-number')?.value.trim(),
    customer_name:  customer,
    invoice_date:   document.getElementById('ci-date')?.value || null,
    due_date:       document.getElementById('ci-due')?.value  || null,
    status:         document.getElementById('ci-status')?.value || 'draft',
    tax_rate:       taxRate,
    subtotal,
    total,
    notes:          document.getElementById('ci-notes')?.value.trim() || null,
    items
  };

  const { error } = existingId
    ? await sb.from('client_invoices').update(payload).eq('id', existingId)
    : await sb.from('client_invoices').insert(payload);

  if (error) { errEl.textContent = 'Error: ' + error.message; return; }
  document.getElementById('ci-modal').hidden = true;
  renderClientInvoices(document.getElementById('screen-container'));
};

// ════════════════════════════════════════════════════════════
//  INCOME / REVENUE SCREEN
// ════════════════════════════════════════════════════════════
const INCOME_CATEGORIES = [
  'Service Revenue','Product Sales','Consulting','Rental Income',
  'Commission','Interest Income','Other Income'
];

async function renderIncome(container) {
  const clientId   = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;
  const clientName = STATE.isStaff ? selectedClientName() : (STATE.clientRow?.full_name || '');
  const addBtn = \`<button class="btn btn-secondary" onclick="openIncomeModal()">+ Add Income</button>\`;

  container.innerHTML = pageShell('Income', clientName, addBtn,
    '<div class="loading-block"><span class="spinner"></span> Loading income…</div>');

  if (!clientId) {
    container.innerHTML = pageShell('Income','',addBtn,'<div class="alert alert-red" style="margin:28px">Please select a client first.</div>');
    return;
  }

  // Load COA for account dropdown
  const { data: accounts } = await sb.from('chart_of_accounts').select('id,account_name,account_type')
    .eq('client_id', clientId).eq('is_active', true).order('account_name');

  const { data: rawIncome, error } = await sb.from('income').select('*')
    .eq('client_id', clientId).order('income_date', { ascending: false });

  if (error) {
    container.innerHTML = pageShell('Income', clientName, addBtn,
      \`<div class="alert alert-red" style="margin:28px">\${esc(error.message)}</div>\`);
    return;
  }

  // Generate signed URLs for receipts
  let incomeRows = rawIncome || [];
  if (incomeRows.length) {
    incomeRows = await Promise.all(incomeRows.map(async r => {
      if (!r.receipt_url || r.receipt_url.startsWith('http')) return r;
      const { data } = await sb.storage.from('receipts').createSignedUrl(r.receipt_url, 300);
      return { ...r, receipt_url: data?.signedUrl || null };
    }));
  }

  // Summary
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const total = incomeRows.reduce((s,r) => s + parseFloat(r.amount||0), 0);
  const monthTotal = incomeRows.filter(r => {
    const d = new Date(r.income_date);
    return d.getFullYear()===thisYear && d.getMonth()===thisMonth;
  }).reduce((s,r) => s + parseFloat(r.amount||0), 0);
  const pending = incomeRows.filter(r => r.status==='pending').length;

  const statusColor = { pending:'var(--gold)', reviewed:'var(--navy)', approved:'var(--green)' };

  const listHtml = !incomeRows.length
    ? \`<div class="empty" style="padding:40px 20px"><div class="empty-icon">💰</div>No income recorded yet. Add your first entry above.</div>\`
    : \`<table class="data-table">
        <thead><tr>
          <th>Date</th><th>Source / Customer</th><th>Category</th>
          <th style="text-align:right">Amount</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>
        \${incomeRows.map(r => \`<tr>
          <td style="white-space:nowrap;font-size:12px">\${esc(r.income_date||'')}</td>
          <td style="font-weight:500">\${esc(r.source||'')}</td>
          <td style="font-size:12px;color:var(--muted)">\${esc(r.category||'')}</td>
          <td style="text-align:right;font-weight:600;font-variant-numeric:tabular-nums;color:var(--green)">$\${parseFloat(r.amount||0).toFixed(2)}</td>
          <td><span style="font-size:11px;font-weight:700;color:\${statusColor[r.status]||'var(--muted)'}">● \${r.status}</span></td>
          <td style="white-space:nowrap">
            \${STATE.isStaff ? \`
              <button onclick="openIncomeModal('\${esc(r.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px" title="Edit">✏️</button>
              <button onclick="deleteIncome('\${esc(r.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px;color:var(--red)" title="Delete">🗑</button>\`
            : (r.status==='pending'
              ? \`<button onclick="openIncomeModal('\${esc(r.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px" title="Edit">✏️</button>\`
              : \`<span style="font-size:11px;color:var(--muted)">locked</span>\`)}
            \${r.receipt_url ? \`<a href="\${esc(r.receipt_url)}" target="_blank"><img src="\${esc(r.receipt_url)}" style="width:28px;height:28px;object-fit:cover;border-radius:4px;vertical-align:middle;margin-left:4px;border:1px solid var(--border)" onerror="this.outerHTML='<a href=\\\\'\${esc(r.receipt_url)}\\\\' target=\\\\'_blank\\\\' style=\\\\'font-size:16px;text-decoration:none\\\\'>📎</a>'"></a>\` : ''}
          </td>
        </tr>\`).join('')}
        </tbody>
      </table>\`;

  // Store accounts for modal
  window._incomeAccounts = accounts || [];
  window._incomeClientId = clientId;

  container.innerHTML = pageShell('Income', clientName, addBtn, \`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">TOTAL INCOME (ALL TIME)</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;color:var(--green);font-variant-numeric:tabular-nums">$\${total.toFixed(2)}</div>
      </div></div>
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">THIS MONTH</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums">$\${monthTotal.toFixed(2)}</div>
      </div></div>
      <div class="card"><div class="card-body" style="padding:16px">
        <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em">PENDING REVIEW</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;color:\${pending>0?'var(--gold)':'var(--text)'}">\${pending}</div>
      </div></div>
    </div>
    <div class="card"><div class="card-h">All Income Entries</div>
      <div class="card-body" style="padding:0;overflow-x:auto">\${listHtml}</div>
    </div>

    <!-- Income modal -->
    <div id="income-modal" hidden style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px">
      <div style="background:var(--surface);border-radius:12px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border)">
          <div style="font-weight:700;font-size:16px" id="income-modal-title">Add Income</div>
          <button onclick="document.getElementById('income-modal').hidden=true" style="font-size:20px;color:var(--muted);background:none;border:none;cursor:pointer">✕</button>
        </div>
        <div style="padding:24px" id="income-modal-body"></div>
      </div>
    </div>
  \`);
}

window.openIncomeModal = async function(id) {
  let row = null;
  if (id) {
    const { data } = await sb.from('income').select('*').eq('id', id).single();
    row = data;
  }
  document.getElementById('income-modal-title').textContent = id ? 'Edit Income' : 'Add Income';
  document.getElementById('income-modal-body').innerHTML = incomeFormHtml(row);
  document.getElementById('income-modal').hidden = false;
};

function incomeFormHtml(r) {
  const accts = (window._incomeAccounts||[]).filter(a => ['Revenue','Asset'].includes(a.account_type));
  return \`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Date *</label>
        <input id="inc-date" class="input" type="date" value="\${esc(r?.income_date || new Date().toISOString().slice(0,10))}"></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Amount *</label>
        <input id="inc-amount" class="input" type="number" min="0.01" step="0.01" placeholder="0.00" value="\${r?.amount||''}"></div>
    </div>
    <div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Source / Customer *</label>
      <input id="inc-source" class="input" value="\${esc(r?.source||'')}" placeholder="Who paid you?"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Category *</label>
        <select id="inc-category" class="input">
          \${INCOME_CATEGORIES.map(c=>\`<option value="\${c}" \${(r?.category||'')==c?'selected':''}>\${c}</option>\`).join('')}
        </select></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Account</label>
        <select id="inc-account" class="input">
          <option value="">— None —</option>
          \${accts.map(a=>\`<option value="\${a.id}" \${r?.account_id===a.id?'selected':''}>\${esc(a.account_name)}</option>\`).join('')}
        </select></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Payment Method</label>
        <select id="inc-payment" class="input">
          <option value="">— Select —</option>
          \${['Cash','Check','Credit Card','Debit Card','Bank Transfer','Zelle','Venmo','PayPal','Other']
            .map(m=>\`<option value="\${m}" \${(r?.payment_method||'')==m?'selected':''}>\${m}</option>\`).join('')}
        </select></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Reference #</label>
        <input id="inc-ref" class="input" value="\${esc(r?.reference||'')}" placeholder="Invoice #, check #…"></div>
    </div>
    \${STATE.isStaff ? \`<div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Status</label>
      <select id="inc-status" class="input">
        <option value="pending"  \${(r?.status||'pending')==='pending'?'selected':''}>⏳ Pending</option>
        <option value="reviewed" \${r?.status==='reviewed'?'selected':''}>🔍 Reviewed</option>
        <option value="approved" \${r?.status==='approved'?'selected':''}>✅ Approved</option>
      </select></div>\` : ''}
    <div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Notes</label>
      <textarea id="inc-notes" class="input" style="height:60px;resize:none" placeholder="Additional details…">\${esc(r?.notes||'')}</textarea></div>
    <div style="margin-bottom:16px">
      <label for="inc-receipt-file" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border:2px dashed var(--border);border-radius:8px;cursor:pointer;font-size:13px;color:var(--muted)" id="inc-receipt-label">
        <span>📸</span>
        <span id="inc-receipt-name">\${r?.receipt_url ? '📎 Receipt on file (upload new to replace)' : 'Tap to attach a photo or file…'}</span>
      </label>
      <input id="inc-receipt-file" type="file" accept="image/*,application/pdf" capture="environment" style="display:none"
        onchange="document.getElementById('inc-receipt-name').textContent = this.files[0]?.name || 'No file chosen'">
    </div>
    <div id="inc-err" style="color:var(--red);font-size:13px;margin-bottom:8px"></div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="document.getElementById('income-modal').hidden=true">Cancel</button>
      <button class="btn btn-primary" onclick="saveIncome('\${esc(r?.id||'')}')">💾 Save</button>
    </div>\`;
}

window.saveIncome = async function(existingId) {
  const errEl = document.getElementById('inc-err');
  const date   = document.getElementById('inc-date')?.value;
  const amount = parseFloat(document.getElementById('inc-amount')?.value);
  const source = document.getElementById('inc-source')?.value.trim();
  if (!date)   { errEl.textContent = 'Date is required.'; return; }
  if (!amount || amount <= 0) { errEl.textContent = 'Amount must be greater than 0.'; return; }
  if (!source) { errEl.textContent = 'Source / Customer is required.'; return; }

  const clientId = window._incomeClientId;
  const user = (await sb.auth.getUser()).data.user;

  // Upload receipt if chosen
  let receiptUrl = existingId
    ? (await sb.from('income').select('receipt_url').eq('id',existingId).single()).data?.receipt_url || null
    : null;
  const receiptFile = document.getElementById('inc-receipt-file')?.files?.[0];
  if (receiptFile) {
    const ext  = receiptFile.name.split('.').pop().toLowerCase();
    const path = \`\${user.id}/income/\${Date.now()}-\${Math.random().toString(36).slice(2)}.\${ext}\`;
    const { error: upErr } = await sb.storage.from('receipts').upload(path, receiptFile, { upsert: false });
    if (upErr) { errEl.textContent = 'Receipt upload failed: ' + upErr.message; return; }
    receiptUrl = path;
  }

  const payload = {
    client_id:      clientId,
    income_date:    date,
    source,
    category:       document.getElementById('inc-category')?.value,
    account_id:     document.getElementById('inc-account')?.value || null,
    amount,
    payment_method: document.getElementById('inc-payment')?.value || null,
    reference:      document.getElementById('inc-ref')?.value.trim() || null,
    notes:          document.getElementById('inc-notes')?.value.trim() || null,
    receipt_url:    receiptUrl,
    status:         STATE.isStaff ? (document.getElementById('inc-status')?.value || 'pending') : (existingId ? undefined : 'pending'),
    entered_by_role: STATE.isStaff ? 'staff' : 'client',
    entered_by:     user.id,
    updated_at:     new Date().toISOString()
  };
  if (!existingId) delete payload.status; // let DB default apply for new client entries

  const { error } = existingId
    ? await sb.from('income').update(payload).eq('id', existingId)
    : await sb.from('income').insert(payload);

  if (error) { errEl.textContent = 'Error: ' + error.message; return; }
  document.getElementById('income-modal').hidden = true;
  renderIncome(document.getElementById('screen-container'));
};

window.deleteIncome = async function(id) {
  if (!confirm('Delete this income entry?')) return;
  await sb.from('income').delete().eq('id', id);
  renderIncome(document.getElementById('screen-container'));
};

// ════════════════════════════════════════════════════════════
//  CHART OF ACCOUNTS SCREEN
// ════════════════════════════════════════════════════════════
const COA_TYPES = ['Asset','Liability','Equity','Revenue','Expense','Cost of Goods Sold'];
const COA_SUBTYPES = {
  Asset:    ['Current Asset','Fixed Asset','Other Asset','Bank','Accounts Receivable'],
  Liability:['Current Liability','Long-term Liability','Accounts Payable','Credit Card'],
  Equity:   ['Owner\\'s Equity','Retained Earnings','Common Stock'],
  Revenue:  ['Operating Revenue','Other Revenue'],
  Expense:  ['Operating Expense','Payroll','Rent','Utilities','Other Expense'],
  'Cost of Goods Sold': ['Direct Cost','Materials','Labor']
};

async function renderChartOfAccounts(container) {
  const clientId   = STATE.isStaff ? STATE.selectedClientId : STATE.clientRow?.id;
  const clientName = STATE.isStaff ? selectedClientName() : (STATE.clientRow?.full_name || '');
  const addBtn = STATE.isStaff
    ? \`<button class="btn btn-secondary" onclick="openCoaModal()">+ Add Account</button>\`
    : '';

  container.innerHTML = pageShell('Chart of Accounts', clientName, addBtn,
    '<div class="loading-block"><span class="spinner"></span> Loading accounts…</div>');

  if (!clientId) {
    container.innerHTML = pageShell('Chart of Accounts','',addBtn,'<div class="alert alert-red" style="margin:28px">Please select a client first.</div>');
    return;
  }

  const { data: accounts, error } = await sb.from('chart_of_accounts')
    .select('*').eq('client_id', clientId).order('account_type').order('account_number');

  if (error) {
    container.innerHTML = pageShell('Chart of Accounts', clientName, addBtn,
      \`<div class="alert alert-red" style="margin:28px">\${esc(error.message)}</div>\`);
    return;
  }

  window._coaClientId = clientId;

  // Group by type
  const grouped = {};
  COA_TYPES.forEach(t => { grouped[t] = []; });
  (accounts||[]).forEach(a => { if (grouped[a.account_type]) grouped[a.account_type].push(a); });

  const typeColor = {
    Asset:'var(--green)', Liability:'var(--red)', Equity:'var(--navy)',
    Revenue:'var(--gold)', Expense:'var(--red)', 'Cost of Goods Sold':'var(--muted)'
  };

  const sections = COA_TYPES.map(type => {
    const rows = grouped[type];
    if (!rows.length && !STATE.isStaff) return '';
    return \`
      <div style="margin-bottom:20px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:\${typeColor[type]||'var(--muted)'};padding:0 20px 8px;text-transform:uppercase">\${type}</div>
        \${!rows.length ? \`<div style="padding:8px 20px;font-size:13px;color:var(--muted);font-style:italic">No accounts yet\${STATE.isStaff?' — click + Add Account to create one':''}</div>\` :
        \`<table class="data-table">
          <thead><tr><th>#</th><th>Account Name</th><th>Subtype</th><th>Description</th><th>Status</th>\${STATE.isStaff?'<th></th>':''}</tr></thead>
          <tbody>
          \${rows.map(a=>\`<tr>
            <td style="font-family:monospace;font-size:12px;color:var(--muted)">\${esc(a.account_number||'—')}</td>
            <td style="font-weight:600">\${esc(a.account_name)}</td>
            <td style="font-size:12px;color:var(--muted)">\${esc(a.account_subtype||'—')}</td>
            <td style="font-size:12px;color:var(--muted)">\${esc(a.description||'')}</td>
            <td><span style="font-size:11px;font-weight:600;color:\${a.is_active?'var(--green)':'var(--muted)'}">● \${a.is_active?'Active':'Inactive'}</span></td>
            \${STATE.isStaff?\`<td style="white-space:nowrap">
              <button onclick="openCoaModal('\${esc(a.id)}')" style="background:none;border:none;cursor:pointer;font-size:13px;padding:2px 6px">✏️</button>
              <button onclick="toggleCoaActive('\${esc(a.id)}',\${!a.is_active})" style="background:none;border:none;cursor:pointer;font-size:12px;padding:2px 6px;color:var(--muted)" title="\${a.is_active?'Deactivate':'Activate'}">\${a.is_active?'🔒':'🔓'}</button>
            </td>\`:''}
          </tr>\`).join('')}
          </tbody>
        </table>\`}
      </div>\`;
  }).join('');

  const totalActive = (accounts||[]).filter(a=>a.is_active).length;

  container.innerHTML = pageShell('Chart of Accounts', clientName, addBtn, \`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      \${COA_TYPES.slice(0,3).map(t=>{
        const count = grouped[t].length;
        return \`<div class="card"><div class="card-body" style="padding:16px">
          <div style="font-size:11px;font-weight:600;color:\${typeColor[t]};letter-spacing:.06em;text-transform:uppercase">\${t}</div>
          <div style="font-size:28px;font-weight:700;margin-top:4px">\${count}</div>
          <div style="font-size:11px;color:var(--muted)">account\${count!==1?'s':''}</div>
        </div></div>\`;
      }).join('')}
    </div>
    <div class="card">
      <div class="card-h" style="display:flex;justify-content:space-between;align-items:center">
        <span>All Accounts</span>
        <span style="font-size:12px;font-weight:400;color:var(--muted)">\${totalActive} active of \${(accounts||[]).length} total</span>
      </div>
      <div class="card-body" style="padding:0">\${sections || '<div style="padding:24px;text-align:center;color:var(--muted)">No accounts set up yet.</div>'}</div>
    </div>

    <!-- COA modal (staff only) -->
    <div id="coa-modal" hidden style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px">
      <div style="background:var(--surface);border-radius:12px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border)">
          <div style="font-weight:700;font-size:16px" id="coa-modal-title">New Account</div>
          <button onclick="document.getElementById('coa-modal').hidden=true" style="font-size:20px;color:var(--muted);background:none;border:none;cursor:pointer">✕</button>
        </div>
        <div style="padding:24px" id="coa-modal-body"></div>
      </div>
    </div>
  \`);
}

window.openCoaModal = async function(id) {
  let row = null;
  if (id) {
    const { data } = await sb.from('chart_of_accounts').select('*').eq('id', id).single();
    row = data;
  }
  document.getElementById('coa-modal-title').textContent = id ? 'Edit Account' : 'New Account';
  document.getElementById('coa-modal-body').innerHTML = coaFormHtml(row);
  document.getElementById('coa-modal').hidden = false;
};

function coaFormHtml(r) {
  const selType = r?.account_type || COA_TYPES[0];
  const subtypes = COA_SUBTYPES[selType] || [];
  return \`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Account Number</label>
        <input id="coa-num" class="input" value="\${esc(r?.account_number||'')}" placeholder="e.g. 1000"></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Account Type *</label>
        <select id="coa-type" class="input" onchange="updateCoaSubtypes()">
          \${COA_TYPES.map(t=>\`<option value="\${t}" \${selType===t?'selected':''}>\${t}</option>\`).join('')}
        </select></div>
    </div>
    <div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Account Name *</label>
      <input id="coa-name" class="input" value="\${esc(r?.account_name||'')}" placeholder="e.g. Checking Account"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Subtype</label>
        <select id="coa-subtype" class="input">
          <option value="">— None —</option>
          \${subtypes.map(s=>\`<option value="\${s}" \${(r?.account_subtype||'')==s?'selected':''}>\${s}</option>\`).join('')}
        </select></div>
      <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Status</label>
        <select id="coa-active" class="input">
          <option value="true"  \${(r?.is_active!==false)?'selected':''}>✅ Active</option>
          <option value="false" \${r?.is_active===false?'selected':''}>🔒 Inactive</option>
        </select></div>
    </div>
    <div style="margin-bottom:16px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Description</label>
      <textarea id="coa-desc" class="input" style="height:60px;resize:none" placeholder="Optional notes about this account">\${esc(r?.description||'')}</textarea></div>
    <div id="coa-err" style="color:var(--red);font-size:13px;margin-bottom:8px"></div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="document.getElementById('coa-modal').hidden=true">Cancel</button>
      <button class="btn btn-primary" onclick="saveCoaAccount('\${esc(r?.id||'')}')">💾 Save Account</button>
    </div>\`;
}

window.updateCoaSubtypes = function() {
  const type = document.getElementById('coa-type')?.value;
  const sel  = document.getElementById('coa-subtype');
  if (!sel) return;
  const subtypes = COA_SUBTYPES[type] || [];
  sel.innerHTML = '<option value="">— None —</option>' +
    subtypes.map(s=>\`<option value="\${s}">\${s}</option>\`).join('');
};

window.saveCoaAccount = async function(existingId) {
  const errEl = document.getElementById('coa-err');
  const name  = document.getElementById('coa-name')?.value.trim();
  const type  = document.getElementById('coa-type')?.value;
  if (!name) { errEl.textContent = 'Account name is required.'; return; }

  const payload = {
    client_id:       window._coaClientId,
    account_number:  document.getElementById('coa-num')?.value.trim() || null,
    account_name:    name,
    account_type:    type,
    account_subtype: document.getElementById('coa-subtype')?.value || null,
    description:     document.getElementById('coa-desc')?.value.trim() || null,
    is_active:       document.getElementById('coa-active')?.value === 'true',
    updated_at:      new Date().toISOString()
  };

  const { error } = existingId
    ? await sb.from('chart_of_accounts').update(payload).eq('id', existingId)
    : await sb.from('chart_of_accounts').insert(payload);

  if (error) { errEl.textContent = 'Error: ' + error.message; return; }
  document.getElementById('coa-modal').hidden = true;
  renderChartOfAccounts(document.getElementById('screen-container'));
};

window.toggleCoaActive = async function(id, newState) {
  await sb.from('chart_of_accounts').update({ is_active: newState }).eq('id', id);
  renderChartOfAccounts(document.getElementById('screen-container'));
};

// ── JOURNAL ENTRIES ───────────────────────────────────────
async function renderJournal(container) {
  var _STATE$clientRow2;
  container.innerHTML = pageShell('Journal Entries', STATE.isStaff ? selectedClientName() : ((_STATE$clientRow2 = STATE.clientRow) === null || _STATE$clientRow2 === void 0 ? void 0 : _STATE$clientRow2.full_name) || '', STATE.isStaff ? "\\n    <button class=\\"btn btn-secondary\\" onclick=\\"openJEModal()\\">+ New Entry</button>\\n  " : '', '<div class="loading-block"><span class="spinner"></span> Loading…</div>');

  // join accounts + client name
  const q = applyClientFilter(sb.from('journal_entries').select('*, clients(full_name), journal_lines(*, accounts(account_number, name))').order('entry_date', {
    ascending: false
  }));
  const {
    data,
    error
  } = await q;
  const main = container.querySelector('#main');
  if (error) {
    main.innerHTML = "<div class=\\"alert alert-red\\">".concat(esc(error.message), "</div>");
    return;
  }
  if (!data.length) {
    main.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>No journal entries yet.</div>';
    return;
  }
  main.innerHTML = data.map(je => {
    var _je$clients;
    const lines = je.journal_lines || [];
    const totalDr = lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
    const canEdit = je.status !== 'posted';
    const clientName = ((_je$clients = je.clients) === null || _je$clients === void 0 ? void 0 : _je$clients.full_name) || '';
    return "\\n      <div class=\\"card\\" style=\\"margin-bottom:14px\\">\\n        <div class=\\"card-h\\">\\n          <div style=\\"display:flex;flex-direction:column;gap:3px\\">\\n            ".concat(clientName ? "<span style=\\"font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.06em\\">👤 ".concat(esc(clientName), "</span>") : '', "\\n            <div>\\n              <span style=\\"font-family:monospace;font-size:12px;color:var(--muted)\\">").concat(esc(je.reference || ''), "</span>\\n              <span style=\\"font-weight:700;margin-left:8px\\">").concat(esc(je.description || 'No description'), "</span>\\n            </div>\\n          </div>\\n          <div style=\\"display:flex;align-items:center;gap:10px\\">\\n            <span style=\\"font-variant-numeric:tabular-nums;font-weight:600\\">").concat(fmt(totalDr), "</span>\\n            <span class=\\"badge ").concat(je.status === 'posted' ? 'badge-green' : 'badge-gold', "\\">").concat(esc(je.status), "</span>\\n            <span style=\\"font-size:12px;color:var(--muted)\\">").concat(fmtDate(je.entry_date), "</span>\\n            ").concat(canEdit ? "<button class=\\"btn btn-secondary\\" style=\\"padding:4px 10px;font-size:12px\\" onclick=\\"openEditJEModal('".concat(je.id, "')\\">Edit</button>") : '', "\\n          </div>\\n        </div>\\n        <table class=\\"je-line-table\\">\\n          <thead><tr><th>Account</th><th>Memo</th><th style=\\"text-align:right\\">Debit</th><th style=\\"text-align:right\\">Credit</th></tr></thead>\\n          <tbody>").concat(lines.map(l => "\\n            <tr>\\n              <td style=\\"font-size:12px;color:var(--muted)\\">".concat(esc(((l.accounts ? l.accounts.account_number : '') || '') + ' ' + ((l.accounts ? l.accounts.name : '') || '')), "</td>\\n              <td>").concat(esc(l.memo || ''), "</td>\\n              <td style=\\"text-align:right;font-variant-numeric:tabular-nums\\">").concat(parseFloat(l.debit) > 0 ? fmt(l.debit) : '', "</td>\\n              <td style=\\"text-align:right;font-variant-numeric:tabular-nums\\">").concat(parseFloat(l.credit) > 0 ? fmt(l.credit) : '', "</td>\\n            </tr>\\n          ")).join(''), "</tbody>\\n        </table>\\n      </div>\\n    ");
  }).join('');
}
async function openEditJEModal(jeId) {
  // load the entry + lines
  const {
    data: je,
    error
  } = await sb.from('journal_entries').select('*, journal_lines(*, accounts(account_number, name))').eq('id', jeId).single();
  if (error || !je) {
    alert('Could not load entry.');
    return;
  }
  if (je.status === 'posted') {
    alert('Posted entries cannot be edited. Reverse it first.');
    return;
  }
  ensureModalStyles();
  jeLines = (je.journal_lines || []).map(l => ({
    id: l.id,
    account_id: l.account_id,
    debit: parseFloat(l.debit) || '',
    credit: parseFloat(l.credit) || '',
    memo: l.memo || ''
  }));
  if (jeLines.length < 2) jeLines.push({
    account_id: '',
    debit: '',
    credit: '',
    memo: ''
  });
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'je-backdrop';
  bd.innerHTML = "\\n    <div class=\\"modal\\" role=\\"dialog\\" aria-modal=\\"true\\" style=\\"max-width:680px\\">\\n      <div class=\\"modal-header\\">\\n        <h3>Edit Journal Entry</h3>\\n        <button class=\\"modal-close\\" onclick=\\"closeModal('je-backdrop')\\" aria-label=\\"Close\\">×</button>\\n      </div>\\n      <div class=\\"modal-body\\">\\n        <div class=\\"form-group\\">\\n          <label for=\\"jem-client\\">Client</label>\\n          <select id=\\"jem-client\\" disabled>\\n            ".concat((STATE.clientRows || []).map(c => "<option value=\\"".concat(esc(c.id), "\\" ").concat(je.client_id === c.id ? 'selected' : '', ">").concat(esc(c.full_name), "</option>")).join(''), "\\n          </select>\\n        </div>\\n        <div class=\\"form-row\\">\\n          <div class=\\"form-group\\">\\n            <label for=\\"jem-date\\">Date *</label>\\n            <input id=\\"jem-date\\" type=\\"date\\" value=\\"").concat(esc(je.entry_date || ''), "\\">\\n          </div>\\n          <div class=\\"form-group\\">\\n            <label for=\\"jem-ref\\">Reference #</label>\\n            <input id=\\"jem-ref\\" type=\\"text\\" value=\\"").concat(esc(je.reference || ''), "\\" autocomplete=\\"off\\">\\n          </div>\\n        </div>\\n        <div class=\\"form-group\\">\\n          <label for=\\"jem-desc\\">Description *</label>\\n          <input id=\\"jem-desc\\" type=\\"text\\" value=\\"").concat(esc(je.description || ''), "\\" autocomplete=\\"off\\">\\n        </div>\\n        <div style=\\"margin-bottom:8px;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em\\">Journal Lines</div>\\n        <div id=\\"jem-lines-wrap\\" style=\\"overflow-x:auto\\">\\n          <table class=\\"je-lines\\">\\n            <thead><tr>\\n              <th style=\\"width:35%\\">Account</th>\\n              <th style=\\"width:25%\\">Memo</th>\\n              <th class=\\"amt\\" style=\\"width:15%\\">Debit</th>\\n              <th class=\\"amt\\" style=\\"width:15%\\">Credit</th>\\n              <th style=\\"width:10%\\"></th>\\n            </tr></thead>\\n            <tbody id=\\"jem-lines\\"></tbody>\\n          </table>\\n        </div>\\n        <div class=\\"je-totals\\" id=\\"jem-totals\\">\\n          <div><span>Debits: </span><strong id=\\"jem-total-dr\\">0.00</strong></div>\\n          <div><span>Credits: </span><strong id=\\"jem-total-cr\\">0.00</strong></div>\\n          <div id=\\"jem-bal-status\\" class=\\"je-bal-ok\\">✓ Balanced</div>\\n        </div>\\n        <button class=\\"btn-link\\" onclick=\\"addJELine()\\">+ Add line</button>\\n        <div class=\\"modal-error\\" id=\\"jem-error\\"></div>\\n      </div>\\n      <div class=\\"modal-footer\\">\\n        <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('je-backdrop')\\">Cancel</button>\\n        <button class=\\"btn btn-primary\\" id=\\"jem-save-draft\\" onclick=\\"updateJE('").concat(jeId, "','draft')\\">Save Draft</button>\\n        <button class=\\"btn btn-primary\\" style=\\"background:var(--green)\\" id=\\"jem-post\\" onclick=\\"updateJE('").concat(jeId, "','posted')\\">Post Entry</button>\\n      </div>\\n    </div>\\n  ");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('je-backdrop');
  });
  renderJELines();
}
async function updateJE(jeId, status) {
  const date = document.getElementById('jem-date').value;
  const ref = document.getElementById('jem-ref').value.trim();
  const desc = document.getElementById('jem-desc').value.trim();
  const errEl = document.getElementById('jem-error');
  errEl.textContent = '';

  // Read live from DOM
  const rows = document.querySelectorAll('#jem-lines tr');
  const liveLines = Array.from(rows).map(row => {
    var _inputs$, _inputs$2;
    const sel = row.querySelector('select');
    const inputs = row.querySelectorAll('input[type=number]');
    const memo = row.querySelector('input[type=text]');
    return {
      account_id: (sel === null || sel === void 0 ? void 0 : sel.value) || '',
      debit: ((_inputs$ = inputs[0]) === null || _inputs$ === void 0 ? void 0 : _inputs$.value) || '',
      credit: ((_inputs$2 = inputs[1]) === null || _inputs$2 === void 0 ? void 0 : _inputs$2.value) || '',
      memo: (memo === null || memo === void 0 ? void 0 : memo.value) || ''
    };
  });
  const validLines = liveLines.filter(l => l.account_id && (parseFloat(l.debit) || 0) + (parseFloat(l.credit) || 0) > 0);
  if (validLines.length < 2) {
    errEl.textContent = 'At least 2 lines required.';
    return;
  }
  const dr = validLines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
  const cr = validLines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  if (Math.abs(dr - cr) >= 0.005) {
    errEl.textContent = "Must balance. Debits (".concat(dr.toFixed(2), ") ≠ Credits (").concat(cr.toFixed(2), ").");
    return;
  }
  if (!date) {
    errEl.textContent = 'Date is required.';
    return;
  }
  if (!desc) {
    errEl.textContent = 'Description is required.';
    return;
  }
  const btn = document.getElementById(status === 'draft' ? 'jem-save-draft' : 'jem-post');
  btn.disabled = true;
  btn.textContent = 'Saving…';
  const {
    error: jeErr
  } = await sb.from('journal_entries').update({
    entry_date: date,
    reference: ref || null,
    description: desc,
    status
  }).eq('id', jeId);
  if (jeErr) {
    errEl.textContent = 'Error: ' + jeErr.message;
    btn.disabled = false;
    btn.textContent = status === 'draft' ? 'Save Draft' : 'Post Entry';
    return;
  }

  // Replace lines: delete old, insert new
  await sb.from('journal_lines').delete().eq('journal_entry_id', jeId);
  const payload = validLines.map((l, i) => ({
    journal_entry_id: jeId,
    account_id: l.account_id,
    debit: parseFloat(l.debit) || 0,
    credit: parseFloat(l.credit) || 0,
    memo: l.memo || null,
    sort_order: i
  }));
  const {
    error: lErr
  } = await sb.from('journal_lines').insert(payload);
  if (lErr) {
    errEl.textContent = 'Entry updated but lines failed: ' + lErr.message;
    btn.disabled = false;
    return;
  }
  closeModal('je-backdrop');
  navigateTo('journal');
}

// ── PAYROLL ───────────────────────────────────────────────
async function renderPayroll(container) {
  var _STATE$clientRow3;
  const isClient = !STATE.isStaff;
  const subtitle = isClient ? ((_STATE$clientRow3 = STATE.clientRow) === null || _STATE$clientRow3 === void 0 ? void 0 : _STATE$clientRow3.full_name) || '' : selectedClientName();
  const tabs = isClient ? "<button class=\\"tab-btn active\\" data-tab=\\"pay-runs\\">Pay History</button>\\n       <button class=\\"tab-btn\\" data-tab=\\"tax-filings\\">Tax Filings</button>" : "<button class=\\"tab-btn active\\" data-tab=\\"employees\\">Employees</button>\\n       <button class=\\"tab-btn\\" data-tab=\\"pay-runs\\">Pay Runs</button>\\n       <button class=\\"tab-btn\\" data-tab=\\"tax-filings\\">Tax Filings</button>";
  container.innerHTML = pageShell('Payroll', subtitle, '', "\\n    <div id=\\"payroll-tabs-wrap\\">\\n      <div class=\\"tab-bar\\" id=\\"payroll-tab-bar\\">".concat(tabs, "</div>\\n      <div id=\\"payroll-tab-content\\"></div>\\n    </div>\\n  "), false);
  document.getElementById('payroll-tab-bar').addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    document.querySelectorAll('#payroll-tab-bar .tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    loadPayrollTab(btn.dataset.tab);
  });
  loadPayrollTab(isClient ? 'pay-runs' : 'employees');
}
async function loadPayrollTab(tab) {
  const el = document.getElementById('payroll-tab-content');
  el.innerHTML = '<div class="loading-block"><span class="spinner"></span></div>';
  const main = document.getElementById('main');
  main.style.padding = '0';
  if (tab === 'employees') {
    const q = applyClientFilter(sb.from('employees').select('*').order('full_name'));
    const {
      data,
      error: empErr
    } = await q;
    if (empErr) console.error('employees query error:', empErr);
    el.innerHTML = "<div style=\\"padding:20px 28px\\">\\n      ".concat(STATE.isStaff ? "<div style=\\"display:flex;justify-content:flex-end;margin-bottom:12px\\">\\n        <button class=\\"btn btn-primary\\" onclick=\\"openAddEmployeeModal()\\">+ Add Employee</button>\\n      </div>" : '', "\\n      <div class=\\"card\\"><div class=\\"table-wrap\\"><table>\\n        <thead><tr><th>Name</th><th>Title</th><th>Type</th><th style=\\"text-align:right\\">Rate</th><th>Status</th><th></th></tr></thead>\\n        <tbody>").concat(data && data.length ? data.map(emp => "\\n          <tr class=\\"emp-row\\" data-emp-id=\\"".concat(esc(emp.id), "\\" style=\\"cursor:pointer\\">\\n            <td style=\\"font-weight:600\\">").concat(esc(emp.full_name || '—'), "</td>\\n            <td style=\\"font-size:12px\\">").concat(esc(emp.job_title || '—'), "</td>\\n            <td>").concat(emp.pay_type === 'salary' ? 'Salary' : 'Hourly', "</td>\\n            <td style=\\"text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmt(emp.pay_rate || 0), "</td>\\n            <td><span class=\\"badge ").concat(emp.status === 'active' ? 'badge-green' : 'badge-grey', "\\">").concat(esc(emp.status || 'inactive'), "</span></td>\\n            <td style=\\"text-align:right;padding-right:8px\\"><button class=\\"btn btn-secondary emp-edit-btn\\" data-emp-id=\\"").concat(esc(emp.id), "\\" style=\\"font-size:12px;padding:3px 10px\\">Edit</button></td>\\n          </tr>\\n        ")).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:32px">No employees yet. Click + Add Employee to get started.</td></tr>', "</tbody>\\n      </table></div></div>\\n    </div>");
    // Wire up Edit buttons — use dataset to avoid quote-breaking
    el.querySelectorAll('.emp-edit-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const emp = data.find(em => em.id === btn.dataset.empId);
        if (emp) openEditEmployeeModal(emp);
      });
    });
  } else if (tab === 'pay-runs') {
    const q = applyClientFilter(sb.from('pay_runs').select('*').order('period_end', {
      ascending: false
    }));
    const {
      data
    } = await q;
    const emptyMsg = STATE.isStaff ? 'No pay runs yet. Click ▶ Run Payroll to get started.' : 'No completed pay runs on file yet.';
    el.innerHTML = "<div style=\\"padding:20px 28px\\">\\n      ".concat(STATE.isStaff ? "<div style=\\"display:flex;justify-content:flex-end;margin-bottom:12px\\">\\n        <button class=\\"btn btn-primary\\" style=\\"background:var(--green)\\" onclick=\\"openRunPayrollModal()\\">▶ Run Payroll</button>\\n      </div>" : '', "\\n      <div class=\\"card\\"><div class=\\"table-wrap\\"><table>\\n        <thead><tr><th>Period</th><th>Type</th><th style=\\"text-align:right\\">Gross</th><th style=\\"text-align:right\\">Net</th><th>Status</th><th></th></tr></thead>\\n        <tbody>").concat(data && data.length ? data.map(r => "\\n          <tr style=\\"cursor:pointer\\" class=\\"pr-row\\" data-id=\\"".concat(esc(r.id), "\\" data-start=\\"").concat(esc(r.period_start), "\\" data-end=\\"").concat(esc(r.period_end), "\\">\\n            <td>").concat(fmtDate(r.period_start), " – ").concat(fmtDate(r.period_end), "</td>\\n            <td style=\\"font-size:12px\\">").concat(esc(r.label || ''), "</td>\\n            <td style=\\"text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmt(r.total_gross || 0), "</td>\\n            <td style=\\"text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmt(r.total_net || 0), "</td>\\n            <td><span class=\\"badge badge-").concat(r.status === 'posted' ? 'green' : r.status === 'draft' ? 'gold' : 'blue', "\\">").concat(esc(r.status), "</span></td>\\n            <td style=\\"color:var(--muted);font-size:11px\\">View →</td>\\n          </tr>\\n        ")).join('') : "<tr><td colspan=\\"6\\" style=\\"text-align:center;color:var(--muted);padding:32px\\">".concat(emptyMsg, "</td></tr>"), "</tbody>\\n      </table></div></div>\\n    </div>");
    // Wire up row clicks after render
    el.querySelectorAll('.pr-row').forEach(row => {
      row.addEventListener('click', () => openPayRunDetail(row.dataset.id, row.dataset.start, row.dataset.end));
    });
  } else if (tab === 'tax-filings') {
    const q = applyClientFilter(sb.from('payroll_tax_filings').select('*').order('due_date', {
      ascending: false
    }));
    const {
      data
    } = await q;
    el.innerHTML = "<div style=\\"padding:20px 28px\\"><div class=\\"card\\"><table>\\n      <thead><tr><th>Form</th><th>Period</th><th>Due</th><th style=\\"text-align:right\\">Amount</th><th>Status</th></tr></thead>\\n      <tbody>".concat((data || []).map(f => "\\n        <tr>\\n          <td style=\\"font-weight:600;font-family:monospace\\">".concat(esc(f.form_type), "</td>\\n          <td style=\\"font-size:12px\\">").concat(esc(f.period_label || ''), "</td>\\n          <td style=\\"font-size:12px\\">").concat(fmtDate(f.due_date), "</td>\\n          <td style=\\"text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmt(f.amount_due || 0), "</td>\\n          <td><span class=\\"badge ").concat(f.status === 'filed' ? 'badge-green' : f.status === 'pending' ? 'badge-gold' : 'badge-red', "\\">").concat(esc(f.status), "</span></td>\\n        </tr>\\n      ")).join(''), "</tbody>\\n    </table></div></div>");
  }
}

// ── TAX RETURNS ───────────────────────────────────────────
async function renderTax(container) {
  var _STATE$clientRow4;
  container.innerHTML = pageShell('Tax Returns', STATE.isStaff ? selectedClientName() : ((_STATE$clientRow4 = STATE.clientRow) === null || _STATE$clientRow4 === void 0 ? void 0 : _STATE$clientRow4.full_name) || '', STATE.isStaff ? "\\n    <button class=\\"btn btn-secondary\\">+ New Return</button>\\n  " : '', '<div class="loading-block"><span class="spinner"></span> Loading…</div>');
  const q = applyClientFilter(sb.from('tax_returns').select('*').order('tax_year', {
    ascending: false
  }));
  const {
    data,
    error
  } = await q;
  const main = container.querySelector('#main');
  if (error) {
    main.innerHTML = "<div class=\\"alert alert-red\\">".concat(esc(error.message), "</div>");
    return;
  }
  if (!data || !data.length) {
    main.innerHTML = '<div class="empty"><div class="empty-icon">🏛</div>No tax returns yet.</div>';
    return;
  }
  main.innerHTML = "\\n    <div class=\\"card\\"><table>\\n      <thead><tr><th>Year</th><th>Form</th><th>Filed Date</th><th style=\\"text-align:right\\">Refund</th><th style=\\"text-align:right\\">Balance Due</th><th>Status</th></tr></thead>\\n      <tbody>".concat((data || []).map(r => "\\n        <tr>\\n          <td style=\\"font-weight:600\\">".concat(r.tax_year, "</td>\\n          <td style=\\"font-family:monospace;font-size:12px\\">").concat(esc(r.form || '—'), "</td>\\n          <td style=\\"font-size:12px\\">").concat(r.filed_date ? fmtDate(r.filed_date) : '—', "</td>\\n          <td style=\\"text-align:right;font-variant-numeric:tabular-nums;color:var(--green)\\">").concat(r.refund_amount > 0 ? fmt(r.refund_amount) : '—', "</td>\\n          <td style=\\"text-align:right;font-variant-numeric:tabular-nums;color:var(--red)\\">").concat(r.balance_due > 0 ? fmt(r.balance_due) : '—', "</td>\\n          <td><span class=\\"badge ").concat(r.status === 'filed' ? 'badge-green' : r.status === 'in_review' ? 'badge-blue' : r.status === 'draft' ? 'badge-gold' : 'badge-grey', "\\">").concat(esc((r.status || '').replace('_', ' ')), "</span></td>\\n        </tr>\\n      ")).join(''), "</tbody>\\n    </table></div>\\n  ");
}

// ── REPORTS (staff only) ──────────────────────────────────
async function renderReports(container) {
  if (!STATE.isStaff) {
    container.innerHTML = '<div class="alert alert-red" style="margin:28px">Access denied.</div>';
    return;
  }
  container.innerHTML = pageShell('Reports', 'Admin Only', "\\n    <button class=\\"btn btn-secondary\\">Generate Report</button>\\n  ", "\\n    <div class=\\"alert alert-gold\\">🔒 This section is visible to firm staff only.</div>\\n    <div id=\\"saved-reports-content\\"><div class=\\"loading-block\\"><span class=\\"spinner\\"></span></div></div>\\n  ");
  const {
    data,
    error
  } = await sb.from('saved_reports').select('*').order('generated_at', {
    ascending: false
  }).limit(20);
  const el = document.getElementById('saved-reports-content');
  if (error) {
    el.innerHTML = "<div class=\\"alert alert-red\\">".concat(esc(error.message), "</div>");
    return;
  }
  if (!data || !data.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📈</div><p>No saved reports yet.</p><p style="font-size:12px;margin-top:4px;color:var(--muted)">Generate reports from your data to see them here.</p></div>';
    return;
  }
  el.innerHTML = "<div class=\\"card\\"><table>\\n    <thead><tr><th>Title</th><th>Type</th><th>Client</th><th>Generated</th><th></th></tr></thead>\\n    <tbody>".concat(data.map(r => "\\n      <tr>\\n        <td style=\\"font-weight:600\\">".concat(esc(r.title), "</td>\\n        <td>").concat(esc(r.report_type), "</td>\\n        <td>").concat(esc(r.client_name || 'All'), "</td>\\n        <td style=\\"font-size:12px\\">").concat(relTime(r.generated_at), "</td>\\n        <td><button class=\\"btn btn-sm btn-secondary\\" style=\\"background:var(--bg);color:var(--text)\\">View</button></td>\\n      </tr>\\n    ")).join(''), "</tbody>\\n  </table></div>");
}

// ── ROUTEWORTH PACKAGES (staff only) ─────────────────────
async function renderRouteWorth(container) {
  if (!STATE.isStaff) {
    container.innerHTML = '<div class="alert alert-red" style="margin:28px">Access denied.</div>';
    return;
  }
  container.innerHTML = pageShell('RouteWorth Packages', 'Driver Tax Packages', '', "\\n    <div class=\\"alert alert-green\\">🔗 Packages received from drivers via RouteWorth mobile app.</div>\\n    <div id=\\"rw-content\\"><div class=\\"loading-block\\"><span class=\\"spinner\\"></span></div></div>\\n  ");
  const {
    data,
    error
  } = await sb.from('routeworth_packages').select('*').order('received_at', {
    ascending: false
  });
  const el = document.getElementById('rw-content');
  if (error) {
    el.innerHTML = "<div class=\\"alert alert-red\\">".concat(esc(error.message), "</div>");
    return;
  }
  if (!data || !data.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🚗</div>No packages received yet.</div>';
    return;
  }
  el.innerHTML = data.map(function (pkg) {
    var badgeClass = pkg.status === 'received' ? 'badge-green' : 'badge-gold';
    var summaryHtml = '';
    if (pkg.summary) {
      summaryHtml = '<div style="margin-top:12px;padding:12px;background:var(--bg);border-radius:8px;font-size:12px"><div style="display:flex;gap:24px;flex-wrap:wrap">' + '<div><div style="font-weight:600;color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:.05em">Gross Income</div><div style="font-variant-numeric:tabular-nums;font-weight:600;margin-top:2px">' + fmt(pkg.summary.gross_income || 0) + '</div></div>' + '<div><div style="font-weight:600;color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:.05em">Total Expenses</div><div style="font-variant-numeric:tabular-nums;font-weight:600;margin-top:2px">' + fmt(pkg.summary.total_expenses || 0) + '</div></div>' + '<div><div style="font-weight:600;color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:.05em">Miles</div><div style="font-variant-numeric:tabular-nums;font-weight:600;margin-top:2px">' + (pkg.summary.total_miles || 0).toLocaleString() + '</div></div>' + '<div><div style="font-weight:600;color:var(--muted);text-transform:uppercase;font-size:10px;letter-spacing:.05em">Net Income</div><div style="font-variant-numeric:tabular-nums;font-weight:600;margin-top:2px">' + fmt(pkg.summary.net_income || 0) + '</div></div>' + '</div></div>';
    }
    return '<div class="rw-pkg">' + '<div class="rw-pkg-top">' + '<div>' + '<div class="rw-pkg-name">' + esc(pkg.driver_name || 'Driver') + '</div>' + '<div class="rw-pkg-code">' + esc(pkg.package_code || pkg.id.slice(0, 8)) + '</div>' + '<div class="rw-pkg-meta">' + (pkg.tax_year ? 'Tax Year ' + pkg.tax_year : '') + ' · Received ' + relTime(pkg.received_at) + '</div>' + '</div>' + '<div style="display:flex;gap:8px;align-items:center;flex-shrink:0">' + '<span class="badge ' + badgeClass + '">' + esc(pkg.status || 'pending') + '</span>' + '<button class="btn btn-sm btn-primary" onclick="markRWReceived(\\'' + pkg.id + '\\', this)">✓ Mark Received</button>' + '</div>' + '</div>' + summaryHtml + '</div>';
  }).join('');
}
async function markRWReceived(id, btn) {
  btn.disabled = true;
  btn.textContent = '…';
  const {
    error
  } = await sb.from('routeworth_packages').update({
    status: 'received'
  }).eq('id', id);
  if (error) {
    alert('Error: ' + error.message);
    btn.disabled = false;
    btn.textContent = '✓ Mark Received';
    return;
  }
  renderRouteWorth(document.getElementById('screen-container'));
}

// ════════════════════════════════════════════════════════════
//  UI HELPERS
// ════════════════════════════════════════════════════════════
function pageShell(title, sub, actionsHtml, bodyHtml, withTabs = true) {
  const subHtml = sub ? (typeof sub === 'string' && sub.trim().startsWith('<') ? sub : \`<div class="page-sub">\${esc(sub)}</div>\`) : '';
  return \`
    <div class="page-header">
      <div class="page-header-top">
        <div>
          <div class="page-title">\${esc(title)}</div>
          \${subHtml}
        </div>
        <div class="page-actions">\${actionsHtml || ''}</div>
      </div>
    </div>
    <div id="main" style="flex:1;overflow-y:auto;padding:24px 28px">\${bodyHtml || ''}</div>
  \`;
}
function fmt(n) {
  if (n === null || n === undefined) return '—';
  return '$' + Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function fmtDate(d) {
  if (!d) return '—';
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return d;
  }
}
function relTime(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + 'd ago';
  return fmtDate(iso);
}
function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function showToast(msg, color = 'green') {
  const el = document.createElement('div');
  const bg = color === 'green' ? 'var(--green)' : color === 'red' ? 'var(--red)' : 'var(--gold)';
  el.style.cssText = \`position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:\${bg};color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.3);white-space:nowrap\`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}
function activityIcon(action) {
  const icons = {
    login: '🔐',
    create_je: '📋',
    view_package: '🚗',
    send_package: '📦',
    update_client: '👤',
    file_tax: '🏛'
  };
  return icons[action] || '📌';
}

/* ── MODAL STYLES (injected once) ──────────────────────────── */
function ensureModalStyles() {
  if (document.getElementById('modal-styles')) return;
  const s = document.createElement('style');
  s.id = 'modal-styles';
  s.textContent = "\\n    .modal-backdrop {\\n      position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;\\n      display:flex;align-items:center;justify-content:center;padding:16px;\\n    }\\n    .modal {\\n      background:var(--surface);border-radius:14px;width:100%;max-width:540px;\\n      box-shadow:0 24px 64px rgba(0,0,0,.35);overflow:hidden;\\n      max-height:90vh;display:flex;flex-direction:column;\\n    }\\n    .modal-header {\\n      padding:20px 24px;border-bottom:1px solid var(--border);\\n      display:flex;align-items:center;justify-content:space-between;\\n      background:var(--navy);color:#fff;flex-shrink:0;\\n    }\\n    .modal-header h3 { font-size:16px;font-weight:700;margin:0; }\\n    .modal-close {\\n      background:none;border:none;color:#fff;font-size:20px;cursor:pointer;\\n      opacity:.7;line-height:1;padding:0 4px;\\n    }\\n    .modal-close:hover { opacity:1; }\\n    .modal-body { padding:24px;overflow-y:auto;flex:1; }\\n    .modal-footer {\\n      padding:16px 24px;border-top:1px solid var(--border);\\n      display:flex;gap:10px;justify-content:flex-end;flex-shrink:0;\\n    }\\n    .modal .form-row { display:flex;gap:12px; }\\n    .modal .form-row .form-group { flex:1; }\\n    .modal .form-group { margin-bottom:14px; }\\n    .modal .form-group label {\\n      display:block;font-size:11px;font-weight:600;margin-bottom:5px;\\n      color:var(--muted);text-transform:uppercase;letter-spacing:.05em;\\n    }\\n    .modal .form-group input,\\n    .modal .form-group select,\\n    .modal .form-group textarea {\\n      width:100%;padding:9px 12px;border-radius:7px;\\n      border:1.5px solid var(--border);background:var(--bg);\\n      color:var(--text);outline:none;transition:border-color .15s;\\n    }\\n    .modal .form-group input:focus,\\n    .modal .form-group select:focus,\\n    .modal .form-group textarea:focus { border-color:var(--green); }\\n    .modal .form-group textarea { resize:vertical;min-height:70px; }\\n    .modal-error { color:var(--red);font-size:12px;margin-top:8px;min-height:16px; }\\n    .toggle-row {\\n      display:flex;align-items:center;gap:10px;\\n      padding:10px 0;border-top:1px solid var(--border);margin-top:4px;\\n    }\\n    .toggle-row label { font-size:13px;font-weight:500;color:var(--text);cursor:pointer; }\\n    /* JE lines table */\\n    .je-lines { width:100%;border-collapse:collapse;margin-bottom:8px; }\\n    .je-lines th {\\n      font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;\\n      letter-spacing:.05em;padding:6px 8px;border-bottom:1px solid var(--border);\\n      text-align:left;\\n    }\\n    .je-lines td { padding:4px 4px; }\\n    .je-lines td input, .je-lines td select {\\n      width:100%;padding:7px 8px;border-radius:6px;\\n      border:1.5px solid var(--border);background:var(--bg);color:var(--text);\\n      font-size:13px;outline:none;\\n    }\\n    .je-lines td input:focus, .je-lines td select:focus { border-color:var(--green); }\\n    .je-lines td.amt input { text-align:right;font-variant-numeric:tabular-nums; }\\n    .je-totals {\\n      display:flex;gap:24px;justify-content:flex-end;\\n      font-size:13px;padding:8px 4px;border-top:1px solid var(--border);\\n      font-variant-numeric:tabular-nums;\\n    }\\n    .je-totals span { color:var(--muted); }\\n    .je-totals strong { color:var(--text); }\\n    .je-bal-ok { color:var(--green); }\\n    .je-bal-err { color:var(--red); }\\n    .btn-link {\\n      background:none;border:none;color:var(--green);font-size:13px;\\n      cursor:pointer;padding:4px 0;text-decoration:underline;\\n    }\\n    .btn-link:hover { opacity:.8; }\\n  ";
  document.head.appendChild(s);
}

// ── ONBOARDING TASK TEMPLATES ────────────────────────────────
const ONBOARDING_TASKS = {
  tax: [
    { title: 'Upload W-2(s)',              description: 'Upload all W-2 forms received from employers.',          priority: 'urgent' },
    { title: 'Upload 1099s / 1099-NEC',    description: 'Upload any 1099 forms (freelance, interest, dividends).', priority: 'urgent' },
    { title: 'Upload last year\\'s tax return', description: 'Upload a copy of your prior year federal return.',    priority: 'normal' },
    { title: 'Sign engagement letter',     description: 'Review and sign the engagement letter sent to your email.', priority: 'urgent' },
    { title: 'Schedule review call',       description: 'Book a time with our office to go over your return.',    priority: 'normal' },
  ],
  bookkeeping: [
    { title: 'Upload bank statements',     description: 'Upload monthly bank statements for all business accounts.', priority: 'urgent' },
    { title: 'Upload credit card statements', description: 'Upload statements for all business credit cards.',    priority: 'urgent' },
    { title: 'Upload receipts',            description: 'Upload receipts for business expenses.',                 priority: 'normal' },
    { title: 'Sign engagement letter',     description: 'Review and sign the engagement letter sent to your email.', priority: 'urgent' },
  ],
  payroll: [
    { title: 'Provide employee list',      description: 'Send us names, SSNs, pay rates, and start dates for all employees.', priority: 'urgent' },
    { title: 'Upload direct deposit forms', description: 'Collect and upload employee direct deposit authorization forms.', priority: 'urgent' },
    { title: 'Provide federal EIN',        description: 'Confirm your Employer Identification Number for payroll filings.', priority: 'normal' },
    { title: 'Sign payroll agreement',     description: 'Review and sign the payroll services agreement.',        priority: 'urgent' },
  ],
};

// ── ADD CLIENT / ONBOARDING MODAL ───────────────────────────
function openAddClientModal() {
  ensureModalStyles();
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'add-client-backdrop';
  bd.innerHTML = \`
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="acm-title" style="max-width:580px">
      <div class="modal-header">
        <h3 id="acm-title">🚀 Onboard New Client</h3>
        <button class="modal-close" onclick="closeModal('add-client-backdrop')" aria-label="Close">×</button>
      </div>
      <div class="modal-body">

        <div style="background:var(--bg);border-radius:8px;padding:14px;margin-bottom:20px;border:1px solid var(--border)">
          <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em;margin-bottom:12px">STEP 1 — CLIENT INFORMATION</div>
          <div class="form-row">
            <div class="form-group">
              <label for="acm-name">Full Name / Business Name *</label>
              <input id="acm-name" type="text" placeholder="e.g. John Smith or Acme LLC" autocomplete="off">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="acm-entity">Entity Type *</label>
              <select id="acm-entity">
                <option value="">— Select —</option>
                <option value="Individual">Individual</option>
                <option value="LLC">LLC</option>
                <option value="Partnership">Partnership</option>
                <option value="S-Corp">S-Corp</option>
                <option value="C-Corp">C-Corp</option>
                <option value="Non-Profit">Non-Profit</option>
              </select>
            </div>
            <div class="form-group">
              <label for="acm-state">State</label>
              <input id="acm-state" type="text" placeholder="FL" maxlength="2" style="text-transform:uppercase">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1 1 100%">
              <label for="acm-industry">Industry / Business Type</label>
              <select id="acm-industry">
                <option value="">— Select industry (pre-loads Chart of Accounts) —</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Medical / Healthcare">Medical / Healthcare</option>
                <option value="Salon & Beauty">Salon & Beauty</option>
                <option value="Cleaning Services">Cleaning Services</option>
                <option value="Landscaping & Lawn Care">Landscaping & Lawn Care</option>
                <option value="Auto Repair & Mechanic">Auto Repair & Mechanic</option>
                <option value="Restaurant / Food Service">Restaurant / Food Service</option>
                <option value="Catering">Catering</option>
                <option value="Food Truck">Food Truck</option>
                <option value="Bar & Nightclub">Bar & Nightclub</option>
                <option value="General Contractor">General Contractor</option>
                <option value="Plumbing & HVAC">Plumbing & HVAC</option>
                <option value="Electrical">Electrical</option>
                <option value="Painting & Flooring">Painting & Flooring</option>
                <option value="Retail Store">Retail Store</option>
                <option value="E-Commerce/Online Store">E-Commerce/Online Store</option>
                <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                <option value="Trucking/Freight">Trucking/Freight</option>
                <option value="Rideshare/Gig Worker">Rideshare/Gig Worker</option>
                <option value="Moving Company">Moving Company</option>
                <option value="Real Estate Agent/Broker">Real Estate Agent/Broker</option>
                <option value="Property Management">Property Management</option>
                <option value="Short-Term Rental (Airbnb)">Short-Term Rental (Airbnb)</option>
                <option value="Tech/Software Company">Tech/Software Company</option>
                <option value="IT Services & Consulting">IT Services & Consulting</option>
                <option value="Marketing & Design Agency">Marketing & Design Agency</option>
                <option value="Nonprofit Organization">Nonprofit Organization</option>
                <option value="Church/Religious Organization">Church/Religious Organization</option>
                <option value="General/Other">General/Other</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="acm-email">Email *</label>
              <input id="acm-email" type="email" placeholder="client@example.com" autocomplete="off">
            </div>
            <div class="form-group">
              <label for="acm-phone">Phone</label>
              <input id="acm-phone" type="tel" placeholder="(305) 555-0100" autocomplete="off">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="acm-package">Service Package</label>
              <select id="acm-package">
                <option value="">— None selected —</option>
                <option value="starter">Starter — $149/mo</option>
                <option value="essentials">Essentials — $299/mo</option>
                <option value="growth">Growth — $499/mo</option>
                <option value="premium">Premium — $799/mo</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="acm-notes">Internal Notes</label>
            <textarea id="acm-notes" placeholder="Any notes for the team…" style="height:60px"></textarea>
          </div>
          <div class="toggle-row">
            <input type="checkbox" id="acm-gig" style="width:auto;accent-color:var(--green)">
            <label for="acm-gig">Gig / rideshare worker (links RouteWorth data)</label>
          </div>
        </div>

        <div style="background:var(--bg);border-radius:8px;padding:14px;margin-bottom:20px;border:1px solid var(--border)">
          <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em;margin-bottom:12px">STEP 2 — SERVICES</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer;font-size:13px;font-weight:500" id="svc-tax-label">
              <input type="checkbox" id="acm-svc-tax" checked style="width:auto;accent-color:var(--gold)" onchange="acmUpdateServices()">
              🏛 Tax Returns
            </label>
            <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer;font-size:13px;font-weight:500" id="svc-bk-label">
              <input type="checkbox" id="acm-svc-bookkeeping" style="width:auto;accent-color:var(--gold)" onchange="acmUpdateServices()">
              📒 Bookkeeping
            </label>
            <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer;font-size:13px;font-weight:500" id="svc-pr-label">
              <input type="checkbox" id="acm-svc-payroll" style="width:auto;accent-color:var(--gold)" onchange="acmUpdateServices()">
              💼 Payroll
            </label>
          </div>
        </div>

        <div style="background:var(--bg);border-radius:8px;padding:14px;margin-bottom:20px;border:1px solid var(--border)">
          <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em;margin-bottom:4px">STEP 3 — ONBOARDING TASKS</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:12px">These tasks will be assigned to the client automatically. Uncheck any you don't need.</div>
          <div id="acm-tasks-preview"></div>
        </div>

        <div style="background:var(--bg);border-radius:8px;padding:14px;border:1px solid var(--border)">
          <div style="font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.06em;margin-bottom:12px">STEP 4 — PORTAL ACCESS</div>
          <div class="toggle-row" style="margin-bottom:0">
            <input type="checkbox" id="acm-portal" checked style="width:auto;accent-color:var(--green)">
            <label for="acm-portal">Create client portal login and send welcome email</label>
          </div>
        </div>

        <div class="modal-error" id="acm-error" style="margin-top:14px"></div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closeModal('add-client-backdrop')" style="background:var(--surface);color:var(--text);border:1.5px solid var(--border)">Cancel</button>
        <button class="btn btn-primary" id="acm-save" onclick="saveNewClient()">🚀 Create Client &amp; Assign Tasks</button>
      </div>
    </div>
  \`;
  document.body.appendChild(bd);
  bd.addEventListener('click', e => { if (e.target === bd) closeModal('add-client-backdrop'); });
  document.getElementById('acm-name').focus();
  acmUpdateServices();
}

function acmUpdateServices() {
  const hasTax = document.getElementById('acm-svc-tax')?.checked;
  const hasBk  = document.getElementById('acm-svc-bookkeeping')?.checked;
  const hasPr  = document.getElementById('acm-svc-payroll')?.checked;
  // Highlight selected service pills
  [['svc-tax-label','acm-svc-tax'], ['svc-bk-label','acm-svc-bookkeeping'], ['svc-pr-label','acm-svc-payroll']].forEach(([lid, cid]) => {
    const lbl = document.getElementById(lid);
    if (lbl) lbl.style.borderColor = document.getElementById(cid)?.checked ? 'var(--gold)' : 'var(--border)';
  });
  // Build task preview
  const preview = document.getElementById('acm-tasks-preview');
  if (!preview) return;
  const tasks = [];
  if (hasTax) tasks.push(...ONBOARDING_TASKS.tax);
  if (hasBk)  tasks.push(...ONBOARDING_TASKS.bookkeeping);
  if (hasPr)  tasks.push(...ONBOARDING_TASKS.payroll);
  if (!tasks.length) {
    preview.innerHTML = '<div style="font-size:12px;color:var(--muted)">Select at least one service above.</div>';
    return;
  }
  preview.innerHTML = tasks.map((t, i) => \`
    <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
      <input type="checkbox" id="acm-task-\${i}" data-task-idx="\${i}" checked style="width:auto;accent-color:var(--green);flex-shrink:0">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">\${esc(t.title)}</div>
        <div style="font-size:11px;color:var(--muted)">\${esc(t.description)}</div>
      </div>
      <span style="font-size:10px;font-weight:600;color:\${t.priority==='urgent'?'var(--red)':'var(--muted)'}">\${t.priority==='urgent'?'🔴 Urgent':'Normal'}</span>
    </div>\`).join('');
  // Store tasks list for save to reference
  preview.dataset.tasks = JSON.stringify(tasks);
}

async function saveNewClient() {
  const name   = document.getElementById('acm-name').value.trim();
  const entity = document.getElementById('acm-entity').value;
  const email  = document.getElementById('acm-email').value.trim();
  const phone  = document.getElementById('acm-phone').value.trim();
  const state  = document.getElementById('acm-state').value.trim().toUpperCase();
  const notes  = document.getElementById('acm-notes').value.trim();
  const pkg      = document.getElementById('acm-package').value || null;
  const industry = document.getElementById('acm-industry').value || null;
  const gig    = document.getElementById('acm-gig').checked;
  const portal = document.getElementById('acm-portal').checked;
  const hasTax = document.getElementById('acm-svc-tax').checked;
  const hasBk  = document.getElementById('acm-svc-bookkeeping').checked;
  const hasPr  = document.getElementById('acm-svc-payroll').checked;
  const errEl  = document.getElementById('acm-error');
  const btn    = document.getElementById('acm-save');
  errEl.textContent = '';

  if (!name)   { errEl.textContent = 'Full name is required.';        return; }
  if (!entity) { errEl.textContent = 'Please select an entity type.'; return; }
  if (!email)  { errEl.textContent = 'Email is required.';            return; }
  if (!hasTax && !hasBk && !hasPr) { errEl.textContent = 'Select at least one service.'; return; }

  const svcs = [];
  if (hasTax) svcs.push('tax');
  if (hasBk)  svcs.push('bookkeeping');
  if (hasPr)  svcs.push('payroll');

  btn.disabled = true;
  btn.textContent = 'Creating client…';

  // 1. Insert client record
  const { data: newClient, error: clientErr } = await sb.from('clients').insert({
    full_name: name, entity_type: entity, email, phone: phone || null,
    state: state || null, status: 'active', gig_worker: gig,
    notes: notes || null, services: svcs, service_package: pkg,
    client_since: new Date().toISOString().slice(0, 10), ytd_billed: 0,
    industry: industry || null
  }).select().single();

  if (clientErr) {
    errEl.textContent = 'Error creating client: ' + clientErr.message;
    btn.disabled = false; btn.textContent = '🚀 Create Client & Assign Tasks';
    return;
  }

  // 2. Seed Chart of Accounts from industry template
  if (industry) {
    btn.textContent = 'Loading chart of accounts…';
    const { data: templates, error: tmplErr } = await sb
      .from('coa_templates')
      .select('account_number, name, type, subtype')
      .eq('industry', industry)
      .order('account_number');
    if (!tmplErr && templates?.length) {
      const accountRows = templates.map(t => ({
        client_id: newClient.id,
        account_number: t.account_number,
        name: t.name,
        type: t.type,
        subtype: t.subtype || null,
        is_active: true
      }));
      const { error: acctErr } = await sb.from('accounts').insert(accountRows);
      if (acctErr) console.warn('COA seed error:', acctErr.message);
    }
  }

  // 3. Assign selected onboarding tasks
  btn.textContent = 'Assigning tasks…';
  const preview = document.getElementById('acm-tasks-preview');
  const allTasks = JSON.parse(preview.dataset.tasks || '[]');
  const selectedTasks = allTasks.filter((_, i) => document.getElementById(\`acm-task-\${i}\`)?.checked);
  if (selectedTasks.length) {
    const taskRows = selectedTasks.map(t => ({
      client_id: newClient.id, title: t.title,
      description: t.description, priority: t.priority
    }));
    const { error: taskErr } = await sb.from('client_tasks').insert(taskRows);
    if (taskErr) console.warn('Task insert error:', taskErr.message);
  }

  // 3. Optionally create portal login
  if (portal) {
    btn.textContent = 'Creating portal login…';
    try {
      const { data: { session } } = await sb.auth.getSession();
      const token = session?.access_token;
      if (token) {
        const resp = await fetch(\`\${SUPA_URL}/functions/v1/create-client-login\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\`, 'apikey': SUPA_ANON },
          body: JSON.stringify({ client_id: newClient.id, email })
        });
        const result = await resp.json();
        if (!resp.ok) console.warn('Portal login warning:', result.error);
      }
    } catch (e) { console.warn('Portal login error:', e.message); }
  }

  closeModal('add-client-backdrop');
  navigateTo('clients');
}

// ── NEW JOURNAL ENTRY MODAL ─────────────────────────────────
let jeLines = [];
function openJEModal() {
  ensureModalStyles();
  jeLines = [{
    account_id: '',
    debit: '',
    credit: '',
    memo: ''
  }, {
    account_id: '',
    debit: '',
    credit: '',
    memo: ''
  }];
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'je-backdrop';
  bd.innerHTML = "\\n    <div class=\\"modal\\" role=\\"dialog\\" aria-modal=\\"true\\" aria-labelledby=\\"jem-title\\" style=\\"max-width:680px\\">\\n      <div class=\\"modal-header\\">\\n        <h3 id=\\"jem-title\\">New Journal Entry</h3>\\n        <button class=\\"modal-close\\" onclick=\\"closeModal('je-backdrop')\\" aria-label=\\"Close\\">×</button>\\n      </div>\\n      <div class=\\"modal-body\\">\\n        <div class=\\"form-group\\">\\n          <label for=\\"jem-client\\">Client *</label>\\n          <select id=\\"jem-client\\">\\n            <option value=\\"\\">— Select client —</option>\\n            ".concat((STATE.clientRows || []).map(c => "<option value=\\"".concat(esc(c.id), "\\" ").concat(STATE.selectedClientId === c.id ? 'selected' : '', ">").concat(esc(c.full_name), "</option>")).join(''), "\\n          </select>\\n        </div>\\n        <div class=\\"form-row\\">\\n          <div class=\\"form-group\\">\\n            <label for=\\"jem-date\\">Date *</label>\\n            <input id=\\"jem-date\\" type=\\"date\\" value=\\"").concat(new Date().toISOString().slice(0, 10), "\\">\\n          </div>\\n          <div class=\\"form-group\\">\\n            <label for=\\"jem-ref\\">Reference #</label>\\n            <input id=\\"jem-ref\\" type=\\"text\\" placeholder=\\"e.g. JE-2026-001\\" autocomplete=\\"off\\">\\n          </div>\\n        </div>\\n        <div class=\\"form-group\\">\\n          <label for=\\"jem-desc\\">Description *</label>\\n          <input id=\\"jem-desc\\" type=\\"text\\" placeholder=\\"e.g. November payroll accrual\\" autocomplete=\\"off\\">\\n        </div>\\n        <div style=\\"margin-bottom:8px;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em\\">Journal Lines</div>\\n        <div id=\\"jem-lines-wrap\\" style=\\"overflow-x:auto\\">\\n          <table class=\\"je-lines\\">\\n            <thead><tr>\\n              <th style=\\"width:35%\\">Account</th>\\n              <th style=\\"width:25%\\">Memo</th>\\n              <th class=\\"amt\\" style=\\"width:15%\\">Debit</th>\\n              <th class=\\"amt\\" style=\\"width:15%\\">Credit</th>\\n              <th style=\\"width:10%\\"></th>\\n            </tr></thead>\\n            <tbody id=\\"jem-lines\\"></tbody>\\n          </table>\\n        </div>\\n        <div class=\\"je-totals\\" id=\\"jem-totals\\">\\n          <div><span>Debits: </span><strong id=\\"jem-total-dr\\">0.00</strong></div>\\n          <div><span>Credits: </span><strong id=\\"jem-total-cr\\">0.00</strong></div>\\n          <div id=\\"jem-bal-status\\" class=\\"je-bal-ok\\">✓ Balanced</div>\\n        </div>\\n        <button class=\\"btn-link\\" onclick=\\"addJELine()\\">+ Add line</button>\\n        <div class=\\"modal-error\\" id=\\"jem-error\\"></div>\\n      </div>\\n      <div class=\\"modal-footer\\">\\n        <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('je-backdrop')\\">Cancel</button>\\n        <button class=\\"btn btn-primary\\" id=\\"jem-save-draft\\" onclick=\\"saveJE('draft')\\">Save Draft</button>\\n        <button class=\\"btn btn-primary\\" style=\\"background:var(--green)\\" id=\\"jem-post\\" onclick=\\"saveJE('posted')\\">Post Entry</button>\\n      </div>\\n    </div>\\n  ");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('je-backdrop');
  });
  renderJELines();
  document.getElementById('jem-desc').focus();
}
function renderJELines() {
  // Need accounts list — load if not cached
  if (!window._acctCache) {
    sb.from('accounts').select('id,account_number,name').order('account_number').then(({
      data
    }) => {
      window._acctCache = data || [];
      renderJELines();
    });
    return;
  }
  const accts = window._acctCache;
  const tbody = document.getElementById('jem-lines');
  if (!tbody) return;
  tbody.innerHTML = jeLines.map((ln, i) => "\\n    <tr>\\n      <td>\\n        <select onchange=\\"jeLineChange(".concat(i, ",'account_id',this.value)\\">\\n          <option value=\\"\\">— Account —</option>\\n          ").concat(accts.map(a => "<option value=\\"".concat(esc(a.id), "\\" ").concat(ln.account_id === a.id ? 'selected' : '', ">").concat(esc(a.account_number), " ").concat(esc(a.name), "</option>")).join(''), "\\n        </select>\\n      </td>\\n      <td><input type=\\"text\\" placeholder=\\"Memo\\" value=\\"").concat(esc(ln.memo), "\\" oninput=\\"jeLineChange(").concat(i, ",'memo',this.value)\\"></td>\\n      <td class=\\"amt\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" value=\\"").concat(ln.debit, "\\" oninput=\\"jeLineChange(").concat(i, ",'debit',this.value)\\" onfocus=\\"if(this.value==='')jeLineChange(").concat(i, ",'credit','')\\"></td>\\n      <td class=\\"amt\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" value=\\"").concat(ln.credit, "\\" oninput=\\"jeLineChange(").concat(i, ",'credit',this.value)\\" onfocus=\\"if(this.value==='')jeLineChange(").concat(i, ",'debit','')\\"></td>\\n      <td style=\\"text-align:center\\">\\n        ").concat(jeLines.length > 2 ? "<button style=\\"color:var(--red);font-size:16px;background:none;border:none;cursor:pointer\\" onclick=\\"removeJELine(".concat(i, ")\\" title=\\"Remove\\">×</button>") : '', "\\n      </td>\\n    </tr>\\n  ")).join('');
  updateJETotals();
}
function jeLineChange(i, field, val) {
  jeLines[i][field] = val;
  if (field === 'debit' && val) jeLines[i].credit = '';
  if (field === 'credit' && val) jeLines[i].debit = '';
  updateJETotals();
}
function addJELine() {
  jeLines.push({
    account_id: '',
    debit: '',
    credit: '',
    memo: ''
  });
  renderJELines();
}
function removeJELine(i) {
  jeLines.splice(i, 1);
  renderJELines();
}
function updateJETotals() {
  const dr = jeLines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
  const cr = jeLines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  const drEl = document.getElementById('jem-total-dr');
  const crEl = document.getElementById('jem-total-cr');
  const balEl = document.getElementById('jem-bal-status');
  if (!drEl) return;
  drEl.textContent = dr.toFixed(2);
  crEl.textContent = cr.toFixed(2);
  const balanced = Math.abs(dr - cr) < 0.005 && dr > 0;
  balEl.textContent = balanced ? '✓ Balanced' : dr > 0 || cr > 0 ? "⚠ Off by ".concat(Math.abs(dr - cr).toFixed(2)) : '';
  balEl.className = balanced ? 'je-bal-ok' : 'je-bal-err';
}
async function saveJE(status) {
  var _document$getElementB2, _STATE$staffRow;
  const date = document.getElementById('jem-date').value;
  const ref = document.getElementById('jem-ref').value.trim();
  const desc = document.getElementById('jem-desc').value.trim();
  const errEl = document.getElementById('jem-error');
  errEl.textContent = '';
  const clientId = ((_document$getElementB2 = document.getElementById('jem-client')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || STATE.selectedClientId || null;
  if (!clientId) {
    errEl.textContent = 'Please select a client.';
    return;
  }
  if (!date) {
    errEl.textContent = 'Date is required.';
    return;
  }
  if (!desc) {
    errEl.textContent = 'Description is required.';
    return;
  }

  // Read values fresh from DOM (Safari spinner inputs don't always fire oninput)
  const rows = document.querySelectorAll('#jem-lines tr');
  const liveLines = Array.from(rows).map(row => {
    const sel = row.querySelector('select');
    const inputs = row.querySelectorAll('input[type=number]');
    const memo = row.querySelector('input[type=text]');
    return {
      account_id: sel ? sel.value : '',
      debit: inputs[0] ? inputs[0].value : '',
      credit: inputs[1] ? inputs[1].value : '',
      memo: memo ? memo.value : ''
    };
  });
  const validLines = liveLines.filter(l => l.account_id && (parseFloat(l.debit) || 0) + (parseFloat(l.credit) || 0) > 0);
  if (validLines.length < 2) {
    errEl.textContent = 'At least 2 lines with an account and amount are required.';
    return;
  }
  const dr = validLines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
  const cr = validLines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  if (Math.abs(dr - cr) >= 0.005) {
    errEl.textContent = "Entry must balance. Debits (".concat(dr.toFixed(2), ") ≠ Credits (").concat(cr.toFixed(2), ").");
    return;
  }
  const btn = document.getElementById(status === 'draft' ? 'jem-save-draft' : 'jem-post');
  btn.disabled = true;
  btn.textContent = 'Saving…';
  const {
    data: je,
    error: jeErr
  } = await sb.from('journal_entries').insert({
    client_id: clientId,
    entry_date: date,
    reference: ref || null,
    description: desc,
    status,
    created_by: ((_STATE$staffRow = STATE.staffRow) === null || _STATE$staffRow === void 0 ? void 0 : _STATE$staffRow.id) || null
  }).select('id').single();
  if (jeErr) {
    errEl.textContent = 'Error: ' + jeErr.message;
    btn.disabled = false;
    btn.textContent = status === 'draft' ? 'Save Draft' : 'Post Entry';
    return;
  }
  const linesPayload = validLines.map((l, i) => ({
    // validLines already filtered from live DOM
    journal_entry_id: je.id,
    account_id: l.account_id,
    debit: parseFloat(l.debit) || 0,
    credit: parseFloat(l.credit) || 0,
    memo: l.memo || null,
    sort_order: i
  }));
  const {
    error: linesErr
  } = await sb.from('journal_lines').insert(linesPayload);
  if (linesErr) {
    errEl.textContent = 'Entry saved but lines failed: ' + linesErr.message;
    btn.disabled = false;
    return;
  }
  closeModal('je-backdrop');
  navigateTo('journal');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── ADD EMPLOYEE MODAL ────────────────────────────────────
function empSwitchTab(tab) {
  ['emp-tab-employment', 'emp-tab-w4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = id !== tab;
  });
  document.querySelectorAll('.emp-tab-btn').forEach(btn => {
    btn.style.borderBottom = btn.dataset.tab === tab ? '2px solid var(--gold)' : '2px solid transparent';
    btn.style.color = btn.dataset.tab === tab ? 'var(--fg)' : 'var(--muted)';
  });
}
function openAddEmployeeModal() {
  try {
    ensureModalStyles();
  } catch (e) {}
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'emp-backdrop';
  const clientOpts = (STATE.clientRows || []).map(c => "<option value=\\"".concat(esc(c.id), "\\" ").concat(STATE.selectedClientId === c.id ? 'selected' : '', ">").concat(esc(c.full_name), "</option>")).join('');
  bd.innerHTML = "\\n    <div class=\\"modal\\" role=\\"dialog\\" style=\\"max-width:580px\\">\\n      <div class=\\"modal-header\\"><h3>Add Employee</h3><button class=\\"modal-close\\" onclick=\\"closeModal('emp-backdrop')\\" aria-label=\\"Close\\">×</button></div>\\n      <div class=\\"modal-body\\" style=\\"padding-top:0\\">\\n\\n        <!-- Tab bar -->\\n        <div style=\\"display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px\\">\\n          <button class=\\"emp-tab-btn\\" data-tab=\\"emp-tab-employment\\" onclick=\\"empSwitchTab('emp-tab-employment')\\"\\n            style=\\"background:none;border:none;padding:10px 16px;cursor:pointer;font-size:13px;font-weight:600;border-bottom:2px solid var(--gold);color:var(--fg)\\">\\n            Employment\\n          </button>\\n          <button class=\\"emp-tab-btn\\" data-tab=\\"emp-tab-w4\\" onclick=\\"empSwitchTab('emp-tab-w4')\\"\\n            style=\\"background:none;border:none;padding:10px 16px;cursor:pointer;font-size:13px;font-weight:600;border-bottom:2px solid transparent;color:var(--muted)\\">\\n            W-4 Withholding\\n          </button>\\n        </div>\\n\\n        <!-- Tab 1: Employment Info -->\\n        <div id=\\"emp-tab-employment\\">\\n          <div class=\\"form-group\\"><label>Client *</label><select id=\\"emp-client\\"><option value=\\"\\">— Select client —</option>".concat(clientOpts, "</select></div>\\n          <div class=\\"form-group\\"><label>Full Name *</label><input id=\\"emp-name\\" type=\\"text\\" autocomplete=\\"off\\" placeholder=\\"e.g. Maria Lopez\\"></div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Job Title</label><input id=\\"emp-title\\" type=\\"text\\" autocomplete=\\"off\\"></div>\\n            <div class=\\"form-group\\"><label>Department</label><input id=\\"emp-dept\\" type=\\"text\\" autocomplete=\\"off\\"></div>\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Employment Type</label>\\n              <select id=\\"emp-emptype\\"><option value=\\"FT\\">Full Time</option><option value=\\"PT\\">Part Time</option><option value=\\"Contractor\\">Contractor</option><option value=\\"Seasonal\\">Seasonal</option></select>\\n            </div>\\n            <div class=\\"form-group\\"><label>Pay Type *</label>\\n              <select id=\\"emp-paytype\\"><option value=\\"hourly\\">Hourly</option><option value=\\"salary\\">Salary</option></select>\\n            </div>\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label id=\\"emp-rate-label\\">Pay Rate * <span style=\\"font-size:11px;color:var(--muted)\\">(hourly $)</span></label>\\n              <input id=\\"emp-rate\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\">\\n            </div>\\n            <div class=\\"form-group\\"><label>Pay Frequency</label>\\n              <select id=\\"emp-payfreq\\"><option value=\\"weekly\\">Weekly</option><option value=\\"bi-weekly\\" selected>Bi-weekly</option><option value=\\"semi-monthly\\">Semi-monthly</option><option value=\\"monthly\\">Monthly</option></select>\\n            </div>\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Hire Date</label><input id=\\"emp-start\\" type=\\"date\\"></div>\\n            <div class=\\"form-group\\"><label>Email</label><input id=\\"emp-email\\" type=\\"email\\" autocomplete=\\"off\\"></div>\\n          </div>\\n        </div>\\n\\n        <!-- Tab 2: W-4 Info -->\\n        <div id=\\"emp-tab-w4\\" hidden>\\n          <p style=\\"font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.5\\">\\n            Enter information from the employee's <strong>W-4 form</strong>. This is used to calculate federal income tax withholding each pay period.\\n          </p>\\n\\n          <div class=\\"form-group\\">\\n            <label>Step 1 — Filing Status</label>\\n            <select id=\\"emp-w4-status\\">\\n              <option value=\\"single\\">Single or Married Filing Separately</option>\\n              <option value=\\"mfj\\">Married Filing Jointly (or Qualifying Widow(er))</option>\\n              <option value=\\"hoh\\">Head of Household</option>\\n            </select>\\n          </div>\\n\\n          <div class=\\"form-group\\">\\n            <label style=\\"display:flex;align-items:center;gap:8px;cursor:pointer\\">\\n              <input type=\\"checkbox\\" id=\\"emp-w4-multijob\\" style=\\"width:16px;height:16px\\">\\n              <span>Step 2 — Multiple Jobs / Spouse also works</span>\\n            </label>\\n            <p style=\\"font-size:11px;color:var(--muted);margin-top:4px;margin-left:24px\\">Check if the employee has more than one job or if filing jointly and both spouses work. This increases withholding.</p>\\n          </div>\\n\\n          <div class=\\"form-group\\">\\n            <label>Step 3 — Dependents Amount ($)</label>\\n            <input id=\\"emp-w4-dependents\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\">\\n            <p style=\\"font-size:11px;color:var(--muted);margin-top:4px\\">Annual dollar amount claimed for dependents (e.g. $2,000 per qualifying child under 17).</p>\\n          </div>\\n\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\">\\n              <label>Step 4a — Other Income ($)</label>\\n              <input id=\\"emp-w4-other-income\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\">\\n              <p style=\\"font-size:11px;color:var(--muted);margin-top:4px\\">Annual other income not from jobs (interest, dividends, etc.).</p>\\n            </div>\\n            <div class=\\"form-group\\">\\n              <label>Step 4b — Deductions ($)</label>\\n              <input id=\\"emp-w4-deductions\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\">\\n              <p style=\\"font-size:11px;color:var(--muted);margin-top:4px\\">Annual deductions beyond the standard deduction.</p>\\n            </div>\\n          </div>\\n\\n          <div class=\\"form-group\\">\\n            <label>Step 4c — Extra Withholding per Period ($)</label>\\n            <input id=\\"emp-w4-extra\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\">\\n            <p style=\\"font-size:11px;color:var(--muted);margin-top:4px\\">Additional amount to withhold each pay period if the employee requested it.</p>\\n          </div>\\n        </div>\\n\\n        <div class=\\"modal-error\\" id=\\"emp-error\\"></div>\\n      </div>\\n      <div class=\\"modal-footer\\">\\n        <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('emp-backdrop')\\">Cancel</button>\\n        <button class=\\"btn btn-primary\\" id=\\"emp-save\\" onclick=\\"saveEmployee()\\">Save Employee</button>\\n      </div>\\n    </div>");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('emp-backdrop');
  });

  // Update rate label when pay type changes
  document.getElementById('emp-paytype').addEventListener('change', function () {
    const lbl = document.getElementById('emp-rate-label');
    if (lbl) lbl.innerHTML = this.value === 'salary' ? 'Pay Rate * <span style="font-size:11px;color:var(--muted)">(annual salary $)</span>' : 'Pay Rate * <span style="font-size:11px;color:var(--muted)">(hourly $)</span>';
  });
}

// Calculate federal withholding using IRS Pub 15-T 2024 Percentage Method
function calcFedWH({
  gross,
  payFrequency,
  filingStatus,
  multipleJobs,
  dependentsAmt,
  otherIncome,
  deductions,
  extraWH
}) {
  // Annualize gross based on frequency
  const periods = {
    'weekly': 52,
    'bi-weekly': 26,
    'semi-monthly': 24,
    'monthly': 12
  };
  const n = periods[payFrequency] || 26;
  let annualWage = gross * n;

  // Step 2: Add other income
  annualWage += otherIncome || 0;

  // Step 3: Subtract deductions (standard deduction already in tables below)
  annualWage -= deductions || 0;

  // 2024 Standard deductions for Pub 15-T Percentage Method
  const stdDed = {
    single: 14600,
    mfj: 29200,
    hoh: 21900
  };
  // Adjusted annual wage = annualWage - standard deduction
  let adjWage = annualWage - (stdDed[filingStatus] || 14600);

  // Multiple jobs adjustment: halve the adjusted wage
  if (multipleJobs) adjWage = adjWage / 2;

  // Subtract tentative withholding for dependents
  // Tentative hold on dependents = dependentsAmt / n (spread over pay periods)
  const depAdj = dependentsAmt || 0;

  // 2024 IRS Pub 15-T Table for Percentage Method (Annual amounts)
  const tables = {
    single: [[0, 11600, 0, 0.10], [11600, 33550, 1160, 0.12], [33550, 74900, 3796, 0.22], [74900, 104525, 12908, 0.24], [104525, 186700, 20004, 0.32], [186700, 519050, 46278, 0.35], [519050, Infinity, 162718, 0.37]],
    mfj: [[0, 23200, 0, 0.10], [23200, 67100, 2320, 0.12], [67100, 149900, 7592, 0.22], [149900, 209050, 25812, 0.24], [209050, 373600, 39996, 0.32], [373600, 694450, 92556, 0.35], [694450, Infinity, 204556, 0.37]],
    hoh: [[0, 16550, 0, 0.10], [16550, 44550, 1655, 0.12], [44550, 81050, 5015, 0.22], [81050, 100500, 13045, 0.24], [100500, 181600, 17713, 0.32], [181600, 514100, 43663, 0.35], [514100, Infinity, 149763, 0.37]]
  };
  const table = tables[filingStatus] || tables.single;
  let annualWH = 0;
  for (const [lo, hi, base, rate] of table) {
    if (adjWage > lo) {
      annualWH = base + (Math.min(adjWage, hi) - lo) * rate;
    }
  }

  // Subtract dependent credit (annual)
  annualWH = Math.max(0, annualWH - depAdj);

  // Per-period withholding
  let perPeriod = annualWH / n;

  // Add extra withholding
  perPeriod += extraWH || 0;
  return Math.max(0, perPeriod);
}
async function saveEmployee() {
  const errEl = document.getElementById('emp-error');
  errEl.textContent = '';
  try {
    var _document$getElementB3, _document$getElementB4;
    const name = document.getElementById('emp-name').value.trim();
    const rateEl = document.getElementById('emp-rate');
    const rate = rateEl.valueAsNumber || parseFloat(rateEl.value) || 0;
    const clientId = ((_document$getElementB3 = document.getElementById('emp-client')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || STATE.selectedClientId || null;
    if (!clientId) {
      errEl.textContent = 'Please select a client.';
      return;
    }
    if (!name) {
      errEl.textContent = 'Full name is required.';
      return;
    }
    const getNum = id => {
      const el = document.getElementById(id);
      return el ? el.valueAsNumber || parseFloat(el.value) || 0 : 0;
    };
    const btn = document.getElementById('emp-save');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    const {
      error
    } = await sb.from('employees').insert({
      client_id: clientId,
      full_name: name,
      job_title: document.getElementById('emp-title').value.trim() || null,
      department: document.getElementById('emp-dept').value.trim() || null,
      employment_type: ['FT', 'PT', 'Contractor', 'Seasonal'].includes((_document$getElementB4 = document.getElementById('emp-emptype')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) ? document.getElementById('emp-emptype').value : 'FT',
      pay_type: document.getElementById('emp-paytype').value || 'hourly',
      pay_frequency: document.getElementById('emp-payfreq').value || 'bi-weekly',
      pay_rate: rate || null,
      hire_date: document.getElementById('emp-start').value || null,
      email: document.getElementById('emp-email').value.trim() || null,
      status: 'active',
      // W-4
      w4_filing_status: document.getElementById('emp-w4-status').value || 'single',
      w4_multiple_jobs: document.getElementById('emp-w4-multijob').checked,
      w4_dependents_amt: getNum('emp-w4-dependents'),
      w4_other_income: getNum('emp-w4-other-income'),
      w4_deductions: getNum('emp-w4-deductions'),
      w4_extra_wh: getNum('emp-w4-extra')
    });
    if (error) {
      errEl.textContent = 'Error: ' + error.message;
      btn.disabled = false;
      btn.textContent = 'Save Employee';
      return;
    }
    closeModal('emp-backdrop');
    navigateTo('payroll');
  } catch (e) {
    errEl.textContent = 'Unexpected error: ' + e.message;
  }
}

// ── EDIT EMPLOYEE MODAL ────────────────────────────────────
function openEditEmployeeModal(emp) {
  try {
    ensureModalStyles();
  } catch (e) {}
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'empedit-backdrop';
  bd.innerHTML = "\\n    <div class=\\"modal\\" role=\\"dialog\\" style=\\"max-width:580px\\">\\n      <div class=\\"modal-header\\"><h3>Edit Employee</h3><button class=\\"modal-close\\" onclick=\\"closeModal('empedit-backdrop')\\" aria-label=\\"Close\\">×</button></div>\\n      <div class=\\"modal-body\\" style=\\"padding-top:0\\">\\n\\n        <!-- Tab bar -->\\n        <div style=\\"display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px\\">\\n          <button class=\\"empedit-tab-btn\\" data-tab=\\"empedit-tab-employment\\" onclick=\\"empEditSwitchTab('empedit-tab-employment')\\"\\n            style=\\"background:none;border:none;padding:10px 16px;cursor:pointer;font-size:13px;font-weight:600;border-bottom:2px solid var(--gold);color:var(--fg)\\">\\n            Employment\\n          </button>\\n          <button class=\\"empedit-tab-btn\\" data-tab=\\"empedit-tab-w4\\" onclick=\\"empEditSwitchTab('empedit-tab-w4')\\"\\n            style=\\"background:none;border:none;padding:10px 16px;cursor:pointer;font-size:13px;font-weight:600;border-bottom:2px solid transparent;color:var(--muted)\\">\\n            W-4 Withholding\\n          </button>\\n        </div>\\n\\n        <!-- Tab 1: Employment -->\\n        <div id=\\"empedit-tab-employment\\">\\n          <div class=\\"form-group\\"><label>Full Name *</label><input id=\\"empedit-name\\" type=\\"text\\" autocomplete=\\"off\\" value=\\"".concat(esc(emp.full_name || ''), "\\"></div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Job Title</label><input id=\\"empedit-title\\" type=\\"text\\" autocomplete=\\"off\\" value=\\"").concat(esc(emp.job_title || ''), "\\"></div>\\n            <div class=\\"form-group\\"><label>Department</label><input id=\\"empedit-dept\\" type=\\"text\\" autocomplete=\\"off\\" value=\\"").concat(esc(emp.department || ''), "\\"></div>\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Employment Type</label>\\n              <select id=\\"empedit-emptype\\">\\n                ").concat(['FT', 'PT', 'Contractor', 'Seasonal'].map(t => "<option value=\\"".concat(t, "\\" ").concat(emp.employment_type === t ? 'selected' : '', ">").concat(t === 'FT' ? 'Full Time' : t === 'PT' ? 'Part Time' : t, "</option>")).join(''), "\\n              </select>\\n            </div>\\n            <div class=\\"form-group\\"><label>Pay Type</label>\\n              <select id=\\"empedit-paytype\\">\\n                <option value=\\"hourly\\" ").concat(emp.pay_type === 'hourly' ? 'selected' : '', ">Hourly</option>\\n                <option value=\\"salary\\" ").concat(emp.pay_type === 'salary' ? 'selected' : '', ">Salary</option>\\n              </select>\\n            </div>\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\">\\n              <label id=\\"empedit-rate-label\\">Pay Rate <span style=\\"font-size:11px;color:var(--muted)\\">(").concat(emp.pay_type === 'salary' ? 'annual salary' : 'hourly', " $)</span></label>\\n              <input id=\\"empedit-rate\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" value=\\"").concat(parseFloat(emp.pay_rate || 0).toFixed(2), "\\">\\n            </div>\\n            <div class=\\"form-group\\"><label>Pay Frequency</label>\\n              <select id=\\"empedit-payfreq\\">\\n                ").concat(['weekly', 'bi-weekly', 'semi-monthly', 'monthly'].map(f => "<option value=\\"".concat(f, "\\" ").concat(emp.pay_frequency === f ? 'selected' : '', ">").concat(f.charAt(0).toUpperCase() + f.slice(1), "</option>")).join(''), "\\n              </select>\\n            </div>\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Hire Date</label><input id=\\"empedit-start\\" type=\\"date\\" value=\\"").concat(emp.hire_date || '', "\\"></div>\\n            <div class=\\"form-group\\"><label>Email</label><input id=\\"empedit-email\\" type=\\"email\\" autocomplete=\\"off\\" value=\\"").concat(esc(emp.email || ''), "\\"></div>\\n          </div>\\n          <div class=\\"form-group\\"><label>Status</label>\\n            <select id=\\"empedit-status\\">\\n              <option value=\\"active\\" ").concat(emp.status === 'active' ? 'selected' : '', ">Active</option>\\n              <option value=\\"inactive\\" ").concat(emp.status === 'inactive' ? 'selected' : '', ">Inactive</option>\\n              <option value=\\"terminated\\" ").concat(emp.status === 'terminated' ? 'selected' : '', ">Terminated</option>\\n            </select>\\n          </div>\\n        </div>\\n\\n        <!-- Tab 2: W-4 -->\\n        <div id=\\"empedit-tab-w4\\" hidden>\\n          <p style=\\"font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.5\\">\\n            Enter information from the employee's <strong>W-4 form</strong>. Used to estimate federal income tax withholding each pay period.\\n          </p>\\n          <div class=\\"form-group\\"><label>Step 1 — Filing Status</label>\\n            <select id=\\"empedit-w4-status\\">\\n              <option value=\\"single\\" ").concat((emp.w4_filing_status || 'single') === 'single' ? 'selected' : '', ">Single or Married Filing Separately</option>\\n              <option value=\\"mfj\\" ").concat(emp.w4_filing_status === 'mfj' ? 'selected' : '', ">Married Filing Jointly (or Qualifying Widow(er))</option>\\n              <option value=\\"hoh\\" ").concat(emp.w4_filing_status === 'hoh' ? 'selected' : '', ">Head of Household</option>\\n            </select>\\n          </div>\\n          <div class=\\"form-group\\">\\n            <label style=\\"display:flex;align-items:center;gap:8px;cursor:pointer\\">\\n              <input type=\\"checkbox\\" id=\\"empedit-w4-multijob\\" style=\\"width:16px;height:16px\\" ").concat(emp.w4_multiple_jobs ? 'checked' : '', ">\\n              <span>Step 2 — Multiple Jobs / Spouse also works</span>\\n            </label>\\n          </div>\\n          <div class=\\"form-group\\"><label>Step 3 — Dependents Amount ($)</label>\\n            <input id=\\"empedit-w4-dependents\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" value=\\"").concat(parseFloat(emp.w4_dependents_amt || 0).toFixed(2), "\\">\\n          </div>\\n          <div class=\\"form-row\\">\\n            <div class=\\"form-group\\"><label>Step 4a — Other Income ($)</label>\\n              <input id=\\"empedit-w4-other-income\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" value=\\"").concat(parseFloat(emp.w4_other_income || 0).toFixed(2), "\\">\\n            </div>\\n            <div class=\\"form-group\\"><label>Step 4b — Deductions ($)</label>\\n              <input id=\\"empedit-w4-deductions\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" value=\\"").concat(parseFloat(emp.w4_deductions || 0).toFixed(2), "\\">\\n            </div>\\n          </div>\\n          <div class=\\"form-group\\"><label>Step 4c — Extra Withholding per Period ($)</label>\\n            <input id=\\"empedit-w4-extra\\" type=\\"number\\" min=\\"0\\" step=\\"0.01\\" value=\\"").concat(parseFloat(emp.w4_extra_wh || 0).toFixed(2), "\\">\\n          </div>\\n        </div>\\n\\n        <div class=\\"modal-error\\" id=\\"empedit-error\\"></div>\\n      </div>\\n      <div class=\\"modal-footer\\">\\n        <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('empedit-backdrop')\\">Cancel</button>\\n        <button class=\\"btn btn-primary\\" id=\\"empedit-save\\" onclick=\\"saveEditEmployee('").concat(esc(emp.id), "')\\">Save Changes</button>\\n      </div>\\n    </div>");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('empedit-backdrop');
  });
  document.getElementById('empedit-paytype').addEventListener('change', function () {
    const lbl = document.getElementById('empedit-rate-label');
    if (lbl) lbl.innerHTML = "Pay Rate <span style=\\"font-size:11px;color:var(--muted)\\">(".concat(this.value === 'salary' ? 'annual salary' : 'hourly', " $)</span>");
  });
}
function empEditSwitchTab(tab) {
  ['empedit-tab-employment', 'empedit-tab-w4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = id !== tab;
  });
  document.querySelectorAll('.empedit-tab-btn').forEach(btn => {
    btn.style.borderBottom = btn.dataset.tab === tab ? '2px solid var(--gold)' : '2px solid transparent';
    btn.style.color = btn.dataset.tab === tab ? 'var(--fg)' : 'var(--muted)';
  });
}
async function saveEditEmployee(empId) {
  const errEl = document.getElementById('empedit-error');
  errEl.textContent = '';
  try {
    const name = document.getElementById('empedit-name').value.trim();
    if (!name) {
      errEl.textContent = 'Full name is required.';
      return;
    }
    const rateEl = document.getElementById('empedit-rate');
    const rate = rateEl.valueAsNumber || parseFloat(rateEl.value) || 0;
    const getNum = id => {
      const el = document.getElementById(id);
      return el ? el.valueAsNumber || parseFloat(el.value) || 0 : 0;
    };
    const btn = document.getElementById('empedit-save');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    const {
      error
    } = await sb.from('employees').update({
      full_name: name,
      job_title: document.getElementById('empedit-title').value.trim() || null,
      department: document.getElementById('empedit-dept').value.trim() || null,
      employment_type: document.getElementById('empedit-emptype').value || 'FT',
      pay_type: document.getElementById('empedit-paytype').value || 'hourly',
      pay_frequency: document.getElementById('empedit-payfreq').value || 'bi-weekly',
      pay_rate: rate || null,
      hire_date: document.getElementById('empedit-start').value || null,
      email: document.getElementById('empedit-email').value.trim() || null,
      status: document.getElementById('empedit-status').value || 'active',
      w4_filing_status: document.getElementById('empedit-w4-status').value || 'single',
      w4_multiple_jobs: document.getElementById('empedit-w4-multijob').checked,
      w4_dependents_amt: getNum('empedit-w4-dependents'),
      w4_other_income: getNum('empedit-w4-other-income'),
      w4_deductions: getNum('empedit-w4-deductions'),
      w4_extra_wh: getNum('empedit-w4-extra')
    }).eq('id', empId);
    if (error) {
      errEl.textContent = 'Error: ' + error.message;
      btn.disabled = false;
      btn.textContent = 'Save Changes';
      return;
    }
    closeModal('empedit-backdrop');
    navigateTo('payroll');
  } catch (e) {
    document.getElementById('empedit-error').textContent = 'Unexpected error: ' + e.message;
  }
}

// ── RUN PAYROLL MODAL ─────────────────────────────────────
async function openRunPayrollModal() {
  try {
    ensureModalStyles();
  } catch (e) {}
  const today = new Date().toISOString().slice(0, 10);
  const clientOpts = (STATE.clientRows || []).map(c => "<option value=\\"".concat(esc(c.id), "\\" ").concat(STATE.selectedClientId === c.id ? 'selected' : '', ">").concat(esc(c.full_name), "</option>")).join('');
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'pr-backdrop';
  bd.innerHTML = "\\n    <div class=\\"modal\\" role=\\"dialog\\" style=\\"max-width:860px;width:98vw\\">\\n      <div class=\\"modal-header\\"><h3>Run Payroll</h3><button class=\\"modal-close\\" onclick=\\"closeModal('pr-backdrop')\\" aria-label=\\"Close\\">×</button></div>\\n      <div class=\\"modal-body\\">\\n        <div class=\\"form-row\\">\\n          <div class=\\"form-group\\"><label>Client *</label>\\n            <select id=\\"pr-client\\" onchange=\\"prLoadEmployees()\\">\\n              <option value=\\"\\">— Select client —</option>".concat(clientOpts, "\\n            </select>\\n          </div>\\n          <div class=\\"form-group\\"><label>Frequency / Label</label>\\n            <select id=\\"pr-freq\\">\\n              <option value=\\"Weekly\\">Weekly</option>\\n              <option value=\\"Bi-weekly\\" selected>Bi-weekly</option>\\n              <option value=\\"Semi-monthly\\">Semi-monthly</option>\\n              <option value=\\"Monthly\\">Monthly</option>\\n            </select>\\n          </div>\\n        </div>\\n        <div class=\\"form-row\\">\\n          <div class=\\"form-group\\"><label>Period Start *</label><input id=\\"pr-start\\" type=\\"date\\" value=\\"").concat(today, "\\"></div>\\n          <div class=\\"form-group\\"><label>Period End *</label><input id=\\"pr-end\\" type=\\"date\\" value=\\"").concat(today, "\\"></div>\\n          <div class=\\"form-group\\"><label>Pay Date</label><input id=\\"pr-paydate\\" type=\\"date\\" value=\\"").concat(today, "\\"></div>\\n        </div>\\n\\n        <div id=\\"pr-emp-section\\" style=\\"margin-top:8px\\">\\n          <p style=\\"color:var(--muted);font-size:13px\\">Select a client above to load employees.</p>\\n        </div>\\n\\n        <div style=\\"margin-top:12px;padding:10px 14px;background:var(--surface2,var(--surface));border-radius:8px;display:flex;gap:32px;font-size:13px\\">\\n          <span>Total Gross: <strong id=\\"pr-tot-gross\\" style=\\"font-variant-numeric:tabular-nums\\">$0.00</strong></span>\\n          <span>Total Deductions: <strong id=\\"pr-tot-ded\\" style=\\"font-variant-numeric:tabular-nums\\">$0.00</strong></span>\\n          <span>Total Net: <strong id=\\"pr-tot-net\\" style=\\"color:var(--green);font-variant-numeric:tabular-nums\\">$0.00</strong></span>\\n        </div>\\n        <div class=\\"modal-error\\" id=\\"pr-error\\"></div>\\n      </div>\\n      <div class=\\"modal-footer\\">\\n        <button class=\\"btn btn-secondary\\" onclick=\\"closeModal('pr-backdrop')\\">Cancel</button>\\n        <button class=\\"btn btn-primary\\" id=\\"pr-draft\\" onclick=\\"savePayRun('draft')\\">Save Draft</button>\\n        <button class=\\"btn btn-primary\\" style=\\"background:var(--green)\\" id=\\"pr-paid\\" onclick=\\"savePayRun('paid')\\">Mark as Paid</button>\\n      </div>\\n    </div>");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('pr-backdrop');
  });

  // Auto-load employees if client already selected
  if (STATE.selectedClientId) await prLoadEmployees();
}
async function prLoadEmployees() {
  var _document$getElementB5;
  const clientId = ((_document$getElementB5 = document.getElementById('pr-client')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || STATE.selectedClientId;
  const sec = document.getElementById('pr-emp-section');
  if (!clientId) {
    sec.innerHTML = '<p style="color:var(--muted);font-size:13px">Select a client above to load employees.</p>';
    return;
  }
  sec.innerHTML = '<div class="loading-block" style="padding:12px"><span class="spinner"></span></div>';
  const {
    data: emps,
    error
  } = await sb.from('employees').select('*').eq('client_id', clientId).eq('status', 'active').order('full_name');
  if (error || !emps || !emps.length) {
    sec.innerHTML = '<p style="color:var(--muted);font-size:13px;margin-top:4px">No active employees found for this client. Add employees first.</p>';
    return;
  }
  sec.innerHTML = "\\n    <div style=\\"overflow-x:auto;margin-top:4px\\">\\n    <table style=\\"width:100%;font-size:12px;border-collapse:collapse\\">\\n      <thead>\\n        <tr style=\\"border-bottom:1px solid var(--border)\\">\\n          <th style=\\"text-align:left;padding:6px 8px;white-space:nowrap\\">Employee</th>\\n          <th style=\\"text-align:left;padding:6px 8px\\">Type</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">Hours</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">Gross Pay</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">Fed WH</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">SS</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">Medicare</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">State WH</th>\\n          <th style=\\"padding:6px 4px;text-align:right\\">Other Ded.</th>\\n          <th style=\\"padding:6px 4px;text-align:right;color:var(--green)\\">Net Pay</th>\\n        </tr>\\n      </thead>\\n      <tbody id=\\"pr-emp-rows\\">\\n        ".concat(emps.map(emp => {
    const isSalary = emp.pay_type === 'salary';
    const rate = parseFloat(emp.pay_rate) || 0;
    // Salary: default gross = annual / 26 (bi-weekly). Hourly: gross auto-fills when hours entered.
    const defaultGross = isSalary && rate ? (rate / 26).toFixed(2) : '';
    const rateLabel = !isSalary && rate ? "<span style=\\"font-size:10px;color:var(--muted);display:block\\">$".concat(rate.toFixed(2), "/hr</span>") : '';
    return "<tr\\n              data-emp-id=\\"".concat(esc(emp.id), "\\" data-rate=\\"").concat(rate, "\\" data-pay-type=\\"").concat(esc(emp.pay_type), "\\"\\n              data-pay-frequency=\\"").concat(esc(emp.pay_frequency || 'bi-weekly'), "\\"\\n              data-w4-status=\\"").concat(esc(emp.w4_filing_status || 'single'), "\\"\\n              data-w4-multi-jobs=\\"").concat(emp.w4_multiple_jobs ? 'true' : 'false', "\\"\\n              data-w4-dependents=\\"").concat(parseFloat(emp.w4_dependents_amt) || 0, "\\"\\n              data-w4-other-inc=\\"").concat(parseFloat(emp.w4_other_income) || 0, "\\"\\n              data-w4-deductions=\\"").concat(parseFloat(emp.w4_deductions) || 0, "\\"\\n              data-w4-extra-wh=\\"").concat(parseFloat(emp.w4_extra_wh) || 0, "\\"\\n              style=\\"border-bottom:1px solid var(--border)\\">\\n            <td style=\\"padding:5px 8px;font-weight:600;white-space:nowrap\\">").concat(esc(emp.full_name)).concat(rateLabel, "</td>\\n            <td style=\\"padding:5px 8px;color:var(--muted)\\">").concat(isSalary ? 'Salary' : 'Hourly', "</td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.5\\" value=\\"").concat(isSalary ? '' : '', "\\" placeholder=\\"").concat(isSalary ? '—' : 'hrs', "\\" ").concat(isSalary ? 'disabled' : '', " style=\\"width:60px;text-align:right\\" oninput=\\"prRecalcRow(this)\\" class=\\"pr-hours\\"></td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" value=\\"").concat(defaultGross, "\\" placeholder=\\"0.00\\" style=\\"width:90px;text-align:right\\" oninput=\\"prRecalcRow(this)\\" class=\\"pr-gross\\"></td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" style=\\"width:75px;text-align:right\\" oninput=\\"prRecalcTotals()\\" class=\\"pr-fedwh\\"></td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" style=\\"width:65px;text-align:right\\" oninput=\\"prRecalcTotals()\\" class=\\"pr-ss\\"></td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" style=\\"width:75px;text-align:right\\" oninput=\\"prRecalcTotals()\\" class=\\"pr-medicare\\"></td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" style=\\"width:75px;text-align:right\\" oninput=\\"prRecalcTotals()\\" class=\\"pr-statewh\\"></td>\\n            <td style=\\"padding:4px\\"><input type=\\"number\\" min=\\"0\\" step=\\"0.01\\" placeholder=\\"0.00\\" style=\\"width:75px;text-align:right\\" oninput=\\"prRecalcTotals()\\" class=\\"pr-otherded\\"></td>\\n            <td style=\\"padding:5px 8px;text-align:right;font-weight:700;color:var(--green);font-variant-numeric:tabular-nums\\" class=\\"pr-net-cell\\">$0.00</td>\\n          </tr>");
  }).join(''), "\\n      </tbody>\\n    </table>\\n    </div>");

  // Auto-calc deductions for salary employees whose gross was pre-filled
  document.querySelectorAll('#pr-emp-rows tr').forEach(row => {
    if (row.dataset.payType === 'salary') prAutoCalcDeductions(row);
  });
  prRecalcTotals();
}
function prGetNum(input) {
  if (!input) return 0;
  return input.valueAsNumber || parseFloat(input.value) || 0;
}

// Auto-calculate standard federal FICA deductions from gross
// SS: 6.2%, Medicare: 1.45%
// Fed WH: uses per-employee W-4 data from row data-* attributes when available
function prEstimateFedWH(grossBiweekly) {
  // Legacy fallback: Single, 0 allowances (kept for direct calls without W-4 data)
  // 2024 IRS Pub 15-T bi-weekly withholding table, Single/MFS
  const brackets = [[0, 530, 0, 0], [530, 1030, 0, 0.10], [1030, 2095, 50, 0.12], [2095, 3819, 177.80, 0.22], [3819, 7231, 556.88, 0.24], [7231, 9119, 1375.76, 0.32], [9119, 11019, 1979.92, 0.35], [11019, Infinity, 2645.42, 0.37]];
  for (const [lo, hi, base, rate] of brackets) {
    if (grossBiweekly >= lo && grossBiweekly < hi) {
      return base + (grossBiweekly - lo) * rate;
    }
  }
  return 0;
}
function prAutoCalcDeductions(row) {
  const gross = prGetNum(row.querySelector('.pr-gross'));
  if (!gross) return;
  const ss = parseFloat((gross * 0.062).toFixed(2));
  const med = parseFloat((gross * 0.0145).toFixed(2));

  // Use per-employee W-4 data from data-* attributes if available
  const w4Status = row.dataset.w4Status || 'single';
  const w4MultiJobs = row.dataset.w4MultiJobs === 'true';
  const w4Dependents = parseFloat(row.dataset.w4Dependents || '0');
  const w4OtherInc = parseFloat(row.dataset.w4OtherInc || '0');
  const w4Deductions = parseFloat(row.dataset.w4Deductions || '0');
  const w4ExtraWH = parseFloat(row.dataset.w4ExtraWh || '0');
  const payFreq = row.dataset.payFrequency || 'bi-weekly';
  const fwh = parseFloat(calcFedWH({
    gross,
    payFrequency: payFreq,
    filingStatus: w4Status,
    multipleJobs: w4MultiJobs,
    dependentsAmt: w4Dependents,
    otherIncome: w4OtherInc,
    deductions: w4Deductions,
    extraWH: w4ExtraWH
  }).toFixed(2));
  const ssEl = row.querySelector('.pr-ss');
  const medEl = row.querySelector('.pr-medicare');
  const fwhEl = row.querySelector('.pr-fedwh');
  if (ssEl && !prGetNum(ssEl)) ssEl.value = ss;
  if (medEl && !prGetNum(medEl)) medEl.value = med;
  if (fwhEl && !prGetNum(fwhEl)) fwhEl.value = fwh;
}
function prRecalcRow(changedInput) {
  const row = changedInput.closest('tr');
  if (!row) return;
  // For hourly employees: auto-fill gross = hours × rate when hours input changes
  if (changedInput.classList.contains('pr-hours') && row.dataset.payType !== 'salary') {
    const rate = parseFloat(row.dataset.rate) || 0;
    const hours = prGetNum(changedInput);
    if (rate && hours) {
      const grossInput = row.querySelector('.pr-gross');
      if (grossInput) grossInput.value = (hours * rate).toFixed(2);
    }
  }
  // When gross changes, auto-fill deductions if they are still zero
  if (changedInput.classList.contains('pr-gross') || changedInput.classList.contains('pr-hours')) {
    prAutoCalcDeductions(row);
  }
  const gross = prGetNum(row.querySelector('.pr-gross'));
  const fedwh = prGetNum(row.querySelector('.pr-fedwh'));
  const ss = prGetNum(row.querySelector('.pr-ss'));
  const med = prGetNum(row.querySelector('.pr-medicare'));
  const stWh = prGetNum(row.querySelector('.pr-statewh'));
  const other = prGetNum(row.querySelector('.pr-otherded'));
  const net = gross - fedwh - ss - med - stWh - other;
  const netCell = row.querySelector('.pr-net-cell');
  if (netCell) netCell.textContent = '$' + Math.max(0, net).toFixed(2);
  prRecalcTotals();
}
function prRecalcTotals() {
  const rows = document.querySelectorAll('#pr-emp-rows tr');
  let totGross = 0,
    totDed = 0,
    totNet = 0;
  rows.forEach(row => {
    const gross = prGetNum(row.querySelector('.pr-gross'));
    const fedwh = prGetNum(row.querySelector('.pr-fedwh'));
    const ss = prGetNum(row.querySelector('.pr-ss'));
    const med = prGetNum(row.querySelector('.pr-medicare'));
    const stWh = prGetNum(row.querySelector('.pr-statewh'));
    const other = prGetNum(row.querySelector('.pr-otherded'));
    const ded = fedwh + ss + med + stWh + other;
    const net = gross - ded;
    // update net cell
    const netCell = row.querySelector('.pr-net-cell');
    if (netCell) netCell.textContent = '$' + Math.max(0, net).toFixed(2);
    totGross += gross;
    totDed += ded;
    totNet += Math.max(0, net);
  });
  const fmtN = n => '$' + n.toFixed(2);
  const tg = document.getElementById('pr-tot-gross');
  if (tg) tg.textContent = fmtN(totGross);
  const td = document.getElementById('pr-tot-ded');
  if (td) td.textContent = fmtN(totDed);
  const tn = document.getElementById('pr-tot-net');
  if (tn) tn.textContent = fmtN(totNet);
}
async function markPayRunPaid(runId) {
  const btn = document.getElementById('prd-mark-paid');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving…';
  }
  const {
    error
  } = await sb.from('pay_runs').update({
    status: 'paid'
  }).eq('id', runId);
  if (error) {
    alert('Error: ' + error.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Mark as Paid';
    }
    return;
  }
  closeModal('prd-backdrop');
  navigateTo('payroll');
}
function deletePayRunDraft(runId) {
  // Replace footer with an inline confirm bar (confirm() is blocked in iframes)
  const footer = document.getElementById('prd-footer');
  if (!footer) return;
  footer.innerHTML = "\\n    <span style=\\"font-size:13px;color:var(--red,#e53e3e);flex:1\\">\\n      ⚠️ Delete this draft permanently?\\n    </span>\\n    <button class=\\"btn btn-secondary\\" id=\\"prd-del-cancel\\">Cancel</button>\\n    <button class=\\"btn btn-primary\\" id=\\"prd-del-confirm\\" style=\\"background:var(--red,#e53e3e)\\">Yes, Delete</button>\\n  ";
  document.getElementById('prd-del-cancel').onclick = () => {
    closeModal('prd-backdrop');
    navigateTo('payroll');
  };
  document.getElementById('prd-del-confirm').onclick = async () => {
    const btn = document.getElementById('prd-del-confirm');
    btn.disabled = true;
    btn.textContent = 'Deleting…';
    const {
      error: lErr
    } = await sb.from('pay_run_lines').delete().eq('pay_run_id', runId);
    if (lErr) {
      footer.innerHTML = "<span style=\\"color:var(--red,#e53e3e)\\">Error: ".concat(lErr.message, "</span>");
      return;
    }
    const {
      error: rErr
    } = await sb.from('pay_runs').delete().eq('id', runId).eq('status', 'draft');
    if (rErr) {
      footer.innerHTML = "<span style=\\"color:var(--red,#e53e3e)\\">Error: ".concat(rErr.message, "</span>");
      return;
    }
    closeModal('prd-backdrop');
    navigateTo('payroll');
  };
}
async function openPayRunDetail(runId, periodStart, periodEnd) {
  try {
    ensureModalStyles();
  } catch (e) {}
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.id = 'prd-backdrop';
  bd.innerHTML = "<div class=\\"modal\\" role=\\"dialog\\" style=\\"max-width:720px;width:98vw\\">\\n    <div class=\\"modal-header\\">\\n      <h3>Pay Run — ".concat(fmtDate(periodStart), " to ").concat(fmtDate(periodEnd), "</h3>\\n      <button class=\\"modal-close\\" onclick=\\"closeModal('prd-backdrop')\\" aria-label=\\"Close\\">×</button>\\n    </div>\\n    <div class=\\"modal-body\\" id=\\"prd-body\\"><div class=\\"loading-block\\"><span class=\\"spinner\\"></span></div></div>\\n    <div class=\\"modal-footer\\" id=\\"prd-footer\\"><button class=\\"btn btn-secondary\\" onclick=\\"closeModal('prd-backdrop')\\">Close</button></div>\\n  </div>");
  document.body.appendChild(bd);
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal('prd-backdrop');
  });

  // Fetch pay run header (for status) and lines in parallel
  const [{
    data: run
  }, {
    data: lines,
    error
  }] = await Promise.all([sb.from('pay_runs').select('status, label').eq('id', runId).single(), sb.from('pay_run_lines').select('*, employees(full_name, pay_type)').eq('pay_run_id', runId).order('employees(full_name)')]);

  // Add draft action buttons if still a draft
  if ((run === null || run === void 0 ? void 0 : run.status) === 'draft') {
    const footer = document.getElementById('prd-footer');
    if (footer) {
      // Delete draft
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-secondary';
      delBtn.style.color = 'var(--red,#e53e3e)';
      delBtn.style.borderColor = 'var(--red,#e53e3e)';
      delBtn.textContent = '🗑 Delete Draft';
      delBtn.onclick = () => deletePayRunDraft(runId);
      footer.insertBefore(delBtn, footer.firstChild.nextSibling); // after Close btn

      // Mark as Paid
      const payBtn = document.createElement('button');
      payBtn.id = 'prd-mark-paid';
      payBtn.className = 'btn btn-primary';
      payBtn.style.background = 'var(--green)';
      payBtn.textContent = '✓ Mark as Paid';
      payBtn.onclick = () => markPayRunPaid(runId);
      footer.appendChild(payBtn);
    }
  }
  const body = document.getElementById('prd-body');
  if (error || !lines || !lines.length) {
    body.innerHTML = '<p style="color:var(--muted);text-align:center;padding:24px">No employee lines found for this pay run.</p>';
    return;
  }
  const fmtN = n => '$' + parseFloat(n || 0).toFixed(2);
  const statusBadge = run ? "<span class=\\"badge badge-".concat(run.status === 'paid' ? 'green' : 'gold', "\\" style=\\"margin-left:8px\\">").concat(run.status, "</span>") : '';
  body.innerHTML = "\\n    <div style=\\"margin-bottom:12px;font-size:13px;color:var(--muted)\\">\\n      ".concat(run && run.label ? "<strong>".concat(esc(run.label), "</strong> · ") : '', "Status: ").concat(statusBadge, "\\n    </div>\\n    <div style=\\"overflow-x:auto\\">\\n    <table style=\\"width:100%;font-size:13px;border-collapse:collapse\\">\\n      <thead><tr style=\\"border-bottom:2px solid var(--border)\\">\\n        <th style=\\"text-align:left;padding:7px 8px\\">Employee</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">Hours</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">Gross</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">Fed WH</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">SS</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">Medicare</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">State WH</th>\\n        <th style=\\"padding:7px 4px;text-align:right\\">Other</th>\\n        <th style=\\"padding:7px 8px;text-align:right;color:var(--green)\\">Net Pay</th>\\n      </tr></thead>\\n      <tbody>\\n        ").concat(lines.map(l => "<tr style=\\"border-bottom:1px solid var(--border)\\">\\n          <td style=\\"padding:6px 8px;font-weight:600\\">".concat(esc((l.employees ? l.employees.full_name : '') || '—'), "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;color:var(--muted)\\">").concat(l.hours ? l.hours : '—', "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(l.gross_pay), "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(l.fed_wh), "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(l.ss_ee), "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(l.medicare_ee), "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(l.state_wh), "</td>\\n          <td style=\\"padding:6px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(l.other_deduct), "</td>\\n          <td style=\\"padding:6px 8px;text-align:right;font-weight:700;color:var(--green);font-variant-numeric:tabular-nums\\">").concat(fmtN(l.net_pay), "</td>\\n        </tr>")).join(''), "\\n      </tbody>\\n      <tfoot><tr style=\\"border-top:2px solid var(--border);font-weight:700\\">\\n        <td style=\\"padding:7px 8px\\">Totals</td>\\n        <td></td>\\n        <td style=\\"padding:7px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.gross_pay || 0), 0)), "</td>\\n        <td style=\\"padding:7px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.fed_wh || 0), 0)), "</td>\\n        <td style=\\"padding:7px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.ss_ee || 0), 0)), "</td>\\n        <td style=\\"padding:7px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.medicare_ee || 0), 0)), "</td>\\n        <td style=\\"padding:7px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.state_wh || 0), 0)), "</td>\\n        <td style=\\"padding:7px 4px;text-align:right;font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.other_deduct || 0), 0)), "</td>\\n        <td style=\\"padding:7px 8px;text-align:right;color:var(--green);font-variant-numeric:tabular-nums\\">").concat(fmtN(lines.reduce((s, l) => s + parseFloat(l.net_pay || 0), 0)), "</td>\\n      </tr></tfoot>\\n    </table></div>");
}
async function savePayRun(status) {
  const errEl = document.getElementById('pr-error');
  errEl.textContent = '';
  try {
    var _document$getElementB6, _STATE$staffRow2;
    const start = document.getElementById('pr-start').value;
    const end = document.getElementById('pr-end').value;
    const clientId = ((_document$getElementB6 = document.getElementById('pr-client')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || STATE.selectedClientId || null;
    if (!clientId) {
      errEl.textContent = 'Please select a client.';
      return;
    }
    if (!start || !end) {
      errEl.textContent = 'Period start and end are required.';
      return;
    }

    // Collect employee lines from DOM
    const empRows = document.querySelectorAll('#pr-emp-rows tr');
    if (!empRows.length) {
      errEl.textContent = 'No employees loaded. Please select a client with active employees.';
      return;
    }
    const lines = Array.from(empRows).map(row => {
      const empId = row.dataset.empId;
      const gross = prGetNum(row.querySelector('.pr-gross'));
      const fedwh = prGetNum(row.querySelector('.pr-fedwh'));
      const ss = prGetNum(row.querySelector('.pr-ss'));
      const med = prGetNum(row.querySelector('.pr-medicare'));
      const stWh = prGetNum(row.querySelector('.pr-statewh'));
      const other = prGetNum(row.querySelector('.pr-otherded'));
      const hours = prGetNum(row.querySelector('.pr-hours'));
      const net = Math.max(0, gross - fedwh - ss - med - stWh - other);
      return {
        employee_id: empId,
        gross_pay: gross,
        fed_wh: fedwh,
        ss_ee: ss,
        medicare_ee: med,
        state_wh: stWh,
        other_deduct: other,
        net_pay: net,
        hours: hours || null
      };
    }).filter(l => l.gross_pay > 0); // only include employees with a gross entered

    if (!lines.length) {
      errEl.textContent = 'Please enter gross pay for at least one employee.';
      return;
    }
    const totalGross = lines.reduce((s, l) => s + l.gross_pay, 0);
    const totalNet = lines.reduce((s, l) => s + l.net_pay, 0);
    const btnId = status === 'draft' ? 'pr-draft' : 'pr-paid';
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.textContent = 'Saving…';

    // Insert pay_run header
    const {
      data: runData,
      error: runErr
    } = await sb.from('pay_runs').insert({
      client_id: clientId,
      period_start: start,
      period_end: end,
      pay_date: document.getElementById('pr-paydate').value || null,
      label: document.getElementById('pr-freq').value,
      total_gross: totalGross,
      total_net: totalNet,
      created_by: ((_STATE$staffRow2 = STATE.staffRow) === null || _STATE$staffRow2 === void 0 ? void 0 : _STATE$staffRow2.id) || null,
      status
    }).select('id').single();
    if (runErr) {
      errEl.textContent = 'Error: ' + runErr.message;
      btn.disabled = false;
      btn.textContent = status === 'draft' ? 'Save Draft' : 'Mark as Paid';
      return;
    }

    // Insert pay_run_lines
    const lineRows = lines.map(l => ({
      ...l,
      pay_run_id: runData.id
    }));
    const {
      error: lineErr
    } = await sb.from('pay_run_lines').insert(lineRows);
    if (lineErr) {
      errEl.textContent = 'Pay run saved but employee lines failed: ' + lineErr.message;
      btn.disabled = false;
      btn.textContent = status === 'draft' ? 'Save Draft' : 'Mark as Paid';
      return;
    }
    closeModal('pr-backdrop');
    navigateTo('payroll');
  } catch (e) {
    errEl.textContent = 'Unexpected error: ' + e.message;
  }
}

</script>
</body>
</html>
`;

export default {
  async fetch(request, env, ctx) {
    return new Response(HTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  }
};
