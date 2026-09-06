import { expect, test } from '@playwright/test'

test('sign in button is visible on desktop', async ({ page, isMobile }) => {
  test.skip(isMobile)

  await page.goto('/')

  const signInLocator = page.locator('text=Sign in').first()
  await expect(signInLocator).toBeVisible()
  await expect(signInLocator).toHaveAttribute(
    'href',
    'https://plus.dropzone.dev'
  )
})

test('sign in button is in hamburger button', async ({ page, isMobile }) => {
  test.skip(!isMobile)

  await page.goto('/')

  await expect(
    page.locator('header >> text=Sign in >> visible=true')
  ).not.toBeVisible()

  await page.locator('[aria-label="Open Menu"]').click()

  const signInLocator = page.locator('header >> text=Sign in >> visible=true')
  await expect(signInLocator).toBeVisible()
  await expect(signInLocator).toHaveAttribute(
    'href',
    'https://plus.dropzone.dev'
  )

  await page.locator('[aria-label="Close Menu"]').click()

  await expect(
    page.locator('header >> text=Sign in >> visible=true')
  ).not.toBeVisible()
})
