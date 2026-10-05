import { lessonMetadata, lessonStaticParams, renderLesson } from "@/components/lesson/LessonPage";

export const dynamicParams = false;
export const generateStaticParams = () => lessonStaticParams("investing");
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) =>
  lessonMetadata("investing", (await params).slug);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return renderLesson("investing", (await params).slug);
}
