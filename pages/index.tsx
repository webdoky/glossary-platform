import Head from 'next/head';
import Link from 'next/link';

import Layout from '../components/layout';
import ContentLoader from '../utils/contentLoader';
import calculateIndex from '../utils/calculateIndex';
import { prepareSearchData } from '../components/search';

export async function getStaticProps() {
  const pages = await ContentLoader.getAll();
  const indexes = calculateIndex(pages.map(({ term }) => term));
  const sections = indexes.map((letter) => ({
    title: letter.toUpperCase(),
    items: pages
      .filter(({ term }) => term.toLowerCase().startsWith(letter))
      .map(({ term }) => ({
        title: term,
        path: `/terms/${term}`,
      })),
  }));

  return {
    props: {
      navSections: sections,
      searchData: prepareSearchData(pages),
    },
  };
}

export default function IndexPage({ navSections, searchData }) {
  return (
    <main>
      <Head>
        <title>Глосарій ВебДоків</title>
      </Head>
      <Layout
        hasSidebar
        currentPage={{ path: '/' }}
        searchData={searchData}
        sidebarSections={navSections}
      >
        <h1>Глосарій ВебДоків</h1>

        {navSections.map((navBlock, index) => (
          <section key={navBlock.title}>
            <h2 className="mt-8">{navBlock.title}</h2>
            <div className="lg:columns-3 sm:columns-2 columns-1">
              {navBlock.items.map((item) => (
                <p key={item.title}>
                  <Link href={item.path}>
                    <a className="underline">{item.title}</a>
                  </Link>
                </p>
              ))}
            </div>
            {index < navSections.length - 1 ? <hr className="mt-4" /> : null}
          </section>
        ))}
      </Layout>
    </main>
  );
}
