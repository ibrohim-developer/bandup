"use server";

import { findOne, find } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FullMockTestDetail {
    id: string;
    title: string;
    description: string;
    audioUrl: string | null;
    listeningQuestions: number;
    listeningSections: number;
    readingQuestions: number;
    readingPassages: number;
    writingTasks: number;
    speakingTopics: number;
    lrwCompleted: boolean;
    speakingCompleted: boolean;
}

export async function fetchFullMockTestDetail(
    testId: string,
): Promise<FullMockTestDetail | null> {
    const test = await findOne("tests", testId, {
        fields: ["title", "description", "audio_url"],
        populate: {
            listening_sections: {
                fields: ["section_number"],
                populate: { questions: { fields: ["question_number"] } },
            },
            reading_passages: {
                fields: ["passage_number"],
                populate: { questions: { fields: ["question_number"] } },
            },
            writing_tasks: { fields: ["task_number"] },
            speaking_topics: { fields: ["part_number"] },
        },
    });

    if (!test) return null;

    const listenings = test.listening_sections ?? [];
    const readings = test.reading_passages ?? [];
    const writings = test.writing_tasks ?? [];
    const speakings = test.speaking_topics ?? [];

    let lrwCompleted = false;
    let speakingCompleted = false;

    const token = await getToken();
    if (token) {
        const user = await getCurrentUser();
        if (user) {
            // Latest full-mock session (if any) drives the card state.
            const sessions = await find("full-mock-test-attempts", {
                filters: {
                    user: { id: { $eq: user.id } },
                    test: { documentId: { $eq: testId } },
                },
                sort: ["createdAt:desc"],
                pagination: { pageSize: 1 },
                populate: { test_attempts: { fields: ["module_type", "status"] } },
            }, token);
            const session = sessions?.[0];
            if (session) {
                const modules = new Set(
                    (session.test_attempts ?? []).map((a: any) => a.module_type),
                );
                lrwCompleted = modules.has("listening") && modules.has("reading") && modules.has("writing");
                speakingCompleted = modules.has("speaking");
            }
        }
    }

    return {
        id: test.documentId,
        title: test.title,
        description: test.description ?? "",
        audioUrl: test.audio_url ?? null,
        listeningQuestions: listenings.reduce(
            (sum: number, s: any) => sum + (s.questions?.length ?? 0),
            0,
        ),
        listeningSections: listenings.length,
        readingQuestions: readings.reduce(
            (sum: number, p: any) => sum + (p.questions?.length ?? 0),
            0,
        ),
        readingPassages: readings.length,
        writingTasks: writings.length,
        speakingTopics: speakings.length,
        lrwCompleted,
        speakingCompleted,
    };
}
