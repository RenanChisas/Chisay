import type { phraseProps } from "../props/phraseProps";
export class PhraseStorage {
  static key1 = ["phrases", "verbs", "Timer"];

  static getAll(key: number) {
    console.log(this.key1[key]);
    const data = localStorage.getItem(this.key1[key]);
    return data ? JSON.parse(data) : [];
  }
  static getAt(index: number, key: number) {
    const data = this.getAll(key);
    return data[index];
  }
  static saveAll(phrases: phraseProps[], key: number) {
    localStorage.setItem(this.key1[key], JSON.stringify(phrases));
  }

  static add(phraseData: phraseProps | number, key: number) {
    const current = this.getAll(key);
    current.push(phraseData);
    this.saveAll(current, key);
  }

  static clear(key: number) {
    localStorage.removeItem(this.key1[key]);
  }

  static deleteAt(index: number, key: number) {
    const current = this.getAll(key);
    current.splice(index, 1);
    this.saveAll(current, key); // you were missing the key here too!
  }

  static updateAt(index: number, newData: phraseProps | number, key: number) {
    const current = this.getAll(key);
    if (index >= 0 && index < current.length) {
      current[index] = newData;
      this.saveAll(current, key); // same here
    }
  }
}
