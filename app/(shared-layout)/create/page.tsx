"use client"

import { createBLogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function CreatePage() {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const mutation = useMutation(api.posts.createPosts)
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            content: "",
            title: "",
            image: undefined as unknown as File,
        }
    })

    function onSubmit(values: z.infer<typeof postSchema>) {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("image", values.image);

            await createBLogAction(formData);
        })
    }

    return (
        <div className="p-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="text-xl text-muted-foreground pt-4">Express Yourself Through Blogging</p>
            </div>

            <Card className="w-full max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Create Blog Article</CardTitle>
                    <CardDescription>Create a new blog article</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Title
                                        </FieldLabel>
                                        <Input
                                            aria-invalid={fieldState.invalid}
                                            placeholder="super cool title"
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Content
                                        </FieldLabel>
                                        <Textarea
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Super cool blog content"
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="image"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Image
                                        </FieldLabel>
                                        <Input
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Super cool blog content"
                                            type="file"
                                            accept="image/*"
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            onChange={(event) => {
                                                const file = event.target.files?.[0]
                                                field.onChange(file)
                                            }}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Button disabled={isPending}>{isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Loading...</span>
                                </>) : (
                                <span>Create Post</span>
                            )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}