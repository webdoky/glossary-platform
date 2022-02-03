import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const mdProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

let instanceSingleton;

export interface TranslationItem {
  term: string;
  translations: {
    source: string;
    text: string;
  }[];
  content?: string;
}

export default class ContentLoader {
  registry = new Map<string, TranslationItem>();

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

      if (filepath.endsWith('.md')) {
        try {
          const { data, content: mdContent } = matter(content);
          const htmlContent = await mdProcessor.process(mdContent);
          this.registry.set(data.term, {
            term: data.term,
            translations: data.referenceTranslations,
            content: String(htmlContent),
          });
        } catch (error) {
          console.log('Error in ', filename, error);
        }
      } else {
        try {
          const data = JSON.parse(content);
          this.registry.set(data.term, data);
        } catch (error) {
          console.log('Error in ', filename, error);
        }
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
