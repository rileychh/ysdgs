<script setup lang="ts">
import { watchEffect } from 'vue'
import { Button } from '~/components/ui/button'
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: 'public',
})

const session = authClient.useSession()

// Redirect authenticated users to dashboard
watchEffect(() => {
  if (session.value.data?.user) {
    navigateTo('/dashboard')
  }
})

async function signIn() {
  await authClient.signIn.social({ provider: 'google' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <div class="mx-auto max-w-2xl text-center">
      <h1
        class="
          mb-4 text-4xl font-bold tracking-tight
          sm:text-5xl
          md:text-6xl
        "
      >
        YSDGS
      </h1>
      <p
        class="
          mb-8 text-lg text-muted-foreground
          sm:text-xl
        "
      >
        A simple platform for managing your academic workflow.
      </p>
      <Button
        size="lg"
        @click="signIn"
      >
        Log in with Google
      </Button>
    </div>
  </div>
</template>
