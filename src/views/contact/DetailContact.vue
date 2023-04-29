<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRoute } from 'vue-router';
import LoadingPopup from '@/components/LoadingPopup.vue';
import axios from '@/plugins/axios';

const route = useRoute();
const loading = ref(false);
const contact = ref<any>({});

const fetchContact = (): void => {
    if (!route.params.id) return;
    loading.value = true;
    axios
        .get('/api/contact/get/' + route.params.id)
        .then((response) => {
            contact.value = response.data.data;
        })
        .catch((error) => console.error(error))
        .finally(() => (loading.value = false));
};

fetchContact();
</script>
<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Chi tiết">
                <div class="pa-7 pt-0">
                    <v-label class="font-weight-bold mb-1">Họ và tên: </v-label><span style="margin-left: 5px"> {{ contact.name }}</span>
                    <br />
                    <v-label class="font-weight-bold mb-1">Email: </v-label><span style="margin-left: 5px"> {{ contact.email }}</span>
                    <br />
                    <v-label class="font-weight-bold mb-1">Số điện thoại: </v-label
                    ><span style="margin-left: 5px"> {{ contact.phone }}</span> <br />
                    <v-label class="font-weight-bold mb-1">Khoá học quan tâm: </v-label
                    ><span style="margin-left: 5px"> {{ contact?.course }}</span> <br />
                    <v-label class="font-weight-bold mb-1">Cơ sở quan tâm: </v-label
                    ><span style="margin-left: 5px"> {{ contact?.base }}</span> <br />
                    <v-label class="font-weight-bold mb-1">Câu hỏi: </v-label>
                    <p>{{ contact?.descriptions }}</p>
                    <br />
                </div>
            </UiParentCard>
        </v-col>
    </v-row>
    <LoadingPopup :dialog="loading" />
</template>
