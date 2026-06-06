"use server"

import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { fetchMutation } from "convex/nextjs";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { postSchema } from "./schemas/blog";

export async function createBLogAction(formData: FormData) {
    try {
        const values = {
            title: formData.get("title"),
            content: formData.get("content"),
            image: formData.get("image"),
        };

        const parsed = postSchema.safeParse(values);
        if (!parsed.success) {
            throw new Error("Something went wrong");
        }

        const token = await getToken();
        const imageUrl = await fetchMutation(
            api.posts.generateImageUploadUrl, {}, { token }
        )
        const uploadResult = await fetch(imageUrl, {
            method: "POST",
            headers: {
                "Content-Type": parsed.data.image.type,
            },
            body: parsed.data.image
        });
        if (!uploadResult.ok) {
            return {
                error: 'Failed to upload image'
            }
        }

        const { storageId } = await uploadResult.json();

        await fetchMutation(
            api.posts.createPosts, {
            body: parsed.data.content,
            title: parsed.data.title,
            imageStorageId: storageId
        }, { token }
        )



    } catch {
        return {
            error: 'Failed to create post'
        }
    }

    revalidateTag("blog", "max");
    return redirect("/blog");
}