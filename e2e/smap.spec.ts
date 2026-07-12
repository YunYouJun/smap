import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error')
      errors.push(message.text())
  })
  page.on('pageerror', error => errors.push(error.message))

  return errors
}

test('desktop navigation loads static data without requesting a missing API', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  const apiRequests: string[] = []

  page.on('request', (request) => {
    if (request.url().includes('/api/smap/'))
      apiRequests.push(request.url())
  })

  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')

  await expect(page).toHaveURL(/\/tabs\/map$/)
  await expect(page).toHaveTitle('SMAP 星际导航')
  await expect(page.getByRole('region', { name: '星际地图' })).toBeVisible()
  await expect(page.getByText('静态示例', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '开始导航', exact: true }).click()
  await expect(page.getByText('自动导航中', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '暂停导航', exact: true })).toBeVisible()

  expect(apiRequests).toEqual([])
  expect(runtimeErrors).toEqual([])
})

test('desktop explore keeps map tools and selected places in sync', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/tabs/explore')

  await expect(page).toHaveURL(/\/tabs\/explore$/)
  await expect(page.getByRole('heading', { name: '附近探索', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '探索详情', exact: true })).toBeVisible()

  const trafficTool = page.getByRole('button', { name: /实时路况/ })
  const initialTrafficState = await trafficTool.getAttribute('aria-pressed')

  await trafficTool.click()
  const toggledTrafficState = initialTrafficState === 'true' ? 'false' : 'true'
  await expect(trafficTool).toHaveAttribute('aria-pressed', toggledTrafficState)

  await page.getByRole('button', { name: /金星云顶船坞/ }).click()
  await expect(page.getByLabel('探索详情').getByText('金星云顶轨道', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '选择地点：金星云顶轨道' })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: '打车', exact: true }).click()
  await expect(page).toHaveURL(/\/tabs\/ride$/)
  await page.getByRole('button', { name: '探索', exact: true }).click()
  await expect(page).toHaveURL(/\/tabs\/explore$/)
  await expect(page.getByRole('button', { name: /实时路况/ })).toHaveAttribute('aria-pressed', toggledTrafficState)
  await expect(page.getByRole('button', { name: '选择地点：金星云顶轨道' })).toHaveAttribute('aria-pressed', 'true')

  expect(runtimeErrors).toEqual([])
})

test('desktop ride selection reaches a visible response state and service routes stay aligned', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/tabs/ride')

  await expect(page).toHaveURL(/\/tabs\/ride$/)
  await expect(page.getByRole('heading', { name: '星际打车', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '接驾状态', exact: true })).toBeVisible()

  const desktopRidePanel = page.locator('.desktop-ride-panel')
  const warpOption = desktopRidePanel.getByRole('button', { name: /跃迁专车/ })

  await warpOption.click()
  await expect(warpOption).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: /呼叫跃迁专车/ }).click()
  await expect(page.getByLabel('接驾状态').getByText('跃迁专车已响应', { exact: true })).toBeVisible()
  await expect(page.getByLabel('接驾状态').getByText('快船正在前往上船点', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '探索', exact: true }).click()
  await expect(page).toHaveURL(/\/tabs\/explore$/)
  await expect(page.getByRole('heading', { name: '附近探索', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '打车', exact: true }).click()
  await expect(page).toHaveURL(/\/tabs\/ride$/)
  await expect(page.getByLabel('接驾状态').getByText('跃迁专车已响应', { exact: true })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('mobile explore and ride expose the same core actions', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/tabs/explore')

  await expect(page.getByRole('heading', { name: '附近探索', exact: true })).toBeVisible()

  const trafficTool = page.getByRole('button', { name: /实时路况/ })
  const initialTrafficState = await trafficTool.getAttribute('aria-pressed')

  await trafficTool.click()
  await expect(trafficTool).toHaveAttribute('aria-pressed', initialTrafficState === 'true' ? 'false' : 'true')

  const venusSpot = page.getByRole('button', { name: /金星云顶船坞/ })
  await venusSpot.click()
  await expect(venusSpot).toHaveAttribute('aria-current', 'location')

  await page.getByRole('link', { name: '打车', exact: true }).click()
  await expect(page).toHaveURL(/\/tabs\/ride$/)
  await expect(page.getByRole('heading', { name: '星际打车', exact: true })).toBeVisible()

  await page.getByRole('button', { name: /拼舱/ }).click()
  await page.getByRole('button', { name: /呼叫拼舱/ }).click()
  await expect(page.locator('.mobile-sheet').getByText('拼舱已响应', { exact: true })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('mobile profile keeps silent authentication failures user friendly', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('link', { name: '我的', exact: true }).click()

  await expect(page).toHaveURL(/\/tabs\/profile$/)
  await expect(page.getByRole('heading', { name: '我的', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '登录 YunLeFun', exact: true })).toBeVisible()
  await expect(page.getByText('同步收藏、订单与导航偏好', { exact: true })).toBeVisible()
  await expect(page.getByText('timeout', { exact: true })).toHaveCount(0)

  expect(runtimeErrors).toEqual([])
})
