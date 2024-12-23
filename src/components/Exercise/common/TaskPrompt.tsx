interface TaskPromptProps {
  prompt: string;
}

export default function TaskPrompt({ prompt }: TaskPromptProps) {
  return (
    <section className="bg-gray-100/40 p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-2">Task:</h2>
      <p className="text-gray-700 text-base">{prompt}</p>
    </section>
  );
}