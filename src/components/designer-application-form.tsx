"use client";

import { ChangeEvent, useCallback, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type FieldError,
  type Path,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  allowedUploadTypes,
  MAX_UPLOAD_BYTES,
  designerApplicationBaseSchema,
  applicationCategories,
  categoryLabels,
  businessAges,
  businessAgeLabels,
  makerTypes,
  makerLabels,
  capacityRanges,
  capacityLabels,
  shippingCapabilities,
  shippingLabels,
  platformGoals,
  goalLabels,
  eventInterestOptions,
  eventInterestLabels,
} from "@/lib/validation";
import { isStorageConfigured, simulatedReference } from "@/lib/submission";
import { Checkbox } from "./ui/checkbox";
import { FileInput } from "./ui/file-input";
import { Radio } from "./ui/radio";
import { Select } from "./ui/select";
import { Turnstile } from "./turnstile";
import {
  button,
  buttonSecondary,
  fieldHint,
  fieldLabel,
  input as inputClass,
  textarea as textareaClass,
} from "@/lib/styles";

const steps = [
  "Contact & brand",
  "About the brand",
  "Production & fulfillment",
  "Portfolio",
  "Fit & goals",
  "Review",
] as const;
const applicationSchema = designerApplicationBaseSchema
  .omit({
    consentedAt: true,
    consentCopyVersion: true,
    idempotencyKey: true,
    website: true,
    turnstileToken: true,
  })
  .superRefine((values, context) => {
    if (values.sellsOnline && !values.onlineChannels.trim())
      context.addIssue({
        code: "custom",
        path: ["onlineChannels"],
        message: "Tell us where you sell online.",
      });
  });
type FormValues = z.input<typeof applicationSchema>;
const stepFields: Array<Array<keyof FormValues>> = [
  [
    "fullName",
    "brandName",
    "email",
    "phoneWhatsapp",
    "countryCity",
    "socialHandles",
    "websiteUrl",
  ],
  ["categories", "brandStory", "yearsInBusiness", "madeBy", "madeWhere"],
  [
    "sellsOnline",
    "onlineChannels",
    "monthlyCapacity",
    "wholesaleExportExperience",
    "shippingCapability",
  ],
  ["lookbookUrl"],
  [
    "whyJoin",
    "goals",
    "additionalNotes",
    "eventInterest",
    "privacyConsent",
    "marketingConsent",
  ],
  [],
];
const fieldWrap = "grid gap-1.5";
const gridTwo = "grid grid-cols-2 items-start gap-6 max-[620px]:grid-cols-1";
const choiceRow =
  "grid grid-cols-[auto_1fr] items-start gap-2.5 text-[0.92rem] leading-relaxed [&>span:first-child]:mt-0.5";

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.82rem] font-semibold text-danger" role="alert">
      {children}
    </span>
  );
}

function TextField({
  label,
  error,
  registration,
  required = true,
  hint,
  type = "text",
  autoComplete,
}: {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  required?: boolean;
  hint?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className={fieldWrap}>
      <span className={fieldLabel}>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className={inputClass}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        {...registration}
      />
      {hint ? <span className={fieldHint}>{hint}</span> : null}
      {error?.message ? <ErrorText>{error.message}</ErrorText> : null}
    </label>
  );
}

// The custom Select is a button, not a form control, so it is driven through
// Controller and labelled by id rather than by a wrapping <label>.
function SelectField({
  label,
  name,
  control,
  error,
  options,
}: {
  label: string;
  name: Path<FormValues>;
  control: Control<FormValues>;
  error?: FieldError;
  options: readonly string[];
}) {
  const id = useId();
  const labels: Record<string, string> = {
    ...businessAgeLabels,
    ...makerLabels,
    ...capacityLabels,
    ...shippingLabels,
    ...eventInterestLabels,
  };
  const selectOptions = options.map((value) => ({
    value,
    label: labels[value] ?? value,
  }));
  return (
    <div className={fieldWrap}>
      <label className={fieldLabel} htmlFor={id}>
        {label} *
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            id={id}
            name={field.name}
            options={selectOptions}
            value={typeof field.value === "string" ? field.value : ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            invalid={Boolean(error)}
            placeholder="Choose one"
          />
        )}
      />
      {error?.message ? <ErrorText>{error.message}</ErrorText> : null}
    </div>
  );
}

function ChoiceGroup({
  legend,
  error,
  children,
}: {
  legend: string;
  error?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="col-span-full grid gap-3 border-0 p-0">
      <legend className={`${fieldLabel} mb-3`}>{legend} *</legend>
      {children}
      {error?.message ? <ErrorText>{error.message}</ErrorText> : null}
    </fieldset>
  );
}

function validateFiles(files: File[]) {
  if (files.length < 3 || files.length > 5)
    return "Upload 3–5 photos of your work.";
  if (
    files.some(
      (file) =>
        !allowedUploadTypes.includes(
          file.type as (typeof allowedUploadTypes)[number],
        ),
    )
  )
    return "Use JPEG, PNG, or WebP photos.";
  if (files.some((file) => file.size > MAX_UPLOAD_BYTES))
    return "Each photo must be 20 MB or smaller.";
  return "";
}

export function DesignerApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID(),
  );
  const [draftSession, setDraftSession] = useState<{
    applicationId: string;
    draftToken: string;
    uploadedPaths: string[];
  } | null>(null);
  const handleToken = useCallback(
    (token: string) => setTurnstileToken(token),
    [],
  );

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      brandName: "",
      email: "",
      phoneWhatsapp: "",
      countryCity: "",
      socialHandles: "",
      websiteUrl: "",
      categories: [],
      brandStory: "",
      yearsInBusiness: undefined,
      madeBy: undefined,
      madeWhere: "",
      sellsOnline: undefined,
      onlineChannels: "",
      monthlyCapacity: undefined,
      wholesaleExportExperience: undefined,
      shippingCapability: undefined,
      lookbookUrl: "",
      whyJoin: "",
      goals: [],
      additionalNotes: "",
      eventInterest: undefined,
      privacyConsent: false as true,
      marketingConsent: false,
    },
  });
  const sellsOnline = useWatch({ control, name: "sellsOnline" });
  const wholesaleExportExperience = useWatch({
    control,
    name: "wholesaleExportExperience",
  });
  const selectedCategories = useWatch({ control, name: "categories" }) ?? [];
  const selectedGoals = useWatch({ control, name: "goals" }) ?? [];
  const values = getValues();

  function resetUploadSession() {
    if (draftSession) {
      setDraftSession(null);
      setIdempotencyKey(crypto.randomUUID());
    }
  }

  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    resetUploadSession();
    const next = [...files, ...selected];
    setFiles(next);
    setFileError(validateFiles(next));
    event.target.value = "";
  }

  function removeFile(index: number) {
    resetUploadSession();
    const next = files.filter((_, current) => current !== index);
    setFiles(next);
    setFileError(validateFiles(next));
  }

  async function next() {
    const valid = await trigger(stepFields[step]);
    const photoMessage = step === 3 ? validateFiles(files) : "";
    if (step === 3) setFileError(photoMessage);
    if (!valid || photoMessage) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  function handleInvalid(formErrors: FieldErrors<FormValues>) {
    const first = stepFields.findIndex((fields) =>
      fields.some((field) => formErrors[field]),
    );
    const photoMessage = validateFiles(files);
    const target = first < 0 ? (photoMessage ? 3 : 0) : first;
    setStep(target);
    if (target === 3) setFileError(photoMessage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  async function submitApplication(formValues: FormValues) {
    const photoMessage = validateFiles(files);
    if (photoMessage) {
      setStep(3);
      setFileError(photoMessage);
      return;
    }
    setStatus("submitting");
    setStatusMessage("Saving your application");
    if (
      !isStorageConfigured({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
    ) {
      router.push(
        `/designers/apply/received?reference=${encodeURIComponent(simulatedReference(idempotencyKey))}&simulated=1`,
      );
      return;
    }
    try {
      let session = draftSession;
      if (!session) {
        const response = await fetch("/api/designer-applications/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formValues,
            consentedAt: new Date().toISOString(),
            consentCopyVersion: "2026-09-22",
            idempotencyKey,
            website: "",
            turnstileToken,
          }),
        });
        const draft = await response.json();
        if (!response.ok || !draft.ok)
          throw new Error(draft.message ?? "Could not save your application.");
        session = {
          applicationId: draft.data.applicationId,
          draftToken: draft.data.draftToken,
          uploadedPaths: [],
        };
        setDraftSession(session);
      }
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey)
        throw new Error("Application storage is not configured yet.");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const paths = [...session.uploadedPaths];
      for (let index = paths.length; index < files.length; index++) {
        const file = files[index];
        setStatusMessage(`Uploading photo ${index + 1} of ${files.length}`);
        const response = await fetch(
          `/api/designer-applications/${session.applicationId}/upload-url`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              draftToken: session.draftToken,
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            }),
          },
        );
        const upload = await response.json();
        if (!response.ok || !upload.ok)
          throw new Error(
            upload.message ?? "Could not prepare the photo upload.",
          );
        const { error } = await supabase.storage
          .from("designer-lookbooks")
          .uploadToSignedUrl(upload.data.path, upload.data.token, file, {
            contentType: file.type,
          });
        if (error)
          throw new Error(
            `Photo ${index + 1} could not be uploaded. Try again.`,
          );
        paths.push(upload.data.path);
        setDraftSession({ ...session, uploadedPaths: [...paths] });
      }
      setStatusMessage("Sending your receipt");
      const response = await fetch(
        `/api/designer-applications/${session.applicationId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draftToken: session.draftToken,
            uploadPaths: paths,
            idempotencyKey,
          }),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(
          result.message ?? "Could not finalize your application.",
        );
      router.push(
        `/designers/apply/received?reference=${encodeURIComponent(result.data.reference)}`,
      );
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not submit your application. Try again.",
      );
    }
  }

  return (
    <div className="grid grid-cols-[16rem_1fr] overflow-hidden rounded-md border border-ink/28 bg-paper-hi max-[820px]:grid-cols-1">
      <aside
        data-ground="ink"
        className="bg-ink p-8 text-paper max-[820px]:p-4"
        aria-label="Application progress"
      >
        <div className="mb-6 font-display text-[1.35rem] max-[820px]:hidden">
          Application
        </div>
        <ol className="grid list-none gap-2 p-0 max-[820px]:grid-cols-3 max-[620px]:grid-cols-2">
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={`flex items-center gap-3 text-[0.86rem] ${index <= step ? "text-paper" : "text-paper/66"}`}
            >
              <span
                aria-hidden="true"
                className={`grid size-7 flex-none place-items-center rounded-full border ${index === step ? "border-gold bg-gold text-ink" : "border-current"}`}
              >
                {index < step ? "✓" : index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
      </aside>
      <form
        className="min-w-0 p-[clamp(1.5rem,5vw,4.5rem)]"
        onSubmit={handleSubmit(submitApplication, handleInvalid)}
        noValidate
      >
        {status === "error" ? (
          <div
            role="alert"
            className="mb-6 rounded-md border border-danger/40 bg-danger/8 p-4 text-danger"
          >
            {statusMessage}
          </div>
        ) : null}
        {status === "submitting" ? (
          <div
            role="status"
            className="mb-6 rounded-md border border-gold/45 bg-gold/18 p-4"
          >
            {statusMessage}
          </div>
        ) : null}

        {step === 0 ? (
          <fieldset className="border-0 p-0">
            <legend className="mb-4 font-display text-[2rem]">
              Contact & brand
            </legend>
            <p className="mb-8 text-ink/75">
              Tell us who you are and how to reach you.
            </p>
            <div className={gridTwo}>
              <TextField
                label="Full name"
                error={errors.fullName}
                registration={register("fullName")}
                autoComplete="name"
              />
              <TextField
                label="Brand/business name"
                error={errors.brandName}
                registration={register("brandName")}
                autoComplete="organization"
              />
              <TextField
                label="Email address"
                error={errors.email}
                registration={register("email")}
                type="email"
                autoComplete="email"
              />
              <TextField
                label="Phone number"
                error={errors.phoneWhatsapp}
                registration={register("phoneWhatsapp")}
                autoComplete="tel"
                hint="Include your WhatsApp number if it's different."
              />
              <TextField
                label="Country/city based in"
                error={errors.countryCity}
                registration={register("countryCity")}
              />
              <TextField
                label="Instagram/social handles"
                error={errors.socialHandles}
                registration={register("socialHandles")}
                hint="An @handle is fine."
              />
              <TextField
                label="Website (if any)"
                error={errors.websiteUrl}
                registration={register("websiteUrl")}
                required={false}
                type="url"
                hint="Include https://"
              />
            </div>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className="border-0 p-0">
            <legend className="mb-4 font-display text-[2rem]">
              About the brand
            </legend>
            <p className="mb-8 text-ink/75">
              Share the story and people behind your work.
            </p>
            <div className={gridTwo}>
              <ChoiceGroup
                legend="8. What category best describes your work?"
                error={errors.categories as FieldError}
              >
                <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
                  {applicationCategories.map((value) => (
                    <label key={value} className={choiceRow}>
                      <Checkbox
                        value={value}
                        aria-invalid={Boolean(errors.categories)}
                        {...register("categories")}
                      />
                      <span>{categoryLabels[value]}</span>
                    </label>
                  ))}
                </div>
              </ChoiceGroup>
              <label className="col-span-full grid gap-1.5">
                <span className={fieldLabel}>
                  9. Tell us about your brand and design story *
                </span>
                <textarea
                  className={textareaClass}
                  aria-invalid={Boolean(errors.brandStory)}
                  {...register("brandStory")}
                />
                {errors.brandStory?.message ? (
                  <ErrorText>{errors.brandStory.message}</ErrorText>
                ) : null}
              </label>
              <SelectField
                label="10. How long have you been in business?"
                name="yearsInBusiness"
                control={control}
                error={errors.yearsInBusiness}
                options={businessAges}
              />
              <SelectField
                label="11. Who makes your pieces?"
                name="madeBy"
                control={control}
                error={errors.madeBy}
                options={makerTypes}
              />
              <TextField
                label="11. Where are your pieces made?"
                error={errors.madeWhere}
                registration={register("madeWhere")}
              />
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="border-0 p-0">
            <legend className="mb-4 font-display text-[2rem]">
              Production & fulfillment
            </legend>
            <p className="mb-8 text-ink/75">
              Help us understand how your work reaches customers.
            </p>
            <div className={gridTwo}>
              <ChoiceGroup
                legend="12. Do you currently sell online?"
                error={errors.sellsOnline as FieldError}
              >
                {[true, false].map((value) => (
                  <label key={String(value)} className={choiceRow}>
                    <Radio
                      name="sellsOnline"
                      value={String(value)}
                      checked={sellsOnline === value}
                      onChange={() =>
                        setValue("sellsOnline", value, {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                    />
                    <span>{value ? "Yes" : "No"}</span>
                  </label>
                ))}
              </ChoiceGroup>
              {sellsOnline ? (
                <div className="col-span-full">
                  <TextField
                    label="12. If so, where?"
                    error={errors.onlineChannels}
                    registration={register("onlineChannels")}
                  />
                </div>
              ) : null}
              <SelectField
                label="13. What's your current monthly production capacity?"
                name="monthlyCapacity"
                control={control}
                error={errors.monthlyCapacity}
                options={capacityRanges}
              />
              <ChoiceGroup
                legend="14. Do you have existing wholesale/export experience?"
                error={errors.wholesaleExportExperience as FieldError}
              >
                {[true, false].map((value) => (
                  <label key={String(value)} className={choiceRow}>
                    <Radio
                      name="wholesaleExportExperience"
                      value={String(value)}
                      checked={wholesaleExportExperience === value}
                      onChange={() =>
                        setValue("wholesaleExportExperience", value, {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                    />
                    <span>{value ? "Yes" : "No"}</span>
                  </label>
                ))}
              </ChoiceGroup>
              <SelectField
                label="15. Can you ship internationally, or would you need support with logistics?"
                name="shippingCapability"
                control={control}
                error={errors.shippingCapability}
                options={shippingCapabilities}
              />
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="border-0 p-0">
            <legend className="mb-4 font-display text-[2rem]">Portfolio</legend>
            <p className="mb-8 text-ink/75">Show us examples of your work.</p>
            <div className="grid gap-6">
              <div className={fieldWrap}>
                <label className={fieldLabel} htmlFor="portfolio-photos">
                  16. Upload 3–5 photos of your work *
                </label>
                <FileInput
                  id="portfolio-photos"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectFiles}
                  aria-invalid={Boolean(fileError)}
                  label="Choose photos"
                  hint="or drop them here"
                />
                <span className={fieldHint}>
                  JPEG, PNG, or WebP. Up to 20 MB per photo.
                </span>
                {fileError ? <ErrorText>{fileError}</ErrorText> : null}
              </div>
              {files.length ? (
                <ul className="grid gap-2 pl-0" aria-label="Selected photos">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="flex items-center justify-between gap-3 border-b border-ink/12 py-2"
                    >
                      <span className="min-w-0 truncate">{file.name}</span>
                      <button
                        type="button"
                        className="text-[0.85rem] font-semibold underline"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <TextField
                label="17. Link to a lookbook or catalog"
                error={errors.lookbookUrl}
                registration={register("lookbookUrl")}
                required={false}
                type="url"
                hint="Optional; include https://"
              />
            </div>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className="border-0 p-0">
            <legend className="mb-4 font-display text-[2rem]">
              Fit & goals
            </legend>
            <p className="mb-8 text-ink/75">
              Tell us what you hope to build with us.
            </p>
            <div className="grid gap-7">
              <label className={fieldWrap}>
                <span className={fieldLabel}>
                  18. Why do you want to join Eighteen Nineteen Twenty? *
                </span>
                <textarea
                  className={textareaClass}
                  aria-invalid={Boolean(errors.whyJoin)}
                  {...register("whyJoin")}
                />
                {errors.whyJoin?.message ? (
                  <ErrorText>{errors.whyJoin.message}</ErrorText>
                ) : null}
              </label>
              <ChoiceGroup
                legend="19. What are you hoping to gain from this platform?"
                error={errors.goals as FieldError}
              >
                <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
                  {platformGoals.map((value) => (
                    <label key={value} className={choiceRow}>
                      <Checkbox
                        value={value}
                        aria-invalid={Boolean(errors.goals)}
                        {...register("goals")}
                      />
                      <span>{goalLabels[value]}</span>
                    </label>
                  ))}
                </div>
              </ChoiceGroup>
              <label className={fieldWrap}>
                <span className={fieldLabel}>
                  20. Anything else you&rsquo;d like us to know?
                </span>
                <textarea
                  className={textareaClass}
                  {...register("additionalNotes")}
                />
              </label>
              <ChoiceGroup
                legend="21. Interested in a 2027 Africa international fashion and goods event?"
                error={errors.eventInterest as FieldError}
              >
                {eventInterestOptions.map((value) => (
                  <label key={value} className={choiceRow}>
                    <Radio
                      value={value}
                      aria-invalid={Boolean(errors.eventInterest)}
                      {...register("eventInterest")}
                    />
                    <span>{eventInterestLabels[value]}</span>
                  </label>
                ))}
              </ChoiceGroup>
              <div className="grid gap-4 border-t border-ink/12 pt-6">
                <label className={choiceRow}>
                  <Checkbox
                    aria-invalid={Boolean(errors.privacyConsent)}
                    {...register("privacyConsent")}
                  />
                  <span>
                    I authorize Eighteen Nineteen Twenty to process my
                    information and review my photos for partnership evaluation.
                    I have read the{" "}
                    <Link href="/privacy" target="_blank">
                      privacy notice
                    </Link>
                    . *
                  </span>
                </label>
                {errors.privacyConsent?.message ? (
                  <ErrorText>{errors.privacyConsent.message}</ErrorText>
                ) : null}
                <label className={choiceRow}>
                  <Checkbox {...register("marketingConsent")} />
                  <span>
                    Also send me occasional Eighteen Nineteen Twenty news. This
                    is optional and requires email confirmation.
                  </span>
                </label>
              </div>
              <Turnstile onToken={handleToken} />
            </div>
          </fieldset>
        ) : null}

        {step === 5 ? (
          <fieldset className="border-0 p-0">
            <legend className="mb-4 font-display text-[2rem]">
              Review your application
            </legend>
            <p className="mb-8 text-ink/75">
              Check your answers before sending them to our team.
            </p>
            <dl className="border-t border-ink/12">
              {[
                ["Full name", values.fullName],
                ["Brand/business name", values.brandName],
                ["Email address", values.email],
                ["Phone / WhatsApp", values.phoneWhatsapp],
                ["Country/city", values.countryCity],
                ["Social handles", values.socialHandles],
                ["Website", values.websiteUrl || "Not provided"],
                [
                  "Categories",
                  selectedCategories.map((v) => categoryLabels[v]).join(", "),
                ],
                ["Brand story", values.brandStory],
                [
                  "Years in business",
                  businessAgeLabels[values.yearsInBusiness],
                ],
                ["Made by", makerLabels[values.madeBy]],
                ["Made where", values.madeWhere],
                ["Sells online", values.sellsOnline ? "Yes" : "No"],
                [
                  "Online channels",
                  values.sellsOnline ? values.onlineChannels : "Not applicable",
                ],
                ["Monthly capacity", capacityLabels[values.monthlyCapacity]],
                [
                  "Wholesale/export experience",
                  values.wholesaleExportExperience ? "Yes" : "No",
                ],
                ["Shipping", shippingLabels[values.shippingCapability]],
                ["Photos", files.map((file) => file.name).join(", ")],
                ["Lookbook", values.lookbookUrl || "Not provided"],
                ["Why join", values.whyJoin],
                ["Goals", selectedGoals.map((v) => goalLabels[v]).join(", ")],
                ["Additional notes", values.additionalNotes || "Not provided"],
                ["2027 event", eventInterestLabels[values.eventInterest]],
                ["Privacy consent", "Yes"],
                ["Marketing updates", values.marketingConsent ? "Yes" : "No"],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="grid grid-cols-[12rem_1fr] gap-4 border-b border-ink/12 py-3 max-[620px]:grid-cols-1 max-[620px]:gap-0.5"
                >
                  <dt className="text-ink/75">{term}</dt>
                  <dd className="m-0 [overflow-wrap:anywhere]">{value}</dd>
                </div>
              ))}
            </dl>
          </fieldset>
        ) : null}

        <div className="mt-9 flex items-center justify-between gap-4 border-t border-ink/12 pt-6">
          <button
            className={buttonSecondary}
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            disabled={step === 0 || status === "submitting"}
          >
            Back
          </button>
          {step < 5 ? (
            <button className={button} type="button" onClick={next}>
              Continue
            </button>
          ) : (
            <button
              className={button}
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending" : "Send application"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
