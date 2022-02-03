import Head from 'next/head';

import ContentLoader from '../../utils/contentLoader';
import Layout from '../../components/layout';
import calculateIndex from '../../utils/calculateIndex';
import { prepareSearchData } from '../../components/search';

export async function getStaticPaths() {
  const pages = await ContentLoader.getAll();
  return {
    paths: Array.from(pages).map((post) => {
      return {
        params: {
          id: `${post.term}`,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = await ContentLoader.getById(params.id);
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
      ...page,
      navSections: sections,
      searchData: prepareSearchData(pages),
    },
  };
}

export default function Post({
  term,
  translations,
  content = '',
  navSections,
  searchData,
}) {
  return (
    <main>
      <Head>
        <title>Глосарій ВебДоків — {term}</title>
      </Head>

      <Layout
        hasSidebar
        currentPage={{ path: `/terms/${term}` }}
        searchData={searchData}
        sidebarSections={navSections}
      >
        <h1>{term}</h1>

        {content && (
          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        )}

        <hr className="mb-6" />
        {translations.map((translation, index) => (
          <p key={`${index}.${translation.source}`}>
            <strong>{translation.source}</strong> —{' '}
            <span className="capitalize">{translation.text}</span>
          </p>
        ))}
      </Layout>
    </main>
  );
}
