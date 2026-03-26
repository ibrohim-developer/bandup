import { Volume2 } from "lucide-react";
import type { WordDefinitionState } from "@/hooks/use-word-definition";

interface WordDefinitionPopupProps {
  state: WordDefinitionState;
  word: string;
}

export function WordDefinitionPopup({ state, word }: WordDefinitionPopupProps) {
  const playAudio = (url: string) => {
    new Audio(url).play();
  };

  const audioUrl = state.data?.phonetics?.find((p) => p.audio)?.audio;

  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden"
      style={{ backgroundColor: "#1f2937", maxWidth: 320 }}
    >
      <div className="p-3 max-h-[300px] overflow-y-auto text-white [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:mr-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white">
        {state.loading && (
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
            <div className="h-3 w-full animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
          </div>
        )}

        {state.notFound && (
          <p className="text-xs text-white/70">
            No definition found for &ldquo;{word}&rdquo;
          </p>
        )}

        {state.error && (
          <p className="text-xs text-red-400">Failed to load definition</p>
        )}

        {state.data && (
          <div className="space-y-2">
            {/* Word + phonetic + audio */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{state.data.word}</span>
              {state.data.phonetic && (
                <span className="text-xs text-white/60">
                  {state.data.phonetic}
                </span>
              )}
              {audioUrl && (
                <button
                  onClick={() => playAudio(audioUrl)}
                  className="cursor-pointer p-0.5 rounded hover:bg-white/10 transition-colors"
                >
                  <Volume2 className="h-3.5 w-3.5 text-white/70" />
                </button>
              )}
            </div>

            {/* Meanings */}
            {state.data.meanings.slice(0, 2).map((meaning, mi) => (
              <div key={mi} className="space-y-1">
                <span className="text-[10px] uppercase tracking-wide text-white/50 font-medium">
                  {meaning.partOfSpeech}
                </span>
                <ol className="list-decimal list-inside space-y-1">
                  {meaning.definitions.slice(0, 2).map((def, di) => (
                    <li key={di} className="text-xs text-white/90">
                      {def.definition}
                      {def.example && (
                        <p className="text-[11px] text-white/50 italic ml-4 mt-0.5">
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid #1f2937",
        }}
      />
    </div>
  );
}
