export default async function Communities({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <p>{username}</p>;
}
