export class SaveManager {
  static SAVE_KEY = 'dualuna_save';

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
}
