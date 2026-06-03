"use client"
import { commentSchema } from "@/app/schemas/comments";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Loader2, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

// interface iAppProps {
//     comments: {
//         _id: Id<"comments">;
//         _creationTime: number;
//         body: string;
//         authorId: string;
//         postId: Id<"posts">;
//         authorName: string;
//     }[]
// }


export function CommentSection(props: { preloadedComment: Preloaded<typeof api.comments.getCommentsByPostId> }) {

    const params = useParams<{ postId: Id<"posts"> }>();

    const data = usePreloadedQuery(props.preloadedComment)
    const [isPending, startTransition] = useTransition();


    const createComment = useMutation(api.comments.createComment)

    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.postId
        }
    })

    async function onSubmit(data: z.infer<typeof commentSchema>) {
        startTransition(async () => {
            try {
                await createComment(data);
                form.reset();
                toast.success('comment posted')
            } catch {
                toast.error("Failed to create post")
            }
        })

    }

    if (data === undefined) {
        return <p>Loading...</p>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center ga-2 birder-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-bold"> {data.length} Comments</h2>
            </CardHeader>
            <CardContent className="space-y-8">
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <Controller name="body" control={form.control} render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Textarea aria-invalid={fieldState.invalid} placeholder="Share your thoughts" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />

                    <Button disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>) : (
                            <span>Submit</span>
                        )
                        }
                    </Button>
                </form>

                {data?.length > 0 && <Separator />}

                <section className="space-y-6">
                    {data?.map((comment) => (
                        <div key={comment._id} className=" flex gap-4">
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}`}
                                    alt={comment.authorName}
                                />
                                <AvatarFallback>{comment.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 sace-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm">{comment.authorName}</p>
                                    <p className="text-muted-foreground text-xs">{new Date(comment._creationTime).toLocaleDateString("en-US")}</p>
                                </div>
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </CardContent>
        </Card>
    )
}