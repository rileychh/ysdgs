<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

async function signIn() {
  await authClient.signIn.social({ provider: 'google' })
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <button @click="signIn">
      Sign in with Google
    </button>
  </div>
</template>
