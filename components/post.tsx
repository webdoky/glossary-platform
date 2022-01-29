import Link from 'next/link';

export default function Post({ title, body, id }) {
  return (
    <article>
      <h2 className="text-3xl font-bold underline text-red-300">{title}</h2>
      <p>{body}</p>
      <Link href={`/post/${id}`}>
        <a>Read more...</a>
      </Link>
    </article>
  );
}
