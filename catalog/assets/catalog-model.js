(function (global) {
  'use strict';
  function subjects(cert) {
    return (cert.levels || []).flatMap(function (level) {
      return (level.subjects || []).map(function (subject) { return Object.assign({}, subject, { levelId: level.id, levelName: level.name }); });
    });
  }
  function matches(cert, filter) {
    var all = subjects(cert), text = [cert.name, cert.officialCode, cert.category].concat(cert.aliases || [], all.map(function (s) { return s.name; })).join(' ').toLowerCase();
    var query = (filter.query || '').trim().toLowerCase().replace(/資安/g, '資訊安全');
    return (!filter.status || cert.status === filter.status) && (!query || text.includes(query)) &&
      (!filter.category || cert.category === filter.category) &&
      (!filter.level || (cert.levels || []).some(function (l) { return l.id === filter.level; }));
  }
  function safeUrl(value) {
    try { var url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch (_) { return ''; }
  }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  global.IpasCatalog = { subjects: subjects, matches: matches, safeUrl: safeUrl, esc: esc };
})(typeof window === 'undefined' ? globalThis : window);
