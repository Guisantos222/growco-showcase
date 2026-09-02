"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  demoLoginSchema,
  type DemoLoginData,
} from "@/schemas/demoLoginSchema";

export function FormTest() {
  const [submittedData, setSubmittedData] =
    useState<DemoLoginData | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
    reset,
  } = useForm<DemoLoginData>({
    resolver: zodResolver(demoLoginSchema),

    defaultValues: {
      email: "",
      company: "",
    },
  });

  function onSubmit(
    data: DemoLoginData,
  ) {
    setSubmittedData(data);
  }

  function handleReset() {
    reset();
    setSubmittedData(null);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-[#0BA5FF]">
          Forms
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Form Laboratory
        </h1>

        <p className="mt-4 text-neutral-400">
          React Hook Form + Zod.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8"
      >
        <div>
          <label
            htmlFor="company"
            className="text-sm text-neutral-300"
          >
            Empresa
          </label>

          <input
            id="company"
            type="text"
            {...register("company")}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#0BA5FF]"
            placeholder="Demo Company"
          />

          {errors.company && (
            <p className="mt-2 text-sm text-red-400">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-sm text-neutral-300"
          >
            E-mail
          </label>

          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#0BA5FF]"
            placeholder="ricardo@growco.com"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#0BA5FF] px-6 py-3 font-medium text-white disabled:opacity-40"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-white/15 px-6 py-3"
          >
            Reset
          </button>
        </div>
      </form>

      {submittedData && (
        <section className="mt-6 rounded-[2rem] border border-[#0BA5FF]/30 bg-[#0BA5FF]/10 p-6">
          <p className="text-sm text-[#0BA5FF]">
            Dados válidos
          </p>

          <p className="mt-3">
            Empresa: {submittedData.company}
          </p>

          <p className="mt-1">
            E-mail: {submittedData.email}
          </p>
        </section>
      )}
    </div>
  );
}