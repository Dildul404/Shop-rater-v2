export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onResponseError({ response }) {
      if (response.status === 401) navigateTo('/login')
    },
  })

  return { provide: { api } }
})