import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Combobox } from "./combobox";

// cmdk measures its list; jsdom has neither API.
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

const options = [
  { value: "NG", label: "Nigeria", hint: "+234" },
  { value: "RW", label: "Rwanda", hint: "+250" },
];

describe("Combobox", () => {
  it("filters by hint and commits the chosen value", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        value=""
        onValueChange={onValueChange}
        options={options}
        ariaLabel="Country"
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Country" });
    fireEvent.click(trigger);
    expect(
      document.getElementById(trigger.getAttribute("aria-controls")!),
    ).not.toBeNull();

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "250" },
    });
    expect(screen.queryByText("Nigeria")).toBeNull();
    fireEvent.click(screen.getByText("Rwanda"));
    expect(onValueChange).toHaveBeenCalledWith("RW");
  });
});
