// Text helpers shared by the page renderer (server), the save API and the editor in the browser.

const DANGER = /<\s*\/?\s*(script|style|iframe|frame|object|embed|link|meta|base|form|input|textarea|select|button|dialog|template)\b[^>]*>/gi;

// Editors may use simple inline HTML. Remove anything that could run code or break out of the page.
export function clean(s) {
  s = String(s ?? '');
  if (s.indexOf('<') < 0) return s;
  return s.replace(DANGER, '').replace(/<[^>]+>/g, tag => tag
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\b(href|src|xlink:href|action|formaction)\s*=\s*(["']?)\s*(javascript|vbscript|data):[^"'\s>]*/gi, '$1=$2#'));
}

const VOID = new Set(['br', 'wbr', 'img', 'hr']);
// Returns a message when inline HTML is not properly closed, e.g. "<b> is not closed".
export function checkTags(s) {
  const st = [], re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g; let m;
  const str = String(s ?? '');
  if (/<[^>]*$/.test(str.replace(/<[^>]*>/g, ''))) return 'a “<” is not closed with “>”';
  while ((m = re.exec(str))) {
    const name = m[2].toLowerCase();
    if (VOID.has(name) || m[3]) continue;
    if (!m[1]) st.push(name);
    else if (st[st.length - 1] === name) st.pop();
    else return st.length ? '<' + st[st.length - 1] + '> is closed by </' + name + '>' : '</' + name + '> has no opening <' + name + '>';
  }
  return st.length ? '<' + st[st.length - 1] + '> is not closed' : null;
}

// Typography for text an editor has just changed: keep times with am/pm (and “19 h 30”) together, and stop a single
// short last word from sitting alone on the last line. Works on the text between tags only.
export function typo(s) {
  s = String(s ?? '');
  const parts = s.split(/(<[^>]*>)/);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = parts[i]
      .replace(/(\d)[ \u00a0]+(am|pm|a\.m\.|p\.m\.)(?![a-z])/gi, '$1&nbsp;$2')
      .replace(/(\d)[ \u00a0]+h(?![a-zA-Zàâéèêëîïôûùüç])/g, '$1&nbsp;h')
      .replace(/(\d&nbsp;h) (\d\d)\b/g, '$1&nbsp;$2');
  }
  s = parts.join('');
  const text = s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '\u00a0');
  const words = text.trim().split(/[ \t\n]+/).filter(Boolean);
  if (words.length < 4 || words[words.length - 1].length > 12) return s;
  let inTag = false, at = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '<') inTag = true; else if (c === '>') inTag = false;
    else if (c === ' ' && !inTag && /\S/.test(s.slice(i + 1).replace(/<[^>]*>/g, ''))) at = i;
  }
  return at > 0 ? s.slice(0, at) + '&nbsp;' + s.slice(at + 1) : s;
}
