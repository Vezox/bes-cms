<script setup lang="ts">
import { defineProps } from 'vue';
import { productsCard } from '@/data/dashboard/dashboardData';

const emit = defineEmits(['get-image']);
const props = defineProps({
    list: <any>Array,
    activeImage: <any>Object
});

const chooseImage = (id: string) => {
    emit('get-image', id);
};
</script>
<template>
    <v-row>
        <v-col cols="12" lg="3" sm="6" v-for="card in props.list" :key="card._id">
            <v-card
                elevation="10"
                class="withbg"
                :class="{ active: props.activeImage[card._id] }"
                @click="chooseImage(card._id)"
                rounded="md"
                style="cursor: pointer"
            >
                <v-img :src="card.src" max-height="220px" class="rounded-t-md"></v-img>

                <!-- <div class="d-flex justify-end mr-4 mt-n5">
                    <v-btn size="40" icon class="bg-primary d-flex">
                        <v-avatar size="30" class="text-white">
                            <BasketIcon size="15" />
                        </v-avatar>
                        <v-tooltip activator="parent" location="bottom">Thêm hình ảnh</v-tooltip>
                    </v-btn>
                </div> -->
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped>
.active {
    border: 1px solid blue;
}
</style>
