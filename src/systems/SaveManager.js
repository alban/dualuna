export class SaveManager {
  static SAVE_KEY = 'dualuna_save';
  static LANG_KEY = 'dualuna_lang';

  static saveLanguage(lang) {
    localStorage.setItem(this.LANG_KEY, lang);
  }

  static getSavedLanguage() {
    return localStorage.getItem(this.LANG_KEY) || 'en';
  }

  static save(state) {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  static load() {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  }

  static hasSave() {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  static deleteSave() {
    localStorage.removeItem(this.SAVE_KEY);
  }

  static exportJSON(state) {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dualuna-save.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importJSON(onSuccess, onError) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = (e) => {
      const file = e.target.files[0];
      document.body.removeChild(input);
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const save = JSON.parse(ev.target.result);
          if (!save.saveVersion || !save.currentLocation) throw new Error('Invalid save');
          onSuccess(save);
        } catch (err) {
          onError?.(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
}
