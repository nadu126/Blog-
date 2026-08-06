<script lang="ts" setup>
import landing from '~/pages/landing.vue'

const loading = ref(false)

const MIN_DURATION = 300
let shownAt = 0
let hideTimer: ReturnType<typeof setTimeout> | null = null

const show = () => {
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
    }
    shownAt = Date.now()
    loading.value = true
}

const hide = () => {
    const elapsed = Date.now() - shownAt
    const remaining = Math.max(0, MIN_DURATION - elapsed)

    if (remaining === 0) {
        loading.value = false
        return
    }

    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
        loading.value = false
        hideTimer = null
    }, remaining)
}


const nuxtApp = useNuxtApp()
nuxtApp.hook('page:start', show)
nuxtApp.hook('page:finish', hide)

</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>

<style>
@import url(../../../node_modules/modern-normalize/modern-normalize.css);

#app {}

@keyframes taichi-rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
