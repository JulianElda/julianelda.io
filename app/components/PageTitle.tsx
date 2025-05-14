export function PageTitle({ title }: { title: string }) {
  return (
    <h1 className="text-center font-heading text-3xl font-semibold py-4 md:text-start">
      {title}
    </h1>
  );
}
