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
      <PayoutForms />
    </div>

    <!-- Bottom Section -->
    <div class="h-[20%] p-4">
      <PayToWallet />
      <QuoteLookup />
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
