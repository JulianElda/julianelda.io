export default function Heading({ title }: { title: string }) {
  return (
    <h2 className="pb-2 pt-8 font-heading text-xl">
      <strong># {title}</strong>
    </h2>
  );
}
