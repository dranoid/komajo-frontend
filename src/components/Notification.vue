<template>
    <Transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:-translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="modelValue" :class="[
            'fixed top-4 left-4 rounded-md p-4 shadow-sm',
            type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        ]" role="alert">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg v-if="type === 'success'" class="h-5 w-5 text-green-400" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium">{{ title }}</h3>
                    <div class="mt-2 text-sm">{{ message }}</div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
    modelValue: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    timeout?: number;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>();

// Watch for changes to modelValue and set up auto-dismiss
watch(() => props.modelValue, (newValue) => {
    if (newValue && props.timeout !== 0) {
        setTimeout(() => {
            emit('update:modelValue', false);
        }, props.timeout || 5000); // Default to 5 seconds if timeout not specified
    }
});
</script>
