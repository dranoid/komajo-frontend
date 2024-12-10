<template>
    <div class="flex flex-col gap-4 my-6">
        <form @submit.prevent="handlePayment" class="p-4 rounded-lg shadow-md">
            <div class="form-group">
                <label>Wallet Address</label>
                <input v-model="address" placeholder="Enter wallet address" required />
            </div>

            <div class="form-group">
                <label>Amount</label>
                <input v-model="amount" type="number" step="0.01" min="0" placeholder="Enter amount" />
            </div>

            <div v-if="errorMessage" class="alert alert-error">
                <span>{{ errorMessage }}</span>
            </div>

            <button type="submit" class="btn mt-4 btn-primary disabled:opacity-50" :disabled="!isValid || isLoading">
                <span v-if="isLoading">Processing...</span>
                <span v-else>Pay</span>
            </button>
        </form>
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
const notificationType = ref('')
const notificationTitle = ref('')
const notificationMessage = ref('')

const isValid = computed(() => {
    return address.value && amount.value && amount.value > 0
})

const handlePayment = async () => {
    console.log('handlePayment', isValid.value)
    if (!isValid.value) {
        errorMessage.value = 'Please fill in all fields'
        return
    }

    try {
        errorMessage.value = '' // Clear any previous errors
        isLoading.value = true
        await sendUSDTToWallet({
            address: address.value,
            amount: amount.value as number
        })
        // Reset form after successful payment
        address.value = ''
        amount.value = null

        // Show success notification
        showNotification.value = true
        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Payment completed successfully'

    } catch (error) {
        console.error('Payment failed:', error)
        errorMessage.value = error instanceof Error
            ? error.message
            : 'Payment failed. Please try again.'

        // Show error notification
        showNotification.value = true
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = errorMessage.value

    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped></style>