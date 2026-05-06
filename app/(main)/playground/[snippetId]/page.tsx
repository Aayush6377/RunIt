import PlaygroundLayout from "@/components/playground/PlaygroundLayout";
import PlaygroundBackground from "@/components/playground/PlaygroundBackground";

export const metadata = {
  title: "Playground | RunIt",
  description: "High-performance code execution environment.",
};

export default function SnippetPlaygroundPage() {
  return (
    <>
      <PlaygroundBackground />
      
      <div className="w-full h-screen pt-24 pb-6 flex flex-col relative z-10">
        <PlaygroundLayout />
      </div>
    </>
  );
}