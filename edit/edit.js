const ADMIN_SESSION_KEY = 'alkrajAdminSession';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

const pathParts = (path) => path.split('.').map((part) => (/^\d+$/.test(part) ? Number(part) : part));

const getByPath = (source, path) => pathParts(path).reduce((value, part) => value?.[part], source);

const setByPath = (source, path, value) => {
  const parts = pathParts(path);
  const last = parts.pop();
  const target = parts.reduce((current, part) => current[part], source);
  target[last] = value;
};

const hashText = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const state = {
  content: null,
  lastSaved: null,
  preview: false,
  dragSectionId: null,
  dragPropertyIndex: null,
  imagePath: null,
  dirty: false,
};

const root = document.querySelector('[data-home-root]');
const app = document.querySelector('[data-admin-app]');
const loginScreen = document.querySelector('[data-login-screen]');
const loginForm = document.querySelector('[data-login-form]');
const loginError = document.querySelector('[data-login-error]');
const statusEl = document.querySelector('[data-save-status]');
const imageUpload = document.querySelector('[data-image-upload]');

const setDirty = (dirty = true) => {
  state.dirty = dirty;
  if (statusEl) statusEl.textContent = dirty ? 'Unsaved changes' : 'All changes saved';
};

const updateContentText = (element) => {
  const path = element.dataset.editPath;
  if (!path) return;
  setByPath(state.content, path, element.textContent.trim());
  setDirty(true);
};

const updateLink = (element) => {
  const path = element.dataset.linkPath;
  if (!path) return;
  const current = getByPath(state.content, path) || '';
  const next = window.prompt('Edit button/link target', current);
  if (next === null) return;
  setByPath(state.content, path, next.trim() || '#');
  renderEditor();
  setDirty(true);
};

const renderEditor = () => {
  window.AlkrajContent.renderHome(state.content, { editable: !state.preview, root });
  document.body.classList.toggle('is-previewing', state.preview);
  wireEditorControls();
};

const moveSection = (fromId, toId) => {
  if (!fromId || !toId || fromId === toId) return;
  const order = state.content.sectionsOrder;
  const fromIndex = order.indexOf(fromId);
  const toIndex = order.indexOf(toId);
  if (fromIndex < 0 || toIndex < 0) return;
  order.splice(toIndex, 0, order.splice(fromIndex, 1)[0]);
  renderEditor();
  setDirty(true);
};

const moveProperty = (fromIndex, toIndex) => {
  if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;
  state.content.properties.splice(toIndex, 0, state.content.properties.splice(fromIndex, 1)[0]);
  renderEditor();
  setDirty(true);
};

const startPointerMove = (event, section, mode) => {
  if (state.preview) return;
  event.preventDefault();
  const sectionId = section.dataset.sectionId;
  const layout = state.content.layout[sectionId] || {};
  const startX = event.clientX;
  const startY = event.clientY;
  const startLayout = { x: layout.x || 0, y: layout.y || 0, width: layout.width || section.offsetWidth, minHeight: layout.minHeight || section.offsetHeight };

  const onMove = (moveEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    const next = { ...startLayout };
    if (mode === 'move') {
      next.x = Math.round(startLayout.x + deltaX);
      next.y = Math.round(startLayout.y + deltaY);
    } else {
      next.width = Math.max(280, Math.round(startLayout.width + deltaX));
      next.minHeight = Math.max(120, Math.round(startLayout.minHeight + deltaY));
    }
    state.content.layout[sectionId] = next;
    section.style.transform = `translate(${next.x || 0}px, ${next.y || 0}px)`;
    section.style.width = `${next.width}px`;
    section.style.minHeight = `${next.minHeight}px`;
    setDirty(true);
  };

  const onUp = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp, { once: true });
};

const chooseImage = (path) => {
  state.imagePath = path;
  const current = getByPath(state.content, path) || '';
  const next = window.prompt('Paste an image URL, or cancel to upload a local image.', current);
  if (next !== null) {
    setByPath(state.content, path, next.trim());
    renderEditor();
    setDirty(true);
    return;
  }
  imageUpload.click();
};

const wireEditorControls = () => {
  root.querySelectorAll('[data-edit-path]').forEach((element) => {
    element.setAttribute('contenteditable', String(!state.preview));
    element.setAttribute('spellcheck', 'true');
    element.addEventListener('blur', () => updateContentText(element));
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && !['P', 'H1', 'H2', 'H3'].includes(element.tagName)) {
        event.preventDefault();
        element.blur();
      }
    });
    if (element.dataset.linkPath) {
      element.addEventListener('dblclick', (event) => {
        event.preventDefault();
        updateLink(element);
      });
      element.addEventListener('click', (event) => event.preventDefault());
    }
  });

  root.querySelectorAll('.editable-section').forEach((section) => {
    section.addEventListener('dragover', (event) => event.preventDefault());
    section.addEventListener('drop', (event) => {
      event.preventDefault();
      moveSection(state.dragSectionId, section.dataset.sectionId);
      state.dragSectionId = null;
    });

    section.querySelector(':scope > .edit-drag-handle')?.addEventListener('dragstart', () => {
      state.dragSectionId = section.dataset.sectionId;
    });
    section.querySelector(':scope > .edit-drag-handle')?.addEventListener('pointerdown', (event) => startPointerMove(event, section, 'move'));
    section.querySelector(':scope > .edit-resize-handle')?.addEventListener('pointerdown', (event) => startPointerMove(event, section, 'resize'));
  });

  root.querySelectorAll('[data-image-path]').forEach((button) => {
    button.addEventListener('click', () => chooseImage(button.dataset.imagePath));
  });

  root.querySelectorAll('[data-card-index]').forEach((card) => {
    card.addEventListener('dragstart', () => {
      state.dragPropertyIndex = Number(card.dataset.cardIndex);
    });
    card.addEventListener('dragover', (event) => event.preventDefault());
    card.addEventListener('drop', (event) => {
      event.preventDefault();
      moveProperty(state.dragPropertyIndex, Number(card.dataset.cardIndex));
      state.dragPropertyIndex = null;
    });
  });
};

const showApp = async () => {
  loginScreen.hidden = true;
  app.hidden = false;
  window.AlkrajContent.wireGlobalInteractions();
  state.content = await window.AlkrajContent.loadHomeContent();
  state.lastSaved = window.AlkrajContent.clone(state.content);
  renderEditor();
  setDirty(false);
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  if (username === ADMIN_USERNAME && (await hashText(password)) === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    await showApp();
    return;
  }
  loginError.textContent = 'Invalid username or password.';
});

document.querySelector('[data-preview-toggle]').addEventListener('click', (event) => {
  state.preview = !state.preview;
  event.currentTarget.textContent = state.preview ? 'Edit Mode' : 'Preview';
  renderEditor();
});

document.querySelector('[data-save-content]').addEventListener('click', () => {
  window.AlkrajContent.saveStoredContent(state.content);
  state.lastSaved = window.AlkrajContent.clone(state.content);
  setDirty(false);
});

document.querySelector('[data-reset-draft]').addEventListener('click', async () => {
  if (state.dirty && !window.confirm('Discard unsaved changes and reload the last saved homepage content?')) return;
  state.content = window.AlkrajContent.getStoredContent() || (await window.AlkrajContent.loadDefaultContent());
  state.lastSaved = window.AlkrajContent.clone(state.content);
  renderEditor();
  setDirty(false);
});

document.querySelector('[data-logout]').addEventListener('click', () => {
  if (state.dirty && !window.confirm('You have unsaved changes. Logout and discard them?')) return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.reload();
});

imageUpload.addEventListener('change', () => {
  const file = imageUpload.files?.[0];
  if (!file || !state.imagePath) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    setByPath(state.content, state.imagePath, String(reader.result));
    renderEditor();
    setDirty(true);
    imageUpload.value = '';
  });
  reader.readAsDataURL(file);
});

window.addEventListener('beforeunload', (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = '';
});

if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
  showApp();
}
