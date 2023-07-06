<template>
    <v-dialog v-model="props.dialog" persistent>
        <v-card>
            <v-card-title>
                <span class="text-h5">Thêm hình ảnh</span>
            </v-card-title>

            <div class="pa-7 pt-0">
                <v-file-input
                    v-model="files"
                    @change="uploadImage"
                    :show-size="1000"
                    accept="image/*"
                    class="input-item"
                    :multiple="true"
                    label="Tải lên hình ảnh"
                    color="primary"
                ></v-file-input>

                <ImageCard :list="listImage" :activeImage="activeImage" @get-image="revertActiveImage" />
            </div>
            <v-card-actions>
                <v-pagination style="float: right" :length="totalPageImage" @update:modelValue="changePaginationImage"></v-pagination>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" style="color: red" @click="closeDialog"> Close </v-btn>
                <v-btn color="blue-darken-1" :loading="loading" variant="text" style="color: blue" @click="submitForm"> Save </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <LoadingPopup :dialog="loadingImage" />
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import axios from '@/plugins/axios';
import ImageCard from './ImageCard.vue';
import LoadingPopup from './LoadingPopup.vue';

const props = defineProps({
    dialog: Boolean,
    topicId: String
});
const emit = defineEmits(['close', 'success']);

const loadingImage = ref(false);
const page = ref(1);
const limit = ref(8);
const listImage = ref([]);
const totalPageImage = ref(1);
const activeImage = ref<any>({});
const files = ref<any>([])


const uploadImage = () => {
    loadingImage.value = true;
    let data = new FormData()
    for (var i = 0; i < files.value.length; i++ ){
        let file = files.value[i];
        data.append('file', file);
    }
    if(!props.topicId) return toast.error('Chưa chọn chủ đề!');
    data.append('topicId', props.topicId)
    axios
        .post('/upload', data)
        .then((response) => {
            toast('Tải ảnh lên thành công!');
            files.value = []
            page.value = 1;
            fetchImage();
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        })
        .finally(() => (loadingImage.value = false));
}

watch(
    () => props.topicId,
    (newVal) => {
        Object.keys(activeImage.value).map((key) => (activeImage.value[key] = false));
    }
);

const fetchImage = (): void => {
    loadingImage.value = true;
    let params: any = {
        page: page.value,
        limit: limit.value,
        topicId: props.topicId
    };
    axios
        .post('/image/list', params)
        .then((response) => {
            listImage.value = response.data.list;
            listImage.value.map((i: any) => {
                if (activeImage.value[i._id] == undefined) {
                    activeImage.value[i._id] = false;
                }
            });
            totalPageImage.value = response.data.totalPage;
        })
        .catch((error) => {
            toast.error('Đã xảy ra lỗi!');
            console.error(error);
        })
        .finally(() => (loadingImage.value = false));
};

const changePaginationImage = (p: number) => {
    page.value = p;
    fetchImage();
};

const revertActiveImage = (id: string) => {
    console.log(id);
    activeImage.value[id] = !activeImage.value[id];
};

fetchImage();

const topic = ref('');
const loading = ref(false);

const submitForm = () => {
    loading.value = true;
    let data = {
        images: Object.keys(activeImage.value).filter((key: any) => activeImage.value[key])
    };
    axios
        .post('/topic/update/' + props.topicId, data)
        .then((response: any) => {
            toast('Thành công');
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