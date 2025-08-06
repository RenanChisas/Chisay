export class PhraseStorage {
  static key = "phrases";

  static getAll() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  static saveAll(phrases) {
    localStorage.setItem(this.key, JSON.stringify(phrases));
  }

  static add(phraseData) {
    const current = this.getAll();
    console.log("AAAAAAAAAAAAAAAAAAAA");
    current.push(phraseData);
    this.saveAll(current);
  }

  static clear() {
    localStorage.removeItem(this.key);
  }

  static deleteAt(index) {
    const current = this.getAll();
    current.splice(index, 1);
    this.saveAll(current);
  }

  static updateAt(index, newData) {
    const current = this.getAll();
    if (index >= 0 && index < current.length) {
      current[index] = newData;
      this.saveAll(current);
    }
  }
}
