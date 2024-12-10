<template>
  <div class="min-h-screen flex flex-col">
    <!-- Title -->
    <div class="p-4 bg-white border-b">
      <h1 class="text-2xl font-bold text-blue-600">KOMAJO</h1>
    </div>

    <!-- Top Section -->
    <div class="h-[20%] p-4 border-b">
      <ExchangeRates />
    </div>

    <!-- Middle Section -->
    <div class="h-[60%] p-4 border-b">
      <h2 class="text-xl font-semibold mb-4">Payout Management</h2>
      <PayoutForms />
    </div>

    <!-- Bottom Section -->
    <div class="h-[20%] p-4">
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">Wallet Transfer</h2>
          <PayToWallet />
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-4">Quote Lookup</h2>
          <QuoteLookup />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExchangeRates from "./components/ExchangeRates.vue";
import PayoutForms from "./components/PayoutForms.vue";
import QuoteLookup from "./components/QuoteLookup.vue";
import PayToWallet from "./components/PayToWallet.vue";
</script>

<style scoped></style>
