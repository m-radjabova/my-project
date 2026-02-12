import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { LessonChatMessageOut, LessonChatThreadOut } from "../../../types/types";
import {
  MdPerson,
  MdGroup,
  MdChatBubble,
  MdChatBubbleOutline,
  MdEmojiEmotions,
} from "react-icons/md";
import { FiMessageSquare, FiUser, FiClock } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = {
  canModerateChat: boolean;
  threads: LessonChatThreadOut[];
  selectedThreadId: string;
  setSelectedThreadId: Dispatch<SetStateAction<string>>;
  selectedThread: LessonChatThreadOut | null;
  messages: LessonChatMessageOut[];
  isChatLoading: boolean;
  userId?: string;
  chatDraft: string;
  setChatDraft: Dispatch<SetStateAction<string>>;
  onSend: () => void;
  isSending: boolean;
};

function LessonChatSection({
  canModerateChat,
  threads,
  selectedThreadId,
  setSelectedThreadId,
  selectedThread,
  messages,
  isChatLoading,
  userId,
  chatDraft,
  setChatDraft,
  onSend,
  isSending,
}: Props) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // ✅ scroll control
  const messagesBoxRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const scrollToBottom = (smooth = true) => {
    endRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
  };

  const onMessagesScroll = () => {
    const el = messagesBoxRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    // user pastdan 80px yuqoriga chiqsa auto-scrollni vaqtincha o'chiramiz
    setAutoScrollEnabled(distanceFromBottom < 80);
  };

  // ✅ yangi message kelsa pastga tushirish
  const lastMessageId = messages.length ? messages[messages.length - 1].id : "";
  useEffect(() => {
    if (isChatLoading) return;
    if (!messages.length) return;

    // faqat user pastda bo'lsa auto-scroll
    if (autoScrollEnabled) scrollToBottom(true);
  }, [lastMessageId, isChatLoading, autoScrollEnabled]);

  // ✅ thread almashganda birdan pastga tushirsin
  useEffect(() => {
    // thread o'zgarganda auto-scrollni yana yoqamiz
    setAutoScrollEnabled(true);
    // biroz kutib (DOM render bo'lsin) keyin tushiramiz
    const t = setTimeout(() => scrollToBottom(false), 0);
    return () => clearTimeout(t);
  }, [selectedThreadId]);

  // ✅ emoji picker
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const EMOJIS = useMemo(
    () => ["😀", "😄", "😂", "😍", "😎", "🥳", "👍", "🙏", "🔥", "❤️", "🎉", "✅", "😅", "😢", "🤝", "✨"],
    []
  );

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setChatDraft((p) => p + emoji);
      return;
    }
    const start = ta.selectionStart ?? chatDraft.length;
    const end = ta.selectionEnd ?? chatDraft.length;
    const next = chatDraft.slice(0, start) + emoji + chatDraft.slice(end);
    setChatDraft(next);

    // cursor emoji’dan keyin tursin
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + emoji.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  // emoji panel tashqariga bosilganda yopish
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showEmoji) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-emoji-root='1']")) return;
      setShowEmoji(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showEmoji]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 p-3 text-white">
            <MdChatBubble size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Lesson Discussion
            </h2>
            <p className="text-sm text-slate-500">Interactive learning conversation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-cyan-50 px-3 py-1.5 border border-cyan-200">
            <span className="text-sm font-semibold text-cyan-700">
              {canModerateChat ? (
                <span className="flex items-center gap-2">
                  <MdGroup size={16} />
                  {threads.length} Threads
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MdPerson size={16} />
                  Private Chat
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Threads Sidebar */}
        {canModerateChat && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <FiMessageSquare className="text-cyan-600" />
                  Student Threads
                </h3>
                <span className="text-xs text-slate-500">{threads.length} active</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                {threads.map((thread) => {
                  const isActiveThread = selectedThreadId === thread.id;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full rounded-xl p-4 text-left transition-all duration-300 ${
                        isActiveThread
                          ? "bg-gradient-to-r from-cyan-50 to-emerald-50 border-2 border-cyan-400 shadow-md"
                          : "bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              isActiveThread
                                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <FiUser size={14} />
                          </div>
                          <span className="font-semibold text-slate-900">
                            {thread.student_username || `Student ${thread.student_id.slice(0, 4)}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <FiClock size={12} />
                          {formatTime(thread.created_at)}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {!threads.length && (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
                    <MdChatBubbleOutline className="mx-auto text-slate-400 mb-3" size={32} />
                    <p className="text-slate-600 font-medium">No active threads</p>
                    <p className="text-sm text-slate-500 mt-1">Student messages will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="space-y-4">
          {/* Chat Header */}
          <div className="rounded-2xl bg-gradient-to-r from-white to-cyan-50/30 border border-slate-200/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    selectedThread ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedThread ? <FiUser size={20} /> : <MdGroup size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {canModerateChat
                      ? selectedThread
                        ? `Thread: ${selectedThread.student_username}`
                        : "Select a thread"
                      : "Private Chat"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedThread && (
                  <button className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors">
                    <BsThreeDotsVertical size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="rounded-2xl border border-slate-200/50 bg-white p-4 h-[400px] overflow-hidden flex flex-col">
            {/* Messages Area */}
            <div
              ref={messagesBoxRef}
              onScroll={onMessagesScroll}
              className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar"
            >
              {isChatLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent mb-3"></div>
                    <p className="text-slate-500">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length ? (
                <>
                  {messages.map((message) => {
                    const mine = message.sender_id === userId;
                    const isInstructor = mine && canModerateChat;

                    return (
                      <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            mine
                              ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-br-none"
                              : isInstructor
                              ? "bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-bl-none"
                              : "bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-bl-none"
                          }`}
                        >
                          <div className={`flex items-center justify-between mb-2 ${mine ? "text-white/90" : "text-slate-500"}`}>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {message.sender_username || `User ${message.sender_id.slice(0, 4)}`}
                              </span>
                              {isInstructor && (
                                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                                  Instructor
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <FiClock size={12} />
                              {formatTime(message.created_at)}
                            </div>
                          </div>

                          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* scroll anchor */}
                  <div ref={endRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MdChatBubbleOutline className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-600 font-medium">No messages yet</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {canModerateChat && !selectedThreadId
                        ? "Select a thread to start chatting"
                        : "Send a message to start the conversation"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Auto-scroll off indicator (ixtiyoriy, yaxshi UX) */}
            {!autoScrollEnabled && messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAutoScrollEnabled(true);
                  scrollToBottom(true);
                }}
                className="mt-2 self-center rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-600 hover:border-cyan-300 hover:text-cyan-700"
              >
                New messages ↓
              </button>
            )}

            {/* Input Area */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              {canModerateChat && !selectedThreadId ? (
                <div className="text-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6">
                  <MdChatBubbleOutline className="mx-auto text-slate-400 mb-3" size={32} />
                  <p className="text-slate-600 font-medium">Select a thread to reply</p>
                  <p className="text-sm text-slate-500 mt-1">Choose a student thread from the left sidebar</p>
                </div>
              ) : (
                <div className="space-y-3" data-emoji-root="1">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={chatDraft}
                      onChange={(event) => setChatDraft(event.target.value)}
                      rows={3}
                      placeholder={
                        canModerateChat
                          ? `Reply to ${selectedThread?.student_username || "student"}...`
                          : "Type your message here... Ask questions about the lesson!"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-28 text-sm placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all resize-none"
                      disabled={isSending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (chatDraft.trim() && !isSending) onSend();
                        }
                      }}
                    />

                    {/* Right controls */}
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowEmoji((p) => !p)}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:border-cyan-300 hover:text-cyan-700"
                        title="Emoji"
                        disabled={isSending}
                      >
                        <MdEmojiEmotions size={20} />
                      </button>

                      <span className="text-xs text-slate-400">{chatDraft.length}/1000</span>

                      <button
                        type="button"
                        onClick={onSend}
                        disabled={isSending || !chatDraft.trim()}
                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 p-3 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isSending ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <IoIosSend size={20} />
                        )}
                      </button>
                    </div>

                    {/* Emoji panel */}
                    {showEmoji && (
                      <div className="absolute bottom-14 right-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl p-3">
                        <div className="grid grid-cols-8 gap-2">
                          {EMOJIS.map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => insertEmoji(em)}
                              className="rounded-lg border border-transparent hover:border-cyan-300 hover:bg-cyan-50 p-1 text-lg"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LessonChatSection;