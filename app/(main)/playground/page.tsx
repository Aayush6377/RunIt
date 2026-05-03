import PlaygroundLayout from "@/components/playground/PlaygroundLayout";

export const metadata = {
  title: "Playground | RunIt",
  description: "High-performance code execution environment.",
};

export default function PlaygroundPage() {
  return (
    <div className="w-full h-screen pt-24 pb-6 flex flex-col">
      <PlaygroundLayout />
    </div>
  );
}