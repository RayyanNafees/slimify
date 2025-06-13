import type { ActionFunction } from "react-router";

export const action:ActionFunction = async ({request, context} ) => {
  console.log(context)

  console.log(await request.formData())
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}