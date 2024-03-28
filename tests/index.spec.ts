import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Page visibility", () => {
  test("should display title", async ({ page }) => {
    await expect(page).toHaveTitle("House Inmobiliaria");
  });

  test("should render the properties table", async ({ page }) => {
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("should render auth buttons", async ({ page }) => {
    const loginButton = page.getByRole("button", { name: "Acceder" });
    const registerButton = page.getByRole("button", {
      name: "Crear cuenta",
    });
    await expect(loginButton).toBeVisible();
    await expect(registerButton).toBeVisible();
  });
});
