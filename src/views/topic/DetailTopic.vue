<script setup lang="ts">
import { ref, computed } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ImageCard from '@/components/ImageCard.vue';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import AddImageTopic from '@/components/AddImageTopic.vue';
import { useRoute } from 'vue-router';
import LoadingPopup from '@/components/LoadingPopup.vue';

const route = useRoute();
const loadingImage = ref(false);
const page = ref(1);
const limit = ref(8);
const listImage = ref([]);
const totalPageImage = ref(1);
const activeImage = ref<any>({});
const topic = ref<any>({});
const loading = ref(false);
const loadingDelete = ref(false);
const loadingUpdate = ref(false);

const fetchImage = (): void => {
    if (!route.params.id) return;
    loadingImage.value = true;
    let params: any = {
        page: page.value,
        limit: limit.value,
        topicId: route.params.id
    };
    axios
        .post('/api/topic/list-image-topic', params)
        .then((response) => {
            let rs = response.data.list;
            listImage.value = rs.map((i: any) => i.image);
            totalPageImage.value = response.data.totalPage;
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        })
        .finally(() => (loadingImage.value = false));
};

const fetchTopic = (): void => {
    if (!route.params.id) return;
    loading.value = true;
    axios
        .get('/api/topic/get/' + route.params.id)
        .then((rs: any) => (topic.value = rs.data.data))
        .catch((error) => console.log(error))
        .finally(() => (loading.value = false));
};

fetchTopic();
fetchImage();

const updateName = () => {
    if (!route.params.id || !topic.value.name) return;
    loadingUpdate.value = true;
    axios
        .post('/api/topic/update/' + route.params.id, {
            name: topic.value.name
        })
        .then((rs: any) => {
            toast('Thành công');
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.log(error);
        })
        .finally(() => (loadingUpdate.value = false));
};

const loading_all = computed(() => loadingImage.value || loading.value);

const changePaginationImage = (p: number) => {
    page.value = p;
    fetchImage();
};

const revertActiveImage = (id: string) => {
    activeImage.value[id] = !activeImage.value[id];
};

const deleteImageTopic = () => {
    if (!route.params.id) return;
    loadingDelete.value = true;
    axios
        .post('/api/image-topic/delete', {
            topicId: route.params.id,
            imagesId: Object.keys(activeImage.value).filter((i) => activeImage.value[i])
        })
        .then((rs: any) => {
            toast('Thành công');
            page.value = 1;
            fetchImage();
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.log(error);
        })
        .finally(() => (loadingDelete.value = false));
};
</script>
<template>
    <LoadingPopup v-if="loading_all" :dialog="loading_all" />
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Chi tiết chủ đề">
                <div class="pa-7 pt-0">
                    <v-row v-if="topic.name">
                        <v-col cols="12" sm="9">
                            <v-text-field
                                v-model="topic.name"
                                class="input-item"
                                type="text"
                                variant="outlined"
                                hide-details
                                color="primary"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-btn class="bg-primary" style="height: 50px; width: 100%" @click="updateName" :loading="loadingUpdate"
                                >Cập nhật tên chủ đề</v-btn
                            >
                        </v-col>
                    </v-row>

                    <ImageCard :list="listImage" :activeImage="activeImage" @get-image="revertActiveImage" />
                    <v-row>
                        <v-col cols="6">
                            <v-btn
                                v-if="Object.keys(activeImage).find((i) => activeImage[i])"
                                style="color: red"
                                @click="deleteImageTopic"
                                :loading="loadingDelete"
                            >
                                Xoá ảnh đã chọn</v-btn
                            >
                        </v-col>
                        <v-col cols="6">
                            <v-pagination
                                style="float: right"
                                :length="totalPageImage"
                                @update:modelValue="changePaginationImage"
                            ></v-pagination>
                        </v-col>
                    </v-row>
                </div>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
