"use client";

import { useState, useMemo, useCallback } from "react";

interface Question {
  id: string;
  questionNumber: number;
  type: string;
  text: string;
  options: string[] | null;
  metadata: Record<string, unknown> | null;
}

interface Passage {
  id: string;
  passageNumber: number;
  title: string;
  content: string;
  wordCount: number | null;
  questions: Question[];
}

export interface QuestionGroup {
  type: string;
  startNum: number;
  endNum: number;
  questions: Question[];
}

export function useQuestionNavigation(
  passages: Passage[],
  activePassageId: string,
) {
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(1);

  const activePassageIndex = passages.findIndex(
    (p) => p.id === activePassageId,
  );
  const currentPassage = passages.find((p) => p.id === activePassageId);

  const questionOffset = useMemo(
    () =>
      passages
        .slice(0, activePassageIndex)
        .reduce((acc, p) => acc + p.questions.length, 0),
    [passages, activePassageIndex],
  );

  const firstQuestionNum = questionOffset + 1;
  const lastQuestionNum =
    questionOffset + (currentPassage?.questions.length ?? 0);

  const allQuestions = useMemo(
    () => passages.flatMap((p) => p.questions),
    [passages],
  );
  const totalQuestions = allQuestions.length;

  const questionGroups = useMemo((): QuestionGroup[] => {
    if (!currentPassage) return [];
    const groups: QuestionGroup[] = [];
    let currentType = "";

    currentPassage.questions.forEach((q, idx) => {
      const qNum = questionOffset + idx + 1;
      if (q.type !== currentType) {
        if (currentType !== "") {
          groups[groups.length - 1].endNum = qNum - 1;
        }
        currentType = q.type;
        groups.push({
          type: q.type,
          startNum: qNum,
          endNum: qNum,
          questions: [q],
        });
      } else {
        groups[groups.length - 1].questions.push(q);
        groups[groups.length - 1].endNum = qNum;
      }
    });

    return groups;
  }, [currentPassage, questionOffset]);

  const scrollToQuestion = useCallback((questionId: string) => {
    const el = document.getElementById(`question-${questionId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const goToQuestion = useCallback(
    (qNum: number) => {
      setActiveQuestionNumber(qNum);
      if (!currentPassage) return;
      const localIdx = qNum - questionOffset - 1;
      const question = currentPassage.questions[localIdx];
      if (question) scrollToQuestion(question.id);
    },
    [currentPassage, questionOffset, scrollToQuestion],
  );

  const goToPrevQuestion = useCallback(() => {
    const currentQIdx = activeQuestionNumber - questionOffset - 1;
    if (currentQIdx > 0) {
      goToQuestion(activeQuestionNumber - 1);
    }
  }, [activeQuestionNumber, questionOffset, goToQuestion]);

  const goToNextQuestion = useCallback(() => {
    if (!currentPassage) return;
    const currentQIdx = activeQuestionNumber - questionOffset - 1;
    if (currentQIdx < currentPassage.questions.length - 1) {
      goToQuestion(activeQuestionNumber + 1);
    }
  }, [activeQuestionNumber, questionOffset, currentPassage, goToQuestion]);

  return {
    activePassageIndex,
    currentPassage,
    questionOffset,
    firstQuestionNum,
    lastQuestionNum,
    totalQuestions,
    questionGroups,
    activeQuestionNumber,
    goToQuestion,
    goToPrevQuestion,
    goToNextQuestion,
  };
}
