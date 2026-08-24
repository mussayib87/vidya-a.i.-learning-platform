import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLesson, getSubject } from "@/data/subjects";

export const Route = createFileRoute("/app/lessons/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — Vidya A.I." },
      {
        name: "description",
        content:
          "Read the explanation, worked examples and key points for this Vidya A.I. lesson.",
      },
      { property: "og:title", content: "Lesson — Vidya A.I." },
      {
        property: "og:description",
        content: "Explanations, examples and key points for this lesson.",
      },
    ],
  }),
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson, subject: getSubject(lesson.subjectId) };
  },
  component: LessonDetail,
});

function LessonDetail() {
  const { lesson, subject } = Route.useLoaderData();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm text-muted-foreground">
        {subject?.name} · {lesson.duration} min
      </p>
      <h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1>
      <p className="mt-2 text-muted-foreground">{lesson.summary}</p>

      <section className="mt-6 space-y-3">
        {lesson.explanation.map((para) => (
          <p key={para} className="leading-relaxed">
            {para}
          </p>
        ))}
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Examples</h2>
        {lesson.examples.map((example) => (
          <div
            key={example.title}
            className="rounded-2xl border border-border bg-card p-4 shadow-card"
          >
            <h3 className="font-semibold">{example.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{example.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Key points</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {lesson.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
