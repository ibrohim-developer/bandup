import { notFound, redirect } from "next/navigation";
import { find, resolveTestId } from "@/lib/strapi/api";
import { getToken, getCurrentUser } from "@/lib/strapi/server";

export default async function FullMockResultsByTestPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const token = await getToken();
    if (!token) notFound();

    const user = await getCurrentUser();
    if (!user) notFound();

    const testDocId = await resolveTestId(slug);
    if (!testDocId) notFound();

    const sessions = await find("full-mock-test-attempts", {
        filters: {
            user: { id: { $eq: user.id } },
            test: { documentId: { $eq: testDocId } },
        },
        sort: ["createdAt:desc"],
        pagination: { pageSize: 1 },
        fields: ["documentId"],
    });

    const session = sessions?.[0];
    if (!session) {
        redirect(`/dashboard/full-mock-test/${slug}`);
    }

    redirect(`/dashboard/full-mock-test/results/${session.documentId}`);
}
