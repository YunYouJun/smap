export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/')
    return navigateTo('/tabs/map', { replace: true })
})
