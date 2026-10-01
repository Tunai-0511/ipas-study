(function (global) {
  'use strict';
  var SB_URL = "https://mugrltimxkvlqyksymjq.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3JsdGlteGt2bHF5a3N5bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTY0MDgsImV4cCI6MjA5OTIzMjQwOH0.OfJpNubw7WNF4ca56LZT_oWawiJlZm10Fm1l7rbRI8s";
  var sb = global.supabase.createClient(SB_URL, SB_KEY);
  var observedUserId = null, stopped = false;
  global.IpasClient = sb;

  function invalidate(reload) {
    if (stopped) return;
    stopped = true;
    global.IpasCatalogUser = null;
    document.documentElement.setAttribute('data-auth-pending', '');
    document.getElementById('accountName').textContent = '';
    var mount = document.getElementById('catalogApp');
    if (mount) mount.textContent = '登入帳戶已變更，正在重新載入…';
    document.dispatchEvent(new Event('catalog-auth-invalidated'));
    if (reload) location.reload();
  }

  // Auth events also arrive from other tabs. Never call an Auth method while its lock is held.
  sb.auth.onAuthStateChange(function (event, session) {
    if (stopped) return;
    if (event === 'SIGNED_OUT') { invalidate(false); return; }
    var id = session && session.user && session.user.id;
    if (!id) return;
    if (observedUserId && id !== observedUserId) { invalidate(true); return; }
    observedUserId = id;
  });
  global.IpasAuth.check(sb).then(function (allowed) {
    if (!allowed || stopped) return;
    return sb.auth.getSession().then(function (result) {
      if (stopped) return;
      if (result.error) throw result.error;
      var user = result.data && result.data.session && result.data.session.user;
      if (!user || (observedUserId && user.id !== observedUserId)) { invalidate(true); return; }
      observedUserId = user.id;
      global.IpasCatalogUser = user;
      var saved = '';
      try { if (localStorage.getItem('ipas_shared_name_owner') === user.id) saved = localStorage.getItem('ipas_shared_name') || ''; } catch (_) {}
      document.getElementById('accountName').textContent = saved || (user.user_metadata || {}).full_name || (user.user_metadata || {}).name || (user.email || '').split('@')[0];
      document.dispatchEvent(new Event('catalog-auth-ready'));
    });
  }).catch(function () {
    invalidate(false);
    var message = document.getElementById('authMessage'), retry = document.getElementById('authRetry');
    if (message) message.textContent = '目前無法確認登入帳戶，請重新載入。';
    if (retry) { retry.hidden = false; retry.onclick = function () { location.reload(); }; }
  });
})(window);
