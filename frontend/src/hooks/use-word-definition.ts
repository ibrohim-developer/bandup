import { useState, useRef, useCallback } from "react";

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

export interface DictionaryResult {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
}

export interface WordDefinitionState {
  data: DictionaryResult | null;
  loading: boolean;
  notFound: boolean;
  error: boolean;
}

const initialState: WordDefinitionState = {
  data: null,
  loading: false,
  notFound: false,
  error: false,
};

function normalizeWord(raw: string): string {
  return raw.toLowerCase().replace(/^[^a-z']+|[^a-z']+$/gi, "");
}

export function useWordDefinition() {
  const [state, setState] = useState<WordDefinitionState>(initialState);
  const cacheRef = useRef(new Map<string, DictionaryResult | "not_found">());
  const abortRef = useRef<AbortController | null>(null);

  const lookup = useCallback((raw: string) => {
    const word = normalizeWord(raw);
    if (word.length < 2) return;

    // Cancel any in-flight request
    abortRef.current?.abort();

    // Check cache
    const cached = cacheRef.current.get(word);
    if (cached === "not_found") {
      setState({ data: null, loading: false, notFound: true, error: false });
      return;
    }
    if (cached) {
      setState({ data: cached, loading: false, notFound: false, error: false });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setState({ data: null, loading: true, notFound: false, error: false });

    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (res.status === 404) {
          cacheRef.current.set(word, "not_found");
          setState({ data: null, loading: false, notFound: true, error: false });
          return;
        }
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        const entry = json[0] as DictionaryResult;
        cacheRef.current.set(word, entry);
        setState({
          data: entry,
          loading: false,
          notFound: false,
          error: false,
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ data: null, loading: false, notFound: false, error: true });
      });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  return { state, lookup, reset };
}
