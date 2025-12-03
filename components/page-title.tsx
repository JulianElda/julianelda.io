export function PageTitle({ title }: { title: string }) {
  return (
    <h1
      className={`
        py-4 text-center font-heading text-3xl font-semibold
        md:text-start
      `}>
      {title}
    </h1>
  );
}
