"use client";

import { ChangeEvent, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useForm, useWatch, type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productCategories, sizeCount } from "@/lib/validation";
import { Checkbox } from "./ui/checkbox";
import { Select } from "./ui/select";
import { Turnstile } from "./turnstile";
import { button, buttonSecondary, fieldHint, fieldLabel, input as inputClass, textarea as textareaClass } from "@/lib/styles";

const steps = ["Your brand", "Your collection", "Story & lookbook", "Review"] as const;
const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const maxFileSize = 20 * 1024 * 1024;

const applicationSchema = z
  .object({
    brandName: z.string().trim().min(2, "Enter the brand or designer name.").max(120),
    contactName: z.string().trim().min(2, "Enter the primary contact name.").max(120),
    email: z.email("Enter a valid email address.").max(254),
    phoneWhatsapp: z.string().trim().min(5, "Enter a phone or WhatsApp number.").max(80),
    countryCity: z.string().trim().min(3, "Enter the city and country.").max(160),
    websiteSocial: z.string().trim().min(2, "Enter a website or social handle.").max(300),
    productCategory: z.enum(productCategories, { message: "Choose a product category." }),
    skuCount: z
      .string()
      .refine((value) => /^\d+$/.test(value) && Number(value) >= 10, "At least 10 available items are required."),
    includesApparel: z.boolean(),
    sizeRange: z.string().trim().max(500),
    confirmsWholesale: z.literal(true, { message: "Confirm per-unit wholesale pricing." }),
    confirmsDirectShipping: z.literal(true, { message: "Confirm direct shipping capability." }),
    brandStory: z.string().trim().min(40, "Tell us a little more, at least 40 characters.").max(5000),
    additionalNotes: z.string().trim().max(3000),
    privacyConsent: z.literal(true, { message: "Consent is required to review your application." }),
    marketingConsent: z.boolean(),
  })
  .superRefine((input, context) => {
    if (input.includesApparel && sizeCount(input.sizeRange) < 5) {
      context.addIssue({ code: "custom", path: ["sizeRange"], message: "List at least five sizes, separated by commas." });
    }
  });

type FormValues = z.input<typeof applicationSchema>;

const stepFields: Array<Array<keyof FormValues>> = [
  ["brandName", "contactName", "email", "phoneWhatsapp", "countryCity", "websiteSocial"],
  ["productCategory", "skuCount", "sizeRange", "confirmsWholesale", "confirmsDirectShipping"],
  ["brandStory", "privacyConsent"],
  [],
];

const categoryOptions = [
  { value: "women", label: "Women's" },
  { value: "men", label: "Men's" },
  { value: "kids", label: "Kids" },
  { value: "home", label: "Home" },
  { value: "multiple", label: "Multiple" },
] as const;

const fieldWrap = "grid gap-1.5";
const fieldFull = "col-span-full grid gap-1.5";
const gridTwo = "grid grid-cols-2 items-start gap-6 max-[620px]:grid-cols-1";
const fieldsetBase = "m-0 border-0 p-0";
const legendBase = "mb-3 font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-tight";
const introBase = "mb-9 max-w-[58ch] text-ink/75";
const checkRow = "grid grid-cols-[auto_1fr] items-start gap-2.5 text-[0.9rem] leading-relaxed [&>span:first-child]:mt-0.5";
const checkGroup = "col-span-full mt-3 grid gap-4.5 border-t border-ink/12 pt-6";

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-danger">
      <span
        aria-hidden="true"
        className="inline-flex size-4 flex-none items-center justify-center rounded-full bg-danger text-[0.66rem] font-bold text-paper"
      >
        !
      </span>
      {children}
    </span>
  );
}

function Field({ label, hint, error, required = true, children }: {
  label: string;
  hint?: string;
  error?: FieldError;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={fieldWrap}>
      <span className={fieldLabel}>{label}{required ? " *" : ""}</span>
      {hint ? <span className={fieldHint}>{hint}</span> : null}
      {children}
      {error?.message ? <ErrorText>{error.message}</ErrorText> : null}
    </label>
  );
}

function TextField({ label, hint, error, required, type = "text", autoComplete, registration }: {
  label: string;
  hint?: string;
  error?: FieldError;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <input className={inputClass} type={type} autoComplete={autoComplete} aria-invalid={Boolean(error)} {...registration} />
    </Field>
  );
}

export function DesignerApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);

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
      brandName: "",
      contactName: "",
      email: "",
      phoneWhatsapp: "",
      countryCity: "",
      websiteSocial: "",
      productCategory: undefined as unknown as FormValues["productCategory"],
      skuCount: "",
      includesApparel: false,
      sizeRange: "",
      confirmsWholesale: false as unknown as true,
      confirmsDirectShipping: false as unknown as true,
      brandStory: "",
      additionalNotes: "",
      privacyConsent: false as unknown as true,
      marketingConsent: false,
    },
  });

  const includesApparel = useWatch({ control, name: "includesApparel" });
  const productCategory = useWatch({ control, name: "productCategory" });

  function validateFile(current: File | null) {
    if (!current) return "Add one lookbook or product image.";
    if (!allowedTypes.includes(current.type)) return "Use a PDF, PNG, JPEG, or WebP file.";
    if (current.size > maxFileSize) return "The file must be 20 MB or smaller.";
    return "";
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setFileError(selected ? validateFile(selected) : "");
  }

  async function next() {
    const valid = await trigger(stepFields[step]);
    let fileOk = true;
    if (step === 2) {
      const message = validateFile(file);
      setFileError(message);
      fileOk = !message;
    }
    if (!valid || !fileOk) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  function previous() {
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submitApplication(values: FormValues) {
    const message = validateFile(file);
    if (message || !file) {
      setStep(2);
      setFileError(message || "Add one lookbook or product image.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("Saving your application");

    const payload = {
      ...values,
      skuCount: Number(values.skuCount),
      idempotencyKey,
      consentedAt: new Date().toISOString(),
      consentCopyVersion: "2026-09-18",
      turnstileToken,
      website: "",
    };

    try {
      const draftResponse = await fetch("/api/designer-applications/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const draft = await draftResponse.json();
      if (!draftResponse.ok || !draft.ok) throw new Error(draft.message ?? "Could not save your application.");

      setStatusMessage("Preparing your secure upload");
      const uploadResponse = await fetch(`/api/designer-applications/${draft.data.applicationId}/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftToken: draft.data.draftToken,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      const upload = await uploadResponse.json();
      if (!uploadResponse.ok || !upload.ok) throw new Error(upload.message ?? "Could not prepare the upload.");

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) throw new Error("Application storage is not configured yet.");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      setStatusMessage("Uploading your lookbook");
      const { error: uploadError } = await supabase.storage
        .from("designer-lookbooks")
        .uploadToSignedUrl(upload.data.path, upload.data.token, file, { contentType: file.type });
      if (uploadError) throw new Error("The lookbook upload failed. Check your connection and try again.");

      setStatusMessage("Sending your receipt");
      const finalResponse = await fetch(`/api/designer-applications/${draft.data.applicationId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftToken: draft.data.draftToken,
          uploadPath: upload.data.path,
          idempotencyKey,
        }),
      });
      const final = await finalResponse.json();
      if (!finalResponse.ok || !final.ok) throw new Error(final.message ?? "Could not finalize your application.");
      router.push(`/designers/apply/received?reference=${encodeURIComponent(final.data.reference)}`);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Could not submit the application. Try again.");
    }
  }

  const values = getValues();
  const categoryLabel = categoryOptions.find((option) => option.value === productCategory)?.label ?? "Not selected";

  return (
    <div className="grid grid-cols-[16rem_1fr] overflow-hidden rounded-md border border-ink/28 bg-paper-hi max-[820px]:grid-cols-1">
      <aside data-ground="ink" className="bg-ink p-9 text-paper max-[820px]:p-4.5" aria-label="Application progress">
        <div className="mb-6 font-display text-[1.35rem] max-[820px]:hidden">Application</div>
        <ol className="m-0 grid list-none p-0 max-[820px]:grid-cols-4">
          {steps.map((label, index) => {
            const active = index === step;
            const complete = index < step;
            return (
              <li
                key={label}
                aria-current={active ? "step" : undefined}
                className={
                  "grid grid-cols-[2rem_1fr] items-center gap-3 py-2.5 text-[0.9rem] max-[820px]:grid-cols-1 max-[820px]:justify-items-center max-[820px]:gap-1.5 max-[820px]:text-center " +
                  (active || complete ? "text-paper" : "text-paper/66")
                }
              >
                <span
                  aria-hidden="true"
                  className={
                    "flex size-7 items-center justify-center rounded-full border " +
                    (active ? "border-gold bg-gold text-ink" : "border-current")
                  }
                >
                  {complete ? "\u2713" : index + 1}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
      </aside>

      <form className="min-w-0 p-[clamp(1.5rem,5vw,4.5rem)]" onSubmit={handleSubmit(submitApplication)} noValidate>
        {status === "error" ? (
          <div className="mb-6 flex items-center gap-2.5 rounded-md border border-danger/40 bg-danger/8 px-4 py-3 text-danger" role="alert">
            <span aria-hidden="true" className="size-2.5 flex-none rounded-full bg-danger" />
            {statusMessage}
          </div>
        ) : null}
        {status === "submitting" ? (
          <div className="mb-6 flex items-center gap-2.5 rounded-md border border-gold/45 bg-gold/18 px-4 py-3" role="status">
            <span aria-hidden="true" className="size-2.5 flex-none rounded-full bg-gold" />
            {statusMessage}
          </div>
        ) : null}

        {step === 0 ? (
          <fieldset className={fieldsetBase}>
            <legend className={legendBase}>Your brand</legend>
            <p className={introBase}>Start with the people and place behind the work.</p>
            <div className={gridTwo}>
              <TextField label="Brand or designer name" error={errors.brandName} autoComplete="organization" registration={register("brandName")} />
              <TextField label="Contact name" error={errors.contactName} autoComplete="name" registration={register("contactName")} />
              <TextField label="Email address" type="email" error={errors.email} autoComplete="email" registration={register("email")} />
              <TextField label="Phone or WhatsApp" error={errors.phoneWhatsapp} autoComplete="tel" registration={register("phoneWhatsapp")} />
              <TextField label="Country and city" error={errors.countryCity} autoComplete="country-name" registration={register("countryCity")} />
              <TextField label="Website or social handle" error={errors.websiteSocial} hint="A full URL or @handle is fine." registration={register("websiteSocial")} />
            </div>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className={fieldsetBase}>
            <legend className={legendBase}>Your collection</legend>
            <p className={introBase}>Help us understand what is available and how you can fulfill an order.</p>
            <div className={gridTwo}>
              <div className={fieldWrap}>
                <label className={fieldLabel} htmlFor="product-category">Product category *</label>
                <Select
                  id="product-category"
                  options={categoryOptions}
                  value={productCategory ?? ""}
                  onChange={(value) => setValue("productCategory", value as FormValues["productCategory"], { shouldValidate: true, shouldTouch: true })}
                  onBlur={() => trigger("productCategory")}
                  placeholder="Choose one"
                  invalid={Boolean(errors.productCategory)}
                  ariaDescribedby={errors.productCategory ? "product-category-error" : undefined}
                />
                {errors.productCategory?.message ? <span id="product-category-error"><ErrorText>{errors.productCategory.message}</ErrorText></span> : null}
              </div>
              <TextField label="Available items or SKUs" type="number" error={errors.skuCount} hint="Minimum 10." registration={register("skuCount")} />
              <div className={fieldFull}>
                <label className={checkRow}>
                  <Checkbox {...register("includesApparel")} />
                  <span><strong>This collection includes apparel.</strong><br /><span className={fieldHint}>We will ask for the available size range.</span></span>
                </label>
              </div>
              {includesApparel ? (
                <div className={fieldFull}>
                  <TextField label="Size range" error={errors.sizeRange} hint="List at least five sizes, separated by commas, for example: XS, S, M, L, XL." registration={register("sizeRange")} />
                </div>
              ) : null}
              <div className={checkGroup}>
                <label className={checkRow}>
                  <Checkbox aria-invalid={Boolean(errors.confirmsWholesale)} {...register("confirmsWholesale")} />
                  <span>I can provide per-unit wholesale pricing without a minimum order quantity. *</span>
                </label>
                {errors.confirmsWholesale ? <ErrorText>{errors.confirmsWholesale.message}</ErrorText> : null}
                <label className={checkRow}>
                  <Checkbox aria-invalid={Boolean(errors.confirmsDirectShipping)} {...register("confirmsDirectShipping")} />
                  <span>I can ship confirmed orders directly to customers in the United States. *</span>
                </label>
                {errors.confirmsDirectShipping ? <ErrorText>{errors.confirmsDirectShipping.message}</ErrorText> : null}
              </div>
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className={fieldsetBase}>
            <legend className={legendBase}>Story and lookbook</legend>
            <p className={introBase}>Show us the collection and tell us what the work carries with it.</p>
            <div className={gridTwo}>
              <label className={fieldFull}>
                <span className={fieldLabel}>Product photos or lookbook *</span>
                <span className={fieldHint}>One PDF, PNG, JPEG, or WebP file. Maximum 20 MB.</span>
                <input
                  className="flex min-h-[2.75rem] w-full cursor-pointer items-center gap-3 rounded-md border border-dashed border-ink/34 bg-paper px-2.5 py-2 text-ink/75 transition-colors duration-150 hover:border-ink/55 focus-visible:border-ink focus-within:border-ink aria-invalid:border-danger file:mr-3 file:cursor-pointer file:rounded-sm file:border file:border-ink/34 file:bg-paper-hi file:px-3.5 file:py-2 file:font-semibold file:text-ink file:transition-colors hover:file:bg-ink/8"
                  type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={selectFile} aria-invalid={Boolean(fileError)} />
                {file && !fileError ? <span className={fieldHint}>Selected: {file.name}</span> : null}
                {fileError ? <ErrorText>{fileError}</ErrorText> : null}
              </label>
              <label className={fieldFull}>
                <span className={fieldLabel}>Brand story or description *</span>
                <textarea className={textareaClass} aria-invalid={Boolean(errors.brandStory)} {...register("brandStory")} />
                {errors.brandStory ? <ErrorText>{errors.brandStory.message}</ErrorText> : null}
              </label>
              <label className={fieldFull}>
                <span className={fieldLabel}>Additional notes</span>
                <textarea className={textareaClass} {...register("additionalNotes")} />
              </label>
              <div className={checkGroup}>
                <label className={checkRow}>
                  <Checkbox aria-invalid={Boolean(errors.privacyConsent)} {...register("privacyConsent")} />
                  <span>I authorize Eighteen Nineteen Twenty to process this information and review the uploaded material for partnership evaluation. I have read the <Link href="/privacy" target="_blank">privacy notice</Link>. *</span>
                </label>
                {errors.privacyConsent ? <ErrorText>{errors.privacyConsent.message}</ErrorText> : null}
                <label className={checkRow}>
                  <Checkbox {...register("marketingConsent")} />
                  <span>Also send me occasional Eighteen Nineteen Twenty news. This is optional and requires email confirmation.</span>
                </label>
              </div>
              <Turnstile onToken={handleToken} />
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className={fieldsetBase}>
            <legend className={legendBase}>Review your application</legend>
            <p className={introBase}>Check the details below before sending your work to our team.</p>
            <dl className="mt-6 mb-0 border-t border-ink/12">
              {[
                ["Brand", values.brandName], ["Contact", values.contactName], ["Email", values.email], ["Phone / WhatsApp", values.phoneWhatsapp],
                ["Based in", values.countryCity], ["Website / social", values.websiteSocial], ["Category", categoryLabel], ["Available items", values.skuCount],
                ["Apparel sizes", values.includesApparel ? values.sizeRange : "Not applicable"], ["Lookbook", file?.name ?? "Missing"], ["Brand story", values.brandStory],
                ["Marketing updates", values.marketingConsent ? "Yes, confirmation required" : "No"],
              ].map(([term, value]) => <div className="grid grid-cols-[12rem_1fr] gap-4.5 border-b border-ink/12 py-3.5 max-[620px]:grid-cols-1 max-[620px]:gap-0.5" key={term}><dt className="text-ink/75">{term}</dt><dd className="m-0 font-semibold [overflow-wrap:anywhere]">{value}</dd></div>)}
            </dl>
          </fieldset>
        ) : null}

        <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="mt-9 flex items-center justify-between border-t border-ink/12 pt-6">
          <button className={buttonSecondary} type="button" onClick={previous} disabled={step === 0 || status === "submitting"}>Back</button>
          {step < 3 ? <button className={button} type="button" onClick={next}>Continue</button> : <button className={button} type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending" : "Send application"}</button>}
        </div>
      </form>
    </div>
  );
}
