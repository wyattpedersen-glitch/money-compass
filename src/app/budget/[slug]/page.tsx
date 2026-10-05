import { lessonMetadata, lessonStaticParams, renderLesson } from "@/components/lesson/LessonPage";

export const dynamicParams = false;
export const generateStaticParams = () => lessonStaticParams("budgeting");
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) =>
  lessonMetadata("budgeting", (await params).slug);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return renderLesson("budgeting", (await params).slug);
}
