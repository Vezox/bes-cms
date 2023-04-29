<template>
    <v-dialog v-model="props.dialog" :scrim="false" persistent width="auto">
        <v-card color="primary">
            <v-card-text>
                Đang tải dữ liệu
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps({
    dialog: Boolean
})
</script>
