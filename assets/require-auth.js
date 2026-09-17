/* Require an active login before starting any study app. */
(function (global) {
  "use strict";
  var client = null, checking = null, settled = false, stopped = false;
  var generation = 0, resolveReady;
  var ready = new Promise(function (resolve) { resolveReady = resolve; });

  function pending(message) {
    document.documentElement.setAttribute("data-auth-pending", "");
    var label = document.getElementById("authMessage");
    if (label) label.textContent = message;
  }
  function finish(allowed) {
    if (!settled) { settled = true; resolveReady(allowed); }
  }
  function deny(redirect) {
    if (stopped) return false;
    stopped = true; generation++;
    clearTimeout(watchdog);
    pending(redirect ? "請先登入，正在返回登入頁…" : "目前無法確認登入狀態，請重新確認或返回登入頁。");
    var retry = document.getElementById("authRetry");
    if (retry) { retry.hidden = !!redirect; retry.onclick = function () { location.reload(); }; }
    finish(false);
    if (redirect) location.replace("/");
    return false;
  }
  var watchdog = setTimeout(function () { deny(false); }, 12000);
  // Retire the old opt-out flag without deleting local names or learning records.
  try { localStorage.removeItem("ipas_guest"); } catch (e) {}
  try { sessionStorage.removeItem("ipas_guest"); } catch (e) {}

  function verify() {
    if (stopped) return Promise.resolve(false);
    if (checking) return checking;
    var attempt = ++generation;
    pending("正在確認登入狀態…");
    clearTimeout(watchdog);
    watchdog = setTimeout(function () { deny(false); }, 12000);
    checking = Promise.resolve().then(function () {
      return client.auth.initialize();
    }).then(function (result) {
      if (result && result.error) throw result.error;
      return client.auth.getSession();
    }).then(function (result) {
      if (stopped || attempt !== generation) return false;
      if (result.error) throw result.error;
      var session = result.data && result.data.session;
      if (!session || !session.user) return deny(true);
      // The SDK restores or refreshes the login. Keep valid saved sessions usable offline;
      // server-side RLS continues to authorize every cloud-data request independently.
      clearTimeout(watchdog);
      document.documentElement.removeAttribute("data-auth-pending");
      finish(true);
      return true;
    }).catch(function () { return deny(false); }).finally(function () { checking = null; });
    return checking;
  }

  function check(sb) {
    if (!client) {
      client = sb;
      // Do not call another Auth method from this callback: the SDK holds its auth lock.
      client.auth.onAuthStateChange(function (event) {
        if (event === "SIGNED_OUT") deny(true);
      });
      global.addEventListener("pageshow", function (event) { if (event.persisted) verify(); });
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") verify();
      });
      global.addEventListener("storage", function (event) {
        if (event.key === null || /^sb-.*-auth-token$/.test(event.key || "")) verify();
      });
    }
    return verify();
  }
  global.IpasAuth = { ready: ready, check: check };
})(window);
