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

  await page.getByLabel('模拟速度').getByRole('button', { name: '4×', exact: true }).click()
  await page.getByRole('button', { name: '开始导航', exact: true }).click()
  await expect(page.getByText('自动导航中', { exact: true })).toBeVisible()
  const pauseNavigation = page.getByRole('button', { name: '暂停导航', exact: true })
  const routeProgress = page.locator('[aria-label^="航线进度 "]')

  await expect(pauseNavigation).toBeVisible()
  await expect.poll(async () => {
    const label = await routeProgress.getAttribute('aria-label')
    return Number(label?.match(/\d+/)?.[0] ?? 0)
  }).toBeGreaterThan(0)

  await pauseNavigation.click()
  await expect(page.getByText('导航已暂停', { exact: true })).toBeVisible()
  const pausedProgress = await routeProgress.getAttribute('aria-label')
  await page.waitForTimeout(1000)
  await expect(routeProgress).toHaveAttribute('aria-label', pausedProgress ?? '')

  await page.getByRole('button', { name: '继续导航', exact: true }).click()
  await expect(page.getByLabel('行程摘要')).toContainText('本次模拟已完成', { timeout: 10_000 })
  await expect(page.getByRole('heading', { name: '已抵达目的地', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '重新导航', exact: true })).toBeVisible()

  expect(apiRequests).toEqual([])
  expect(runtimeErrors).toEqual([])
})

test('mobile navigation completes entirely in the static client', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  const apiRequests: string[] = []

  page.on('request', (request) => {
    if (request.url().includes('/api/smap/'))
      apiRequests.push(request.url())
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/tabs/map')

  await expect(page.getByText('演示导航将在本地推进，不会请求定位或远端服务', { exact: true })).toBeVisible()
  await page.getByLabel('演示速度').getByRole('button', { name: '4×', exact: true }).click()
  await page.getByRole('button', { name: '开始导航', exact: true }).click()

  await expect(page.getByRole('button', { name: '暂停导航', exact: true })).toBeVisible()
  await expect(page.getByText('导航已启动：正在前往 天狼跃迁点', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '已抵达', exact: true })).toBeVisible({ timeout: 10_000 })
  await expect(page.getByLabel('驾船路线方案').getByText('6 个航段 · 9 条事件', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '重新导航', exact: true })).toBeVisible()

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

test('mobile profile uses redirect SSO without a hidden iframe', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  const ssoRequests: string[] = []

  page.on('request', (request) => {
    if (request.url().startsWith('https://www.yunle.fun/'))
      ssoRequests.push(request.url())
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('link', { name: '我的', exact: true }).click()

  await expect(page).toHaveURL(/\/tabs\/profile$/)
  await expect(page.getByRole('heading', { name: '我的', exact: true })).toBeVisible()
  const loginButton = page.getByRole('button', { name: '登录 YunLeFun', exact: true })
  await expect(loginButton).toBeVisible()
  await expect(page.getByText('安全重定向 · 浏览器临时会话', { exact: true })).toBeVisible()
  await expect(page.getByText('timeout', { exact: true })).toHaveCount(0)
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(ssoRequests).toEqual([])

  await loginButton.click()
  await expect(page.getByText('当前域名尚未登记为登录回跳地址', { exact: true })).toBeVisible()
  await expect(page).toHaveURL(/\/tabs\/profile$/)

  expect(ssoRequests).toEqual([])
  expect(runtimeErrors).toEqual([])
})
