<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import {
  Avatar,
  AvatarImage,
} from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { authClient } from '~/utils/auth-client'

const session = authClient.useSession()

async function signIn() {
  await authClient.signIn.social({ provider: 'google' })
}

async function signOut() {
  await authClient.signOut()
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <header class="sticky top-0 z-50 w-full border-b bg-background">
      <div
        class="
          container flex h-16 max-w-screen-2xl items-center justify-between px-4
          lg:px-6
        "
      >
        <h1 class="font-medium">
          YSDGS
        </h1>

        <!-- Account display (when logged in) -->
        <DropdownMenu v-if="session.data?.user">
          <DropdownMenuTrigger
            class="flex cursor-pointer items-center gap-2 outline-none"
          >
            <Avatar v-if="session.data.user.image">
              <AvatarImage
                :alt="session.data.user.name || 'User'"
                :src="session.data.user.image"
              />
            </Avatar>
            <span class="text-sm font-medium">
              {{ session.data.user.name }}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel class="text-muted-foreground">
              {{ session.data.user.email }}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="text-destructive"
              @click="signOut"
            >
              <LogOut class="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Log in link (when not logged in) -->
        <button
          v-else
          class="
            text-sm font-medium
            hover:underline
          "
          @click="signIn"
        >
          Log in
        </button>
      </div>
    </header>
  </div>
</template>
