import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/designers",
  "/designers/apply",
  "/privacy",
  "/terms",
];

for (const route of publicRoutes) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
  });
}

test("primary navigation exposes only Phase 1 destinations", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header.getByRole("link", { name: "Our Story" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Designers" })).toBeVisible();
  await expect(header.getByRole("link", { name: /Shop/i })).toHaveCount(0);
});

test("designer form keeps the visitor on the first step when required fields are absent", async ({
  page,
}) => {
  await page.goto("/designers/apply");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Enter the brand or designer name."),
  ).toBeVisible();
  await expect(page.getByRole("group", { name: "Your brand" })).toBeVisible();
});

test("commerce routes are not part of Phase 1", async ({ page }) => {
  const response = await page.goto("/shop");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This path ends here." }),
  ).toBeVisible();
});
