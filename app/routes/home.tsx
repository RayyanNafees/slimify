import { Form, useActionData, type ActionFunction } from "react-router";
import type { Route } from "./+types/home";
import { parseWeight } from "~/lib/weight";
import {twj} from 'tw-to-css'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Matapa | Track weight" },
    { name: "description", content: "AI poweered weight tracking application" },
  ];
}
export const action: ActionFunction = async ({ request }) => {

  const fd = await request.formData()
  const weightPic = fd.get('weight-pic') as File

  if (!weightPic) return Response.json({ error: "Invalid pic, reupload", data: { weight: 0 } })

  const weight = await parseWeight(weightPic)
  return Response.json({ error: null, data: { weight } })
}
export default function Home() {
  const actionData = useActionData()
  return <main style={twj("relative")}>
    <header style={twj("relative top-0 mx-10")}>
      <hgroup>
        <h1>Motapa</h1>
        <h2>Track your daily weight</h2>
      </hgroup>
    </header>
    <article style={twj("mx-10 rounded relative shadow")}>
      <h3>Upload today's weight</h3>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="weight-pic" />
        <input type="submit" value="Upload" />

      </Form>
      <small>{actionData?.error}</small>
    </article >
    {actionData?.data?.weight && <dl style={twj("pl-10")}>

      <dt style={twj("font-bold")}>{new Date().toLocaleDateString()}</dt>
      <dd>{actionData.data.weight}</dd>
    </dl>}
    <footer style={twj("absolute bottom-0")}>

    </footer>
  </main>
}
