import { lessonMetadata, lessonStaticParams, renderLesson } from "@/components/lesson/LessonPage";

export const dynamicParams = false;
export const generateStaticParams = () => lessonStaticParams("credit");
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) =>
  lessonMetadata("credit", (await params).slug);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return renderLesson("credit", (await params).slug);
}
