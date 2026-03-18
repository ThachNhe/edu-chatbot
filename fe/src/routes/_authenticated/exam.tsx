import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExamToolbar, ExamPreview, ExamList } from "@/features/exam";
import { useGenerateExam, useCreateExam, useCreateRoom } from "@/features/exam";
import { CreateRoomModal } from "@/features/exam";
import type {
  ExamConfig,
  ExamDetail,
  ExamQuestion,
  RoomOut,
} from "@/features/exam";

export const Route = createFileRoute("/_authenticated/exam")({
  component: ExamPage,
});

const DEFAULT_CONFIG: ExamConfig = {
  topic: "Cấu trúc lặp (FOR, WHILE, REPEAT)",
  questionCount: 10,
  difficulty: "mixed",
  duration: "45",
};

function ExamPage() {
  const [tab, setTab] = useState<"create" | "list">("create");
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [savedExam, setSavedExam] = useState<ExamDetail | null>(null);
  const [createdRoom, setCreatedRoom] = useState<RoomOut | null>(null);

  const { mutate: generate, isPending: isGenerating } = useGenerateExam();
  const { mutate: createExam, isPending: isSaving } = useCreateExam();
  const { mutate: createRoom, isPending: isCreatingRoom } = useCreateRoom(
    savedExam?.id ?? 0,
  );

  const handleGenerate = () => {
    setSavedExam(null);
    generate(config, {
      onSuccess: (data) => setQuestions(data),
    });
  };

  const handleSave = (status: "draft" | "published") => {
    createExam(
      {
        title: `Đề kiểm tra Tin học 12 – ${config.topic}`,
        topic: config.topic,
        duration: config.duration,
        level_mix: config.difficulty,
        status,
        questions,
      },
      { onSuccess: (exam) => setSavedExam(exam) },
    );
  };

  const handleCreateRoom = () => {
    createRoom(undefined, {
      onSuccess: (room) => setCreatedRoom(room),
    });
  };

  return (
    <div className="flex-1 p-6 animate-fade-in">
      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-[#e2e8f0] bg-white p-1 w-fit shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {(["create", "list"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-[13px] font-bold transition-all ${
              tab === t
                ? "bg-[#1a56db] text-white shadow-sm"
                : "text-[#475569] hover:text-[#1a56db]"
            }`}
          >
            {t === "create" ? "✨ Tạo đề thi" : "📋 Danh sách đề thi"}
          </button>
        ))}
      </div>

      {tab === "create" ? (
        <>
          <ExamToolbar
            config={config}
            isGenerating={isGenerating}
            onChange={setConfig}
            onGenerate={handleGenerate}
          />
          <ExamPreview
            config={config}
            questions={questions}
            examDetail={savedExam}
            isSaving={isSaving}
            isCreatingRoom={isCreatingRoom}
            onQuestionsChange={setQuestions}
            onSaveDraft={() => handleSave("draft")}
            onSavePublish={() => handleSave("published")}
            onCreateRoom={handleCreateRoom}
            onRegenerate={handleGenerate}
          />
        </>
      ) : (
        <ExamList />
      )}

      <CreateRoomModal
        room={createdRoom}
        onClose={() => setCreatedRoom(null)}
      />
    </div>
  );
}
