import { FormEventHandler, useRef } from "react";

export default function NewPoetryPage() {
  const ref = useRef<HTMLFormElement>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (ref.current) {
      const formData = new FormData(ref.current);
      const title = formData.get("title");
      const content = formData.get("content");

      const res = await fetch("/api/poetry/new", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (data.id) {
        window.location.href = `/poetry/${data.id}`;
      }
    }
  };

  return (
    <div className="p-5">
      <form ref={ref} className="flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Hertha"
        />
        <textarea
          id="content"
          name="content"
          rows={25}
          cols={80}
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder={`Beside or above me \nNaught is there to go;\nLove or unlove me,\nUnknow me or know,\nI am that which unloves me and loves;\nI am stricken, and I am the blow.`}
        />
        <button
          type="submit"
          className="py-2 px-3 bg-teal-800 text-white shadow-md h-fit inline-flex w-fit self-end"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
