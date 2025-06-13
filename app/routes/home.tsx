import { Form, useActionData, useLoaderData, type ActionFunction, type LoaderFunction } from "react-router";
import type { Route } from "./+types/home";
import { parseWeight } from "~/lib/weight";
import { twj } from 'tw-to-css'
import { Weights } from "~/models/Weights.model";
import { Fragment } from "react/jsx-runtime";

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

  const { weight, unit = "kg" } = await parseWeight(weightPic)

  await Weights.insertOne({
    amount: weight,
    unit,
  })
  return Response.json({ error: null, data: { weight } })
}

export const loader: LoaderFunction = async () =>
  Response.json((await Weights.find()).map(w => ({
    id: w.id,
    weight: w.amount,
    date: w.createdAt,
    unit: w.unit,
  })))

export default function Home() {
  const actionData = useActionData()
  const loaderData = useLoaderData<{ id: string; weight: number; unit: string; date: string | Date }[]>()
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
    {loaderData.length && <dl style={twj("pl-10")}>
      {loaderData.map(w => (
        <Fragment key={w.id}>
          <dt style={twj("font-bold")}>{new Date(w.date).toLocaleDateString()}</dt>
          <dd>{w.weight} {w.unit}</dd></Fragment>
      ))}

    </dl>}
    <footer style={twj("absolute bottom-0")}>

    </footer>
  </main>
}
