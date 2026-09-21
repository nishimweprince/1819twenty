import type { Metadata } from "next";
import { DesignerApplicationForm } from "@/components/designer-application-form";

export const metadata: Metadata = {
  title: "Designer Application",
  description: "Apply to join Eighteen Nineteen Twenty as an independent designer.",
};

export default function DesignerApplicationPage() {
  return (
    <section className="py-18 pb-24 max-[700px]:py-14 max-[700px]:pb-18">
      <div className="container">
        <div className="mb-12 grid grid-cols-[1.3fr_0.7fr] items-end gap-12 max-[820px]:grid-cols-1">
          <div>
            <h1 className="mb-0 max-w-[10ch]">Tell us what you make.</h1>
          </div>
          <p className="max-w-[38ch] text-[1.08rem]">Set aside about ten minutes. You will need your contact details, collection information, and one lookbook or product image.</p>
        </div>
        <DesignerApplicationForm />
      </div>
    </section>
  );
}
