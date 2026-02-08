import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { API_ORIGIN } from "../../utils";
import { useCourseDetail } from "../../hooks/useCourseDetail";
import { useCourseLessons } from "../../hooks/useCourseLessons";
import type {
  Category,
  LessonApi,
} from "../../types/types";
import { FaClock, FaStar, FaPlay, FaLock, FaBookOpen } from "react-icons/fa";
import useCategories from "../../hooks/useCategories";

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "";

  const { data: course, isLoading: courseLoading } = useCourseDetail(courseId);
  const { data: lessons = [], isLoading: lessonLoading } =
    useCourseLessons(courseId);
  const { categories } = useCategories();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [activeLesson, setActiveLesson] = useState<LessonApi | null>(null);

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => a.order - b.order);
  }, [lessons]);

  const totalDuration = useMemo(() => {
    return lessons.reduce((acc, lesson) => acc + (lesson.duration_sec || 0), 0);
  }, [lessons]);
  const freeLessonsCount = useMemo(
    () => lessons.filter((lesson) => lesson.is_free).length,
    [lessons],
  );

  useEffect(() => {
    if (!categories?.length) return;
    const map = new Map<string, string>();
    categories.forEach((cat: Category) => {
      map.set(String(cat.id), cat.name);
    });
    setCategoryMap(map);
  }, [categories]);

  useEffect(() => {
    if (activeLesson || sortedLessons.length === 0) return;
    const firstPlayable = sortedLessons.find((lesson) => lesson.is_free);
    setActiveLesson(firstPlayable ?? sortedLessons[0]);
  }, [activeLesson, sortedLessons]);

  const getCategoryName = (categoryId: string | number | undefined) => {
    if (categoryId === undefined || categoryId === null) return "Design";
    return categoryMap.get(String(categoryId)) || "Design";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This course doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.07)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.12),transparent_40%)]" />
          <div className="relative grid lg:grid-cols-[380px_1fr] gap-6 lg:gap-10 p-5 sm:p-8">
            <div className="relative group">
              <img
                src={
                  course.image
                    ? `${API_ORIGIN}${course.image}`
                    : "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                }
                alt={course.title}
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-700 text-xs sm:text-sm font-bold rounded-lg shadow">
                  {getCategoryName(course.category_id)}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
                  {course.level || "beginner"}
                </span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 flex items-center gap-1.5">
                  <FaStar className="text-amber-500" />
                  {course.rating || 4.8}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-2">
                    <FaClock className="text-teal-600 text-lg" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Duration</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatTime(totalDuration)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-2">
                    <FaBookOpen className="text-teal-600 text-lg" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Lessons</p>
                  <p className="text-lg font-bold text-slate-900">
                    {lessons.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 col-span-2 sm:col-span-1">
                  <p className="text-xs text-slate-500 font-medium mb-2">
                    Accessible Lessons
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {freeLessonsCount}/{lessons.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Free preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-6 xl:gap-8">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 sm:px-8 py-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Course Content
              </h2>
              <p className="text-teal-100 mt-1 text-sm sm:text-base">
                {lessons.length} lessons - {formatTime(totalDuration)} total
              </p>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {lessonLoading ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-500 font-medium">Loading lessons...</p>
                </div>
              ) : sortedLessons.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No lessons available yet
                </div>
              ) : (
                sortedLessons.map((lesson, index) => {
                  const isFree = lesson.is_free;
                  const isActive = activeLesson?.id === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => isFree && setActiveLesson(lesson)}
                      className={`p-5 sm:p-6 transition-all duration-300 ${
                        isActive
                          ? "bg-teal-50/80 border-l-4 border-teal-600"
                          : "hover:bg-slate-50 border-l-4 border-transparent"
                      } ${!isFree ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                            isActive
                              ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3
                              className={`font-semibold text-base sm:text-lg ${
                                isActive ? "text-teal-700" : "text-slate-900"
                              }`}
                            >
                              {lesson.title}
                            </h3>

                            <span className="text-xs sm:text-sm font-semibold text-slate-500 whitespace-nowrap bg-slate-100 px-3 py-1 rounded-lg">
                              {formatTime(lesson.duration_sec || 0)}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {lesson.description ||
                              "Learn essential concepts in this comprehensive lesson"}
                          </p>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                                isFree
                                  ? "text-teal-700 bg-teal-50 border border-teal-200"
                                  : "text-slate-500 bg-slate-100"
                              }`}
                            >
                              {isFree ? <FaPlay className="text-[10px]" /> : <FaLock className="text-[10px]" />}
                              {isFree ? "Watch now" : "Premium content"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="xl:sticky xl:top-8 h-fit">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">
              {activeLesson ? (
                <>
                  <div className="relative bg-black aspect-video">
                    {activeLesson.video_url ? (
                      activeLesson.video_url.includes("youtube.com") ||
                      activeLesson.video_url.includes("youtu.be") ? (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${
                            activeLesson.video_url.includes("youtu.be")
                              ? activeLesson.video_url.split("/").pop()?.split("?")[0]
                              : activeLesson.video_url.split("v=")[1]?.split("&")[0]
                          }`}
                          title={activeLesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          ref={videoRef}
                          className="w-full h-full"
                          controls
                          autoPlay
                          src={activeLesson.video_url}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                        <div className="text-center text-white">
                          <FaPlay className="w-14 h-14 mx-auto mb-3 opacity-40" />
                          <p className="text-lg opacity-60">Video not available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 bg-white">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaPlay className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-1">
                          {activeLesson.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="font-semibold">
                            {formatTime(activeLesson.duration_sec || 0)}
                          </span>
                          <span>-</span>
                          <span>Lesson {activeLesson.order}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {activeLesson.description ||
                        "Watch this lesson to master essential concepts and techniques"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-teal-50 via-teal-100 to-teal-50 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FaPlay className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-700">
                      Select a Lesson
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Choose a lesson from the left to start learning
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CourseDetail;   
