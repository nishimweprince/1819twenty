import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isPhoneValid } from "@/lib/phone";
import { PhoneInput } from "./phone-input";

// The country picker is a cmdk list, which measures itself; jsdom can't.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = () => {};
});
afterEach(cleanup);

const schema = z.object({
  phone: z.string().refine(isPhoneValid, "Enter a valid phone number."),
});
type Values = z.infer<typeof schema>;

function PhoneForm({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="phone">Phone</label>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            id="phone"
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            invalid={Boolean(errors.phone)}
          />
        )}
      />
      {errors.phone ? <p>{errors.phone.message}</p> : null}
      <button type="submit">Save</button>
    </form>
  );
}

describe("PhoneInput", () => {
  it("starts with no country and a searchable calling-code picker", () => {
    render(<PhoneForm onSubmit={() => {}} />);
    expect(
      screen.getByRole("combobox", { name: "Country calling code" }),
    ).toHaveTextContent("Country");
  });

  it("rejects a number that cannot be dialled", async () => {
    const onSubmit = vi.fn();
    render(<PhoneForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "555" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      await screen.findByText("Enter a valid phone number."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("selects the country from a typed code and submits E.164", async () => {
    const onSubmit = vi.fn();
    render(<PhoneForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "+250 788 123 456" },
    });
    expect(
      screen.getByRole("combobox", { name: "Country calling code" }),
    ).toHaveTextContent("RW +250");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { phone: "+250788123456" },
        expect.anything(),
      ),
    );
  });

  it.each([
    ["0788478652", "0788 478 652"],
    ["788478652", "788 478 652"],
  ])(
    "formats %s for Rwanda with or without the leading 0",
    async (typed, shown) => {
      const onSubmit = vi.fn();
      render(<PhoneForm onSubmit={onSubmit} />);
      fireEvent.click(
        screen.getByRole("combobox", { name: "Country calling code" }),
      );
      fireEvent.change(screen.getByPlaceholderText(/Search countries/), {
        target: { value: "Rwanda" },
      });
      fireEvent.click(screen.getByText("Rwanda"));
      fireEvent.change(screen.getByLabelText("Phone"), {
        target: { value: typed },
      });
      expect(screen.getByLabelText("Phone")).toHaveValue(shown);
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      await vi.waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith(
          { phone: "+250788478652" },
          expect.anything(),
        ),
      );
    },
  );
});
