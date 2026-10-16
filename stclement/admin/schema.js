// What the editor shows, in page order. Shared by the editor (browser), the save API (server) and the seed extraction.
// Field types:  bi    English + French side by side (simple inline HTML allowed)    pair  the same, stored as key_en / key_fr
//               str   one line of text      text  several lines      url  a link      tel/email  phone number / e-mail address
//               file  a file or image path picked from the media library      image  photo with description (alt text)
//               bool  yes / no      select  one of `options`      time  HH:MM (24 h)      date  YYYY-MM-DD      num  number
//               obj   a group of fields      list  add / remove / reorder items (`fields`, or `of` for a list of single values)
// `adv: true` hides a field behind “Show layout settings”; `clears` empties sibling fields when an image is replaced.

const bi = (key, label, o = {}) => ({ key, label, type: 'bi', ...o });
const str = (key, label, o = {}) => ({ key, label, type: 'str', ...o });
const url = (key, label, o = {}) => ({ key, label, type: 'url', ...o });
const bool = (key, label, o = {}) => ({ key, label, type: 'bool', ...o });
const img = (key, label, o = {}) => ({ key, label, type: 'image', ...o });
const obj = (key, label, fields, o = {}) => ({ key, label, type: 'obj', fields, ...o });
const list = (key, label, fields, o = {}) => ({ key, label, type: 'list', fields, ...o });
const pair = (key, label, o = {}) => ({ key, label, type: 'pair', ...o });
const time = (key, label, o = {}) => ({ key, label, type: 'time', ...o });
const date = (key, label, o = {}) => ({ key, label, type: 'date', ...o });
const adv = f => ({ ...f, adv: true });
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ICONS = ['', 'clock', 'gmap', 'pin', 'book', 'phone', 'mail', 'music', 'people', 'heart', 'card', 'bank', 'xfer', 'yt'];
const next = bi('next', '“Next” link at the bottom of the section', { help: 'Short name of the following section.' });
const NAVF = [bi('label', 'Label'), url('href', 'Goes to', { help: 'A section of the page such as #mass, or a full https:// link.' })];

export const FILES = {
  site: [
    obj('seo', 'Search engines & sharing', [
      bi('title', 'Browser tab / Google title', { plain: true }),
      { key: 'description', label: 'Google description (English)', type: 'text', plain: true },
      str('og_title', 'Title when shared on social media', { plain: true }),
      { key: 'og_description', label: 'Description when shared on social media', type: 'text', plain: true },
      { key: 'og_image', label: 'Image when shared on social media', type: 'file', accept: 'image' },
    ]),
    obj('brand', 'Parish name in the header', [bi('name', 'Name'), bi('sub', 'Second line')]),
    list('nav', 'Top menu (wide screens)', NAVF, { summary: 'label' }),
    list('drawer', 'Menu (phones and the ☰ button)', NAVF, { summary: 'label' }),
    obj('donate', 'Donate button', [url('url', 'Donation page'), bi('short', 'Header button label'), bi('long', 'Menu button label')]),
    bi('skip', 'Hidden “skip to Mass times” link (keyboard users)'),
    { key: 'phone', label: 'Main phone number, as shown', type: 'str', help: 'Example: (613)&nbsp;565-9656. Shown in Contact, Clergy, Sacraments and the footer.' },
    { key: 'tel', label: 'Main phone number, for dialling', type: 'tel', help: 'International format without spaces, e.g. +16135659656. Extensions are added automatically.' },
    { key: 'email', label: 'Parish office e-mail', type: 'email' },
    obj('address', 'Street address', [bi('street', 'Street'), bi('city', 'City, province, postal code')]),
    obj('maps', 'Google Maps links', [
      url('directions', 'Directions link'), url('search', 'Place / reviews link'), url('embed', 'Embedded map (iframe address)'),
    ]),
    obj('social', 'Social media', [url('instagram', 'Instagram'), url('facebook', 'Facebook'), url('youtube', 'YouTube channel')]),
    url('flocknote', 'Flocknote (e-mail news) sign-up page'),
    obj('mbar', 'Bottom bar on phones', [bi('mass', 'Mass times button'), bi('directions', 'Directions button'), bi('donate', 'Donate button')]),
    bi('next', 'Word above every “Next” link'),
  ],
  hero: [
    list('slides', 'Slideshow photos', [
      img('img', 'Photo (wide screens)', { help: 'Landscape, at least 2400 px wide. The first photo loads first, so keep it light.', clears: ['mimg'] }),
      img('mimg', 'Photo for phones (optional)', { noalt: true, help: 'Portrait, about 1000 × 1778 px. Leave empty to use the wide photo.' }),
      adv(str('pos', 'Focal point', { help: 'Horizontal and vertical position of the subject, e.g. 50% 50%.', def: '50% 50%' })),
      adv(str('pan', 'Slow-zoom end point (wide)', { def: '50% 50%' })),
      adv(str('pan_m', 'Slow-zoom end point (phones)', { def: '50% 50%' })),
    ], { summary: 'img.alt', help: 'The first photo is shown immediately; the others fade in one after another.' }),
    list('kicker', 'Small line above the title', null, { of: bi(null, 'Item'), help: 'Shown as “Traditional Latin Mass · Ottawa · FSSP”.' }),
    bi('title', 'Main title'),
    bi('subtitle', 'Title, second line'),
    bi('lead', 'Introduction', { long: true }),
    list('buttons', 'Buttons', [
      bi('label', 'Label'), url('url', 'Goes to'), bool('newtab', 'Open in a new tab'),
      { key: 'style', label: 'Style', type: 'select', options: [['bg', 'Gold (main)'], ['bo', 'Outline']], def: 'bo' },
      { key: 'icon', label: 'Icon', type: 'select', options: ICONS.map(i => [i, i || '(none)']) },
    ], { summary: 'label' }),
    bi('rating', 'Google rating line'),
    list('logos', 'Affiliation logos (scrolling strip)', [
      bi('title', 'Name', { plain: true, help: 'Also used as the image description.' }),
      url('url', 'Link'), bool('newtab', 'Open in a new tab'),
      img('img', 'Logo', { noalt: true, help: 'PNG or WebP with a transparent background.' }),
      adv(str('h', 'Logo height', { def: '40px' })),
      adv({ key: 'cls', label: 'Logo colour treatment', type: 'select', options: [['gb', 'Gold badge'], ['wm', 'Wordmark'], ['ga', 'Gold, alternative'], ['gs', 'Gold shield']], def: 'gb' }),
      adv(str('sizes', 'Image sizes', { def: '(max-width:759px) 40px, 56px' })),
    ], { summary: 'title' }),
  ],
  new: [
    img('photo', 'Photo'), bi('caption', 'Photo caption'),
    bi('heading', 'Heading'), bi('lead', 'Introduction', { long: true }),
    list('tips', 'Tips (numbered automatically)', [
      bi('title', 'Title'), bi('text', 'Text', { long: true }), bool('general', 'Mark as “general” (common practice, not a parish rule)'),
    ], { summary: 'title' }),
    bi('general', 'Word shown on “general” tips'),
    bi('note', 'Note under the tips', { long: true }),
    next,
  ],
  gallery: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'),
    list('photos', 'Photos', [
      img('img', 'Photo', { clears: ['full'] }), bi('caption', 'Caption'),
      { key: 'layout', label: 'Tile size', type: 'select', options: [['', 'Normal'], ['w2 w2l', 'Wide'], ['w2 w2l t2l', 'Wide and tall'], ['t2 t2l', 'Tall']] },
      adv({ key: 'full', label: 'Large version for the photo viewer', type: 'file', accept: 'image', help: 'Leave empty to use the photo itself.' }),
      adv(str('sizes', 'Image sizes', { def: '(min-width:1350px) 290px, (min-width:900px) 21.5vw, 44.5vw' })),
    ], { summary: 'caption' }),
    bi('instagram', 'Instagram button label'),
  ],
  reviews: [
    bi('score', 'Google score'), bi('count', 'Number of reviews'), bi('heading', 'Heading'),
    list('items', 'Reviews', [bi('quote', 'Quotation', { long: true }), str('name', 'Reviewer')], { summary: 'name' }),
    bi('note', 'Note under the reviews'), bi('all', '“Read all reviews” link'),
  ],
  bands: [
    obj('intro', 'Photo band after the reviews', [
      img('img', 'Photo (wide screens)', { clears: ['mimg'] }), img('mimg', 'Photo for phones (optional)', { noalt: true }),
      str('latin', 'Latin line', { html: true }), bi('translation', 'Translation'), str('label', 'Name for screen readers', { plain: true }),
    ]),
    obj('motto', 'Photo band after History (parish motto)', [
      img('img', 'Photo (wide screens)', { clears: ['mimg'] }), img('mimg', 'Photo for phones (optional)', { noalt: true }),
      str('latin', 'Latin line', { html: true }), bi('translation', 'Translation'), str('label', 'Name for screen readers', { plain: true }),
    ]),
  ],
  mass: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'),
    obj('labels', 'Card headings and links', [
      bi('sunday', 'Sunday card heading'), bi('weekdays', 'Weekday card heading'), bi('confession', 'Confession card heading'),
      bi('appt', 'Confession by appointment (phone link)'), bi('readings', '“Today’s readings” link label'),
    ]),
    url('readings_url', '“Today’s readings” link'),
  ],
  watch: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'), bi('lead', 'Introduction', { long: true }),
    obj('video', 'Featured video', [
      str('id', 'YouTube video ID', { help: 'The part after watch?v= in the YouTube address, e.g. mcsCPLC6r6Y.' }),
      bi('title', 'Video title', { plain: true }), bi('label', 'Small line above the title'),
    ]),
    img('thumb', 'Video preview picture', { help: '16 : 9, at least 1280 × 720 px.' }),
    bi('channel', 'YouTube channel button'),
    obj('livemass', 'LiveMass.net button', [url('url', 'Link'), bi('label', 'Label'), bi('title', 'Tooltip', { plain: true })]),
    list('links', 'Other buttons', [bi('label', 'Label'), url('url', 'Link')], { summary: 'label' }),
    next,
  ],
  visit: [
    img('img', 'Photo (wide screens)', { clears: ['mimg'] }), img('mimg', 'Photo for phones (optional)', { noalt: true }),
    list('since', 'Large heading lines', null, { of: bi(null, 'Line'), help: 'Use <b>…</b> for the gold part, e.g. St. Anne Church <b>since 1873</b>.' }),
    bi('eyebrow', 'Small heading'), bi('note', 'Text'), bi('directions', 'Directions button'), bi('caption', 'Photo caption'),
  ],
  sacraments: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'),
    list('cards', 'Cards', [
      bi('tag', 'Small label'), bi('title', 'Title'), bi('text', 'Text', { long: true }),
      img('img', 'Photo (optional)', { help: 'Landscape, 2 : 1, at least 1100 × 550 px.' }),
      str('ext', 'Phone extension (optional)', { help: 'Shows a “(613) 565-9656, ext. …” button.' }),
      bool('emergency', 'Emergency card (red, e.g. Last Rites)'),
      adv(str('credit', 'Photo credit (tooltip)', { plain: true })),
      adv(str('pos', 'Photo focal point', { def: '50% 50%' })),
      adv(str('anchor', 'Anchor name (for links such as #confirmation)', { plain: true })),
    ], { summary: 'title' }),
    bi('note', 'Note under the cards', { long: true }),
    next,
  ],
  life: [
    img('photo', 'Photo'), adv(str('photo_pos', 'Photo focal point', { def: '50% 50%' })),
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'), bi('lead', 'Introduction', { long: true }),
    bi('flocknote', 'Flocknote button'), bi('upcoming', '“Coming up” heading', { help: 'The events themselves are under “Upcoming events”.' }),
    list('groups', 'Groups', [
      bi('name', 'Name'), bi('text', 'Details', { long: true }),
      img('img', 'Picture', { noalt: true, help: 'Square, at least 240 × 240 px.' }),
      { key: 'icon', label: 'Or an icon instead of a picture', type: 'select', options: [['', '(use the picture)'], ['music', 'Music'], ['people', 'People'], ['heart', 'Heart'], ['book', 'Book']] },
      adv({ key: 'cls', label: 'Picture style', type: 'select', options: [['gt', 'Photo'], ['gt gl2 gd', 'Round logo'], ['gt gl2', 'Logo']], def: 'gt' }),
      adv(str('sizes', 'Image sizes', { def: '56px' })),
    ], { summary: 'name' }),
    next,
  ],
  clergy: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'),
    list('priests', 'Priests', [bi('name', 'Name'), bi('role', 'Role'), str('ext', 'Phone extension')], { summary: 'name' }),
    obj('fssp', 'About the FSSP', [
      bi('name', 'Name'), bi('founded', 'Founded'), bi('alt', 'Emblem description', { plain: true }),
      bi('heading', 'Heading'), bi('intro', 'First paragraph', { long: true }), bi('mission', 'Second paragraph', { long: true }),
      list('links', 'Links', [bi('label', 'Label'), url('url', 'Link'), url('url_fr', 'Link for the French page (optional)')], { summary: 'label' }),
    ]),
    next,
  ],
  history: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'), bi('lead', 'Introduction', { long: true }),
    list('timeline', 'Milestones', [str('year', 'Year'), bi('text', 'Text', { long: true })], { summary: 'year' }),
    bi('quote', 'Quotation'), str('cite', 'Source of the quotation', { html: true, help: 'Use <i>…</i> for a book title.' }),
    bi('arms_alt', 'Coat of arms: description', { plain: true }), bi('arms_caption', 'Coat of arms: caption'),
    list('wins', 'Photos', [
      img('img', 'Photo'), bi('caption', 'Caption'), bool('wide', 'Wide tile'),
      adv(str('style', 'Extra photo style', { plain: true, help: 'e.g. object-position:40% 60%' })),
      adv(str('sizes', 'Image sizes', { def: '(min-width:1340px) 235px, (min-width:1000px) 17.5vw, 44.5vw' })),
    ], { summary: 'caption' }),
    next,
  ],
  give: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'), img('photo', 'Photo'), bi('lead', 'Introduction', { long: true }),
    bi('donate', 'Donate button label', { help: 'The link itself is under Site settings › Donate button.' }),
    list('ways', 'Ways to give', [
      bi('title', 'Title'),
      { key: 'icon', label: 'Icon', type: 'select', options: [['interac', 'Interac logo'], ['card', 'Card'], ['bank', 'Bank'], ['mail', 'Envelope'], ['xfer', 'Transfer'], ['heart', 'Heart']], def: 'card' },
      list('copy', 'Copyable details', [bi('label', 'Label'), str('value', 'Value'), bi('aria', '“Copy” button description', { plain: true })], { summary: 'label' }),
      list('paras', 'Paragraphs', null, { of: bi(null, 'Paragraph', { long: true }) }),
      obj('link', 'Link at the bottom (optional)', [bi('label', 'Label'), url('url', 'Link'), url('url_fr', 'Link for the French page (optional)')]),
    ], { summary: 'title' }),
    obj('camp', 'Capital campaign', [
      bi('eyebrow', 'Small heading'), bi('heading', 'Heading'),
      img('img', 'Picture', { clears: ['large'] }), { key: 'large', label: 'Large version for the viewer', type: 'file', accept: 'image', help: 'Leave empty to use the picture itself.' },
      bi('caption', 'Caption'),
      bi('amount', 'Amount raised'), bi('amount_label', 'Line under the amount'),
      { key: 'percent', label: 'Progress bar (percent)', type: 'num', min: 0, max: 100 },
      bi('reached', 'Percent reached label'), bi('goal', 'Goal label'), bi('bar_label', 'Progress bar description', { plain: true }),
      bi('note', 'Note', { long: true }), bi('source', 'Source of the figure'),
      obj('pledge', 'Pledge button', [bi('label', 'Label'), url('url', 'Link')]),
      bi('design', '“See the design” button'),
    ]),
  ],
  news: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'),
    img('photo', 'Photo'), bi('stay_heading', '“Stay in touch” heading'), bi('stay_lead', '“Stay in touch” text', { long: true }),
    bi('flocknote', 'Flocknote button'),
  ],
  contact: [
    bi('eyebrow', 'Small heading'), bi('heading', 'Heading'), bi('hours', 'Office hours (under the phone number)'),
    bi('email_label', 'Line under the e-mail address'),
    bi('map_button', 'Map button'), bi('map_title', 'Map description', { plain: true }),
    bi('ext_heading', 'Extensions heading'), bi('ext_note', 'Line under the phone number'),
    list('extensions', 'Phone extensions', [
      bi('label', 'Name'), bi('sub', 'Second line (optional)'), str('ext', 'Extension'), bool('emergency', 'Emergency (red)'),
    ], { summary: 'label' }),
  ],
  footer: [
    bi('name1', 'Parish name, first line'), bi('name2', 'Parish name, second line'),
    bi('since1', '“Since” line 1'), bi('since2', '“Since” line 2'), bi('tagline', 'Tagline'),
    bi('arms_alt', 'Coat of arms description', { plain: true }),
    bi('visit_heading', '“Visit” heading'),
    bi('parish_heading', '“Parish” heading'),
    list('parish', '“Parish” links', [bi('label', 'Label'), url('url', 'Goes to'), bool('newtab', 'Open in a new tab')], { summary: 'label' }),
    bi('links_heading', '“Links” heading'),
    list('links', '“Links” links', [bi('label', 'Label'), url('url', 'Goes to'), bool('newtab', 'Open in a new tab')], { summary: 'label' }),
    bi('fssp_name', 'FSSP name'), str('fssp_small', 'FSSP second line'), bi('fssp_alt', 'FSSP emblem description', { plain: true }),
    list('fssp_links', 'FSSP links', [str('label', 'Label'), url('url', 'Link'), url('url_fr', 'Link for the French page (optional)')], { summary: 'label' }),
    bi('copyright', 'Copyright line'), bi('top', '“Back to top” link'),
  ],
  bulletins: [
    list('items', 'Bulletins', [
      date('date', 'Sunday date'), pair('title', 'Title'),
      { key: 'pdf', label: 'Bulletin PDF', type: 'file', accept: 'pdf', help: 'Upload the PDF, or paste a link to it.' },
    ], { summary: 'date', addTop: true, help: 'The two most recent are shown; the newest is labelled “latest”.' }),
  ],
  schedule: [
    list('sunday', 'Sunday Masses', [time('time', 'Time'), pair('label', 'Name'), bool('livestream', 'Livestreamed')], { summary: 'time' }),
    list('weekdays', 'Weekday Masses', [
      { key: 'day', label: 'Day', type: 'select', options: DAYS.slice(0, 6).map(d => [d, d]), def: 'Monday' },
      list('times', 'Mass times', null, { of: time(null, 'Time') }),
    ], { summary: 'day' }),
    obj('confession', 'Confession', [
      { key: 'day', label: 'Day', type: 'select', options: DAYS.map(d => [d, d]), def: 'Saturday' },
      time('start', 'Starts'), time('end', 'Ends (optional)'),
      pair('also', 'Note', { long: true }), pair('exceptions', 'Exceptions', { long: true }),
    ]),
    list('devotions', 'Devotions', [pair('title', 'Title'), pair('text', 'Details', { long: true })], { summary: 'title_en' }),
  ],
  week: [
    date('source_bulletin', 'Taken from the bulletin dated (optional)', { help: 'Leave empty to use the newest bulletin.' }),
    list('days', 'Days', [
      date('date', 'Date'), pair('feast', 'Feast / day'),
      list('masses', 'Masses and services', [time('time', 'Time'), pair('note', 'Label (only for non-Mass items, e.g. Confessions)')], { summary: 'time' }),
    ], { summary: 'date', help: 'Usually 7 days, Monday to Sunday. The heading and day names are generated from the dates.' }),
  ],
  events: [
    list('items', 'Events', [
      date('date', 'Date'), time('time', 'Time (optional)'), pair('title', 'Title'), pair('text', 'Description', { long: true }),
      { key: 'image', label: 'Photo (optional)', type: 'file', accept: 'image', clears: ['srcset', 'width', 'height'], help: 'Landscape, about 1100 × 700 px.' },
      pair('image_alt', 'Photo description', { plain: true }),
      url('link_url', 'Link (optional)', { help: 'https://… for tickets, or mailto:name@example.com' }), pair('link_label', 'Link text'),
      { key: 'srcset', type: 'hidden' }, { key: 'width', type: 'hidden' }, { key: 'height', type: 'hidden' },
    ], { summary: 'date', help: 'The next three upcoming events are shown; past events hide automatically.' }),
  ],
};

// Sidebar, in page order. Each entry edits some or all of the top-level fields of one content file.
export const NAV = [
  { group: 'Whole site' },
  { id: 'seo', label: 'Search engines & sharing', file: 'site', keys: ['seo'] },
  { id: 'contactinfo', label: 'Phone, e-mail, address, links', file: 'site', keys: ['phone', 'tel', 'email', 'address', 'maps', 'social', 'flocknote'] },
  { group: 'Page, top to bottom' },
  { id: 'header', label: 'Header & menus', file: 'site', keys: ['brand', 'nav', 'drawer', 'donate', 'skip'] },
  { id: 'hero', label: 'Welcome (slideshow)', file: 'hero' },
  { id: 'new', label: 'First visit', file: 'new' },
  { id: 'gallery', label: 'Photo gallery', file: 'gallery' },
  { id: 'reviews', label: 'Reviews', file: 'reviews' },
  { id: 'band1', label: 'Photo band (Introibo)', file: 'bands', keys: ['intro'] },
  { id: 'mass', label: 'Mass times: headings', file: 'mass' },
  { id: 'schedule', label: 'Mass & confession times', file: 'schedule', sub: true },
  { id: 'week', label: 'This week', file: 'week', sub: true },
  { id: 'watch', label: 'Livestream', file: 'watch' },
  { id: 'visit', label: 'Find the church', file: 'visit' },
  { id: 'sacraments', label: 'Sacraments', file: 'sacraments' },
  { id: 'life', label: 'Parish life & groups', file: 'life' },
  { id: 'events', label: 'Upcoming events', file: 'events', sub: true },
  { id: 'clergy', label: 'Clergy & FSSP', file: 'clergy' },
  { id: 'history', label: 'History', file: 'history' },
  { id: 'band2', label: 'Photo band (motto)', file: 'bands', keys: ['motto'] },
  { id: 'give', label: 'Giving & capital campaign', file: 'give' },
  { id: 'news', label: 'Bulletin & news', file: 'news' },
  { id: 'bulletins', label: 'Bulletins (PDFs)', file: 'bulletins', sub: true },
  { id: 'contact', label: 'Contact & extensions', file: 'contact' },
  { id: 'footer', label: 'Footer', file: 'footer' },
  { id: 'misc', label: 'Phone bottom bar & “Next”', file: 'site', keys: ['mbar', 'next'] },
];

export const NAMES = Object.keys(FILES);

const EMPTY_IMG = () => ({ src: '', srcset: '', w: '', h: '', alt: { en: '', fr: '' } });
export function empty(f) {
  switch (f.type) {
    case 'bi': return { en: '', fr: '' };
    case 'bool': return false;
    case 'image': return EMPTY_IMG();
    case 'list': return [];
    case 'obj': return fill(f.fields, {});
    case 'num': return f.def ?? '';
    case 'select': return f.def ?? f.options[0][0];
    default: return f.def ?? '';
  }
}
// Complete a value so every field the editor shows exists, with the right type. Unknown keys are kept.
export function fill(fields, v) {
  v = v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  for (const f of fields) {
    if (f.type === 'pair') { for (const l of ['en', 'fr']) if (typeof v[f.key + '_' + l] !== 'string') v[f.key + '_' + l] = ''; continue; }
    v[f.key] = norm(f, v[f.key]);
  }
  return v;
}
export function norm(f, x) {
  switch (f.type) {
    case 'bi': return x && typeof x === 'object' ? { en: String(x.en ?? ''), fr: String(x.fr ?? '') } : { en: typeof x === 'string' ? x : '', fr: '' };
    case 'bool': return x === true || x === 'true';
    case 'image': { const o = x && typeof x === 'object' ? x : {}, e = EMPTY_IMG();
      for (const k of ['src', 'srcset', 'w', 'h']) e[k] = o[k] == null ? '' : String(o[k]);
      if (o.alt) e.alt = norm({ type: 'bi' }, o.alt);
      for (const k in o) if (!(k in e)) e[k] = o[k];
      return e; }
    case 'list': return Array.isArray(x) ? x.map(it => f.of ? norm(f.of, it) : fill(f.fields, it)) : [];
    case 'obj': return fill(f.fields, x);
    case 'num': return x === '' || x == null ? '' : String(x);
    default: return x == null || typeof x === 'object' ? (f.def != null && x == null ? f.def : '') : typeof x === 'boolean' ? '' : String(x);
  }
}
