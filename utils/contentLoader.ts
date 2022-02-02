import { promises as fs } from 'fs';
import path from 'path';

let instanceSingleton;

export interface TranslationItem {
  term: string;
  translations: {
    source: string;
    text: string;
  }[];
}

export default class ContentLoader {
  registry = new Map();

  async init() {
    const contentDirectory = path.join(
      process.cwd(),
      'node_modules/glossary-content/content'
    );

    const files = await fs.readdir(contentDirectory);
    const contentObjects = files.map(async (filename) => {
      const filepath = path.join(
        'node_modules/glossary-content/content',
        filename
      );
      const content = await fs.readFile(filepath, { encoding: 'utf8' });

      try {
        const data = JSON.parse(content);
        this.registry.set(data.term, data);
      } catch (error) {
        console.log('Error in ', filename, error);
      }
    });

    await Promise.all(contentObjects);
  }

  static async getInstance(): Promise<ContentLoader> {
    if (!instanceSingleton) {
      instanceSingleton = new ContentLoader();
      await instanceSingleton.init();
    }

    return instanceSingleton;
  }

  static async getAll(): Promise<TranslationItem[]> {
    const instance = await ContentLoader.getInstance();

    return Array.from(instance.registry.values());
  }

  static async getById(id): Promise<TranslationItem> {
    const instance = await ContentLoader.getInstance();

    return instance.registry.get(id);
  }
}
