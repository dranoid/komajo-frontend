<template>
    <div class="flex justify-center items-center min-h-screen bg-orange-50">
        <div class="flex flex-col gap-4 w-full max-w-md px-4">
            <form @submit.prevent="handlePayment" class="p-6 rounded-lg shadow-lg bg-white">
                <h2 class="text-2xl font-bold text-orange-600 mb-6 text-center">Pay to wallet</h2>

                <div class="form-group mb-4">
                    <label class="block text-orange-700 mb-2">Wallet Address</label>
                    <input v-model="address" placeholder="Enter wallet address" required
                        class="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:border-orange-500" />
                </div>

                <div class="form-group mb-4">
                    <label class="block text-orange-700 mb-2">Amount</label>
                    <input v-model="amount" type="number" step="0.01" min="0" placeholder="Enter amount"
                        class="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:border-orange-500" />
                </div>

                <div v-if="errorMessage" class="alert alert-error bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                    <span>{{ errorMessage }}</span>
                </div>

                <button type="submit"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!isValid || isLoading">
                    <span v-if="isLoading">Processing...</span>
                    <span v-else>Pay</span>
                </button>
            </form>
        </div>
    </div>
    <Notification v-model="showNotification" :type="notificationType" :title="notificationTitle"
        :message="notificationMessage" :timeout="5000" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { sendUSDTToWallet } from '../api/api'
import Notification from './Notification.vue'

const address = ref('')
const amount = ref<number | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

const isValid = computed(() => {
    return address.value && amount.value && amount.value > 0
})

const handlePayment = async () => {
    if (!isValid.value) {
        errorMessage.value = 'Please fill in all fields'
        return
    }

    try {
        errorMessage.value = ''
        isLoading.value = true
        await sendUSDTToWallet({
            address: address.value,
            amount: amount.value as number
        })
        address.value = ''
        amount.value = null

        showNotification.value = true
        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Payment completed successfully'

    } catch (error: any) {
        console.error('Payment failed:', error)
        errorMessage.value = error
            ? error.response.data.message
            : 'Payment failed. Please try again.'

        showNotification.value = true
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = errorMessage.value

    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.form-group input {
    transition: all 0.3s ease;
}

.form-group input:focus {
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}
</style>