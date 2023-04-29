<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { productPerformance } from '@/data/dashboard/dashboardData';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import LoadingPopup from '@/components/LoadingPopup.vue';

const { cookies } = useCookies();
const category = ref('');
const listCategory = ref<any>([]);
const loadingCreate = ref(false);
const activeInput = ref<any>({});
const loadingInput = ref<any>({});
const loadingFetch = ref(false);

const fetchCategory = (): void => {
    loadingFetch.value = true
    axios
        .get('/api/category/list')
        .then((response) => {
            listCategory.value = response.data.list;
            listCategory.value.map((i: any) => {
                activeInput.value[i._id] = false;
                loadingInput.value[i._id] = false;
            });
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        }).finally(() =>  loadingFetch.value = false)
};

const createCategory = async (): Promise<void> => {
    loadingCreate.value = true;
    if (!category.value || !category.value.trim()) return;
    axios
        .post('/api/category/create', { name: category.value })
        .then((response) => {
            toast('Thành công');
            category.value = '';
            fetchCategory();
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        })
        .finally(() => (loadingCreate.value = false));
};

const openInput = (id: string) => {
    activeInput.value[id] = !activeInput.value[id];
};

const updateCategory = (id: string, item: any) => {
    loadingInput.value[id] = true;
    if (!item.name || !item.name.trim()) return;
    axios
        .post('/api/category/update/' + id, { name: item.name })
        .then((response) => {
            toast('Cập nhật thành công');
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        })
        .finally(() => {
            openInput(id);
            loadingInput.value[id] = false;
        });
};

fetchCategory();
</script>

<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Thể loại">
                <div class="pa-7 pt-0">
                    <v-row>
                        <v-col cols="12" sm="9">
                            <v-label class="font-weight-bold mb-1">Thêm thể loại </v-label>
                            <v-text-field
                                class="input-item"
                                type="text"
                                v-model="category"
                                variant="outlined"
                                hide-details
                                color="primary"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="align-button">
                                <v-btn class="bg-primary" style="width: 100%" @click="createCategory" :loading="loadingCreate">
                                    Tạo thể loại</v-btn
                                >
                            </div>
                        </v-col>
                    </v-row>

                    <v-card elevation="10" class="" style="margin-top: 20px">
                        <v-card-item class="pa-6">
                            <!-- <v-card-title class="text-h5 pt-sm-2 pb-7">Danh sách thể loại</v-card-title> -->
                            <v-table class="month-table">
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-bold">Stt</th>
                                        <th class="text-subtitle-1 font-weight-bold">Tên thể loại</th>
                                        <th class="text-subtitle-1 font-weight-bold">Ngày tạo</th>
                                        <th class="text-subtitle-1 font-weight-bold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in listCategory" :key="item._id" class="month-item">
                                        <td>
                                            <p class="text-15 font-weight-medium">{{ index }}</p>
                                        </td>
                                        <td>
                                            <div class="">
                                                <h6 v-if="!activeInput[item._id]" class="text-subtitle-1 font-weight-bold">
                                                    {{ item.name }}
                                                </h6>
                                                <v-text-field
                                                    v-else
                                                    type="text"
                                                    v-model="item.name"
                                                    variant="outlined"
                                                    hide-details
                                                    color="primary"
                                                ></v-text-field>
                                            </div>
                                        </td>
                                        <td>
                                            <h6 class="text-body-1 text-muted">{{ new Date(item.created_time).toLocaleString() }}</h6>
                                        </td>
                                        <td>
                                            <v-btn v-if="!activeInput[item._id]" class="bg-primary" @click="openInput(item._id)"
                                                >Chỉnh sửa</v-btn
                                            >
                                            <v-btn
                                                v-else
                                                class="bg-primary"
                                                @click="updateCategory(item._id, item)"
                                                :loading="loadingInput[item._id]"
                                                >Cập nhật</v-btn
                                            >
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-item>
                    </v-card>
                </div>
            </UiParentCard>
        </v-col>
    </v-row>
    <LoadingPopup :dialog="loadingFetch"/>
</template>

<style scoped>
.align-button {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.input-item {
    margin-bottom: 20px;
}
</style>
