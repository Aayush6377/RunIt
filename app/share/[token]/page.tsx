import SharedSnippetClient from "@/components/share/SharedSnippetClient";

export const metadata = {
  title: "Shared Snippet | RunIt",
  description: "View and execute shared code.",
};

type Props = { params: Promise<{ token: string }> };

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  return <SharedSnippetClient token={token} />;
}