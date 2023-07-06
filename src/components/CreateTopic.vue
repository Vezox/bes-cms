<template>
    <v-dialog v-model="props.dialog" persistent width="1024">
        <!-- <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
        </template> -->
        <v-card>
            <v-card-title>
                <span class="text-h5">User Profile</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="topic" label="Tên chủ đề" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" style="color: red" @click="closeDialog"> Close </v-btn>
                <v-btn color="blue-darken-1" :loading="loading" variant="text" style="color: blue" @click="submitForm"> Save </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { toast } from 'vue3-toastify';
import axios from '@/plugins/axios';

const props = defineProps({
    dialog: Boolean
});
const emit = defineEmits(['close', 'success']);

const topic = ref('');
const loading = ref(false);

const submitForm = () => {
    if (!topic.value || !topic.value.trim()) return;
    loading.value = true;
    axios
        .post('/topic/create', { name: topic.value })
        .then((response: any) => {
            toast('Thành công');
            topic.value = '';
            emit('success', 're-load');
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        })
        .finally(() => (loading.value = false));
};

const closeDialog = () => {
    emit('close');
};
</script>
