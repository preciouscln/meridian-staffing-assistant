"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          "Hi! I'm the Meridian staffing assistant. Ask me about workers, shifts, employment, or credentials.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function sendMessage(
    event: FormEvent
  ) {
    event.preventDefault();

    const message =
      input.trim();

    if (!message || loading)
      return;

    setInput("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setLoading(true);

    try {
      const response =
        await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Something went wrong."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : "Unable to process your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            Meridian Staffing Assistant
          </h1>

          <p className="mt-2 text-slate-400">
            Ask about employees, workers,
            shifts, credentials, and staffing
            eligibility.
          </p>
        </header>

        <div className="flex-1 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          {messages.map(
            (message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[80%] rounded-lg bg-blue-600 p-3"
                    : "mr-auto max-w-[80%] rounded-lg bg-slate-800 p-3"
                }
              >
                <div className="mb-1 text-xs font-semibold uppercase text-slate-300">
                  {message.role ===
                  "user"
                    ? "You"
                    : "Meridian AI"}
                </div>

                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="mr-auto rounded-lg bg-slate-800 p-3 text-slate-300">
              Checking Meridian systems...
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="mt-4 flex gap-3"
        >
          <input
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            placeholder="Ask a staffing question..."
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={
              loading ||
              !input.trim()
            }
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
