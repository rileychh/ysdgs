import { authClient } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(() => {
  const session = authClient.useSession()

  // If user is not authenticated, redirect to home/login page
  if (!session.value.data?.user) {
    return navigateTo('/')
  }
})
