<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Exchange Rates</h2>
            <button @click="fetchRates"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading">
                {{ isLoading ? 'Refreshing...' : 'Refresh Rates' }}
            </button>
        </div>

        <div v-if="isLoading" class="grid grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="p-4 border rounded animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-16"></div>
            </div>
        </div>

        <div v-else class="grid grid-cols-3 gap-4">
            <div v-for="rate in rates" :key="rate.country" class="p-4 border rounded">
                <h3>{{ rate.country }}</h3>
                <p>Currency: {{ rate.currency }}</p>
                <p>Rate: {{ rate.rate }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRates } from '../api/api'

interface Rate {
    country: string
    currency: string
    rate: number
}

const rates = ref<Rate[]>([])
const isLoading = ref(true)

const fetchRates = async () => {
    isLoading.value = true
    try {
        rates.value = await getRates()
    } catch (error) {
        console.error('Error fetching rates:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchRates)
</script>

<style scoped></style>