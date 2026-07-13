export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-semibold tracking-tight">
          {" "}
          Task &amp; Document Workspace{" "}
        </h1>{" "}
        <p className="mt-2 text-sm text-gray-500">
          {" "}
          Starter scaffold. This is your playground to build the app.{" "}
        </p>{" "}
      </div>{" "}
      <div className="rounded-lg border border-gray-200 p-5 text-sm leading-relaxed">
        {" "}
        <p className="font-medium">Getting started</p>{" "}
        <ol className="mt-2 list-inside list-decimal space-y-1 text-gray-600">
          {" "}
          <li>
            {" "}
            Read{" "}
            <code className="rounded bg-gray-100 px-1">
              REQUIREMENTS.md
            </code>{" "}
            for the full scope and acceptance criteria.{" "}
          </li>{" "}
          <li>
            {" "}
            Create a mockapi.io project and set{" "}
            <code className="rounded bg-gray-100 px-1">
              {" "}
              NEXT_PUBLIC_API_BASE_URL{" "}
            </code>{" "}
            in <code className="rounded bg-gray-100 px-1">
              .env.local
            </code> (see{" "}
            <code className="rounded bg-gray-100 px-1">.env.example</code>
            ).{" "}
          </li>{" "}
          <li>Build the Dashboard, Tasks, and Documents modules.</li>{" "}
        </ol>{" "}
      </div>{" "}
      <p className="text-xs text-gray-400">
        {" "}
        Replace this page with your Dashboard when you start building.{" "}
      </p>{" "}
    </main>
  );
}
