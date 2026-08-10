export default function StaticPage({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-sm leading-relaxed text-gray-600 lg:px-10">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{title}</h1>
      {children || <p>Content coming soon.</p>}
    </div>
  );
}
