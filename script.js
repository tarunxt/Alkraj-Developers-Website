const CONTENT_STORAGE_KEY = 'alkrajHomeContent';
const DEFAULT_CONTENT_URL = `${window.location.origin}/homeContent.json`;

const clone = (value) => JSON.parse(JSON.stringify(value));

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const escapeAttr = escapeHtml;

const normalizeContent = (content) => {
  const next = clone(content || {});
  next.sectionsOrder ||= [
    'hero',
    'intro',
    'propertiesHeading',
    'properties',
    'experience',
    'services',
    'testimonial',
    'contact',
  ];
  next.layout ||= {};
  return next;
};

const getStoredContent = () => {
  try {
    const saved = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    return saved ? normalizeContent(JSON.parse(saved)) : null;
  } catch (error) {
    console.warn('Unable to read saved home content.', error);
    return null;
  }
};

const saveStoredContent = (content) => {
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(normalizeContent(content)));
};

const loadDefaultContent = async () => {
  const response = await fetch(DEFAULT_CONTENT_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to load ${DEFAULT_CONTENT_URL}`);
  }
  return normalizeContent(await response.json());
};

const loadHomeContent = async ({ preferStored = true } = {}) => {
  const stored = preferStored ? getStoredContent() : null;
  if (stored) return stored;
  return loadDefaultContent();
};

const sectionStyle = (content, id) => {
  const layout = content.layout?.[id];
  if (!layout) return '';
  const styles = [];
  if (Number.isFinite(layout.x) || Number.isFinite(layout.y)) {
    styles.push(`transform: translate(${Number(layout.x || 0)}px, ${Number(layout.y || 0)}px)`);
  }
  if (Number.isFinite(layout.width) && layout.width > 0) styles.push(`width: ${Number(layout.width)}px`);
  if (Number.isFinite(layout.minHeight) && layout.minHeight > 0) styles.push(`min-height: ${Number(layout.minHeight)}px`);
  return styles.length ? ` style="${styles.join('; ')}"` : '';
};

const imageStyle = (url) =>
  `background-image: linear-gradient(180deg, transparent 48%, rgba(9, 9, 7, 0.72)), url('${String(url || '').replaceAll("'", '%27')}')`;

const renderHero = (content, editable) => {
  const hero = content.hero;
  return `
    <section class="hero editable-section" data-section-id="hero"${sectionStyle(content, 'hero')}>
      ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move hero">Move</button><button class="edit-image-button" type="button" data-image-path="hero.image">Replace image</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
      <div class="hero-media" aria-hidden="true" style="background-image: url('${escapeAttr(hero.image)}')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content section-shell">
        <div class="hero-copy">
          <p class="eyebrow" data-edit-path="hero.eyebrow">${escapeHtml(hero.eyebrow)}</p>
          <h1 data-edit-path="hero.heading">${escapeHtml(hero.heading)}</h1>
          <p data-edit-path="hero.body">${escapeHtml(hero.body)}</p>
          <div class="hero-actions">
            ${hero.buttons.map((button, index) => `<a class="button ${escapeAttr(button.style)}" href="${escapeAttr(button.href)}" data-edit-path="hero.buttons.${index}.label" data-link-path="hero.buttons.${index}.href">${escapeHtml(button.label)}</a>`).join('')}
          </div>
        </div>
        <aside class="hero-reservation" aria-label="Featured private estate" data-section-id="heroFeatured"${sectionStyle(content, 'heroFeatured')}>
          <span data-edit-path="hero.featured.label">${escapeHtml(hero.featured.label)}</span>
          <h2 data-edit-path="hero.featured.title">${escapeHtml(hero.featured.title)}</h2>
          <p data-edit-path="hero.featured.body">${escapeHtml(hero.featured.body)}</p>
          <strong data-edit-path="hero.featured.price">${escapeHtml(hero.featured.price)}</strong>
        </aside>
      </div>
    </section>`;
};

const renderIntro = (content, editable) => `
  <section class="intro section-shell editable-section" aria-label="Company highlights" data-section-id="intro"${sectionStyle(content, 'intro')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move intro">Move</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    <div>
      <p class="eyebrow" data-edit-path="intro.eyebrow">${escapeHtml(content.intro.eyebrow)}</p>
      <h2 data-edit-path="intro.heading">${escapeHtml(content.intro.heading)}</h2>
    </div>
    <p data-edit-path="intro.body">${escapeHtml(content.intro.body)}</p>
    <dl class="hero-stats">
      ${content.intro.stats.map((stat, index) => `<div><dt data-edit-path="intro.stats.${index}.value">${escapeHtml(stat.value)}</dt><dd data-edit-path="intro.stats.${index}.label">${escapeHtml(stat.label)}</dd></div>`).join('')}
    </dl>
  </section>`;

const renderPropertiesHeading = (content, editable) => `
  <section class="section-shell section-heading editable-section" id="properties" data-section-id="propertiesHeading"${sectionStyle(content, 'propertiesHeading')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move properties heading">Move</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    <p class="eyebrow" data-edit-path="propertiesHeading.eyebrow">${escapeHtml(content.propertiesHeading.eyebrow)}</p>
    <h2 data-edit-path="propertiesHeading.heading">${escapeHtml(content.propertiesHeading.heading)}</h2>
  </section>`;

const renderProperties = (content, editable) => `
  <section class="property-grid section-shell editable-section" aria-label="Property listings" data-section-id="properties"${sectionStyle(content, 'properties')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move properties">Move</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    ${content.properties.map((property, index) => `
      <article class="property-card ${property.feature ? 'feature-card' : ''}" draggable="${editable}" data-card-index="${index}">
        ${editable ? `<button class="edit-card-handle" type="button" draggable="true" aria-label="Move property">↕</button><button class="edit-image-button small" type="button" data-image-path="properties.${index}.image">Image</button>` : ''}
        <div class="property-image" style="${escapeAttr(imageStyle(property.image))}"></div>
        <div class="property-content">
          <span class="tag" data-edit-path="properties.${index}.tag">${escapeHtml(property.tag)}</span>
          <h3 data-edit-path="properties.${index}.title">${escapeHtml(property.title)}</h3>
          <p data-edit-path="properties.${index}.body">${escapeHtml(property.body)}</p>
          <ul>${property.facts.map((fact, factIndex) => `<li data-edit-path="properties.${index}.facts.${factIndex}">${escapeHtml(fact)}</li>`).join('')}</ul>
        </div>
      </article>`).join('')}
  </section>`;

const renderExperience = (content, editable) => `
  <section class="experience section-shell editable-section" id="experience" data-section-id="experience"${sectionStyle(content, 'experience')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move experience">Move</button><button class="edit-image-button" type="button" data-image-path="experience.image">Replace image</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    <div class="experience-image" aria-hidden="true" style="${escapeAttr(imageStyle(content.experience.image))}"></div>
    <div class="experience-copy">
      <p class="eyebrow" data-edit-path="experience.eyebrow">${escapeHtml(content.experience.eyebrow)}</p>
      <h2 data-edit-path="experience.heading">${escapeHtml(content.experience.heading)}</h2>
      <p data-edit-path="experience.body">${escapeHtml(content.experience.body)}</p>
      <div class="process-list">${content.experience.process.map((item, index) => `<article><span data-edit-path="experience.process.${index}.number">${escapeHtml(item.number)}</span><h3 data-edit-path="experience.process.${index}.title">${escapeHtml(item.title)}</h3><p data-edit-path="experience.process.${index}.body">${escapeHtml(item.body)}</p></article>`).join('')}</div>
    </div>
  </section>`;

const renderServices = (content, editable) => `
  <section class="services section-shell editable-section" id="services" data-section-id="services"${sectionStyle(content, 'services')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move services">Move</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    <div class="section-heading compact"><p class="eyebrow" data-edit-path="services.eyebrow">${escapeHtml(content.services.eyebrow)}</p><h2 data-edit-path="services.heading">${escapeHtml(content.services.heading)}</h2></div>
    <div class="service-grid">${content.services.items.map((item, index) => `<article><span data-edit-path="services.items.${index}.number">${escapeHtml(item.number)}</span><h3 data-edit-path="services.items.${index}.title">${escapeHtml(item.title)}</h3><p data-edit-path="services.items.${index}.body">${escapeHtml(item.body)}</p></article>`).join('')}</div>
  </section>`;

const renderTestimonial = (content, editable) => `
  <section class="testimonial section-shell editable-section" aria-label="Client testimonial" data-section-id="testimonial"${sectionStyle(content, 'testimonial')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move testimonial">Move</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    <p data-edit-path="testimonial.quote">${escapeHtml(content.testimonial.quote)}</p>
    <span data-edit-path="testimonial.attribution">${escapeHtml(content.testimonial.attribution)}</span>
  </section>`;

const renderContact = (content, editable) => `
  <section class="contact section-shell editable-section" id="contact" data-section-id="contact"${sectionStyle(content, 'contact')}>
    ${editable ? '<button class="edit-drag-handle" type="button" draggable="true" aria-label="Move contact">Move</button><span class="edit-resize-handle" aria-hidden="true"></span>' : ''}
    <div class="contact-copy"><p class="eyebrow" data-edit-path="contact.eyebrow">${escapeHtml(content.contact.eyebrow)}</p><h2 data-edit-path="contact.heading">${escapeHtml(content.contact.heading)}</h2><p data-edit-path="contact.body">${escapeHtml(content.contact.body)}</p><a href="mailto:${escapeAttr(content.contact.email)}" data-edit-path="contact.email">${escapeHtml(content.contact.email)}</a></div>
    <form class="contact-form" data-mailto="${escapeAttr(content.contact.email)}"><label>Full name<input type="text" name="name" placeholder="Your name" required /></label><label>Phone or email<input type="text" name="contact" placeholder="+91 ... or you@example.com" required /></label><label>Requirement<textarea name="message" rows="4" placeholder="I am looking for a villa, penthouse, plot, or investment asset..."></textarea></label><button class="button primary" type="submit" data-edit-path="contact.buttonLabel">${escapeHtml(content.contact.buttonLabel)}</button></form>
  </section>`;

const sectionRenderers = {
  hero: renderHero,
  intro: renderIntro,
  propertiesHeading: renderPropertiesHeading,
  properties: renderProperties,
  experience: renderExperience,
  services: renderServices,
  testimonial: renderTestimonial,
  contact: renderContact,
};

const renderHome = (content, { editable = false, root = document.querySelector('[data-home-root]') } = {}) => {
  if (!root) return;
  const safeContent = normalizeContent(content);
  root.innerHTML = safeContent.sectionsOrder
    .filter((sectionId) => sectionRenderers[sectionId])
    .map((sectionId) => sectionRenderers[sectionId](safeContent, editable))
    .join('');
  root.dataset.editable = String(editable);
};

const wireGlobalInteractions = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const year = document.querySelector('#year');

  if (year) year.textContent = new Date().getFullYear();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
};

const wireContactForm = () => {
  const contactForm = document.querySelector('.contact-form');
  if (!(contactForm instanceof HTMLFormElement)) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const recipient = contactForm.dataset.mailto || 'hello@alkraj.com';
    const name = String(formData.get('name') || '').trim();
    const contact = String(formData.get('contact') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = encodeURIComponent('Private tour request');
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Message: ${message || 'Not provided'}`,
    ].join('\n'));

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
};

window.AlkrajContent = {
  CONTENT_STORAGE_KEY,
  clone,
  getStoredContent,
  loadDefaultContent,
  loadHomeContent,
  normalizeContent,
  renderHome,
  saveStoredContent,
  wireContactForm,
  wireGlobalInteractions,
};

document.addEventListener('DOMContentLoaded', async () => {
  wireGlobalInteractions();
  if (!document.querySelector('[data-admin-app]')) {
    try {
      const content = await loadHomeContent();
      renderHome(content);
      wireContactForm();
    } catch (error) {
      console.error(error);
    }
  }
});
