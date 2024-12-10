<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Exchange Rates</h2>
            <button @click="fetchRates" class="px-4 py-2 bg-blue-500 text-white rounded">
                Refresh Rates
            </button>
        </div>

        <div class="grid grid-cols-3 gap-4">
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

const fetchRates = async () => {
    try {
        // Add your API call here
        rates.value = await getRates()
    } catch (error) {
        console.error('Error fetching rates:', error)
    }
}

onMounted(fetchRates)
</script>

<style scoped></style>