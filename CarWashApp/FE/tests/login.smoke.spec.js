import { test, expect } from "@playwright/test";

test("shows the login screen and registration toggle", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await expect(page.getByLabel("Email or Phone")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();

  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
  await expect(page.getByLabel("Username")).toBeVisible();
});
