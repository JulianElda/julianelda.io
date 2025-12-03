export function Heading({ title }: { title: string }) {
  return (
    <h2 className="pt-4 pb-2 font-heading text-xl">
      <strong># {title}</strong>
    </h2>
  );
}
