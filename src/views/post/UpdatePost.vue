<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { ref, reactive, watch, computed } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import { revertButtonCreatePost, loadingCreatePost, setLoadingCreatePost, buttonCreatePost } from '@/store/index';
import { UploadAdapter } from '@/plugins/upload';
import { useRoute } from 'vue-router';
import LoadingPopupVue from '@/components/LoadingPopup.vue';
import { router } from '@/router';

const { cookies } = useCookies();
const route = useRoute();
const editor = ref(ClassicEditor);
const listType = ref<any>([
  { label: 'Tin tức', value: 'news' },
  { label: 'Sự kiện', value: 'event' }
]);
const editorConfig = ref({});
const postData = ref<any>({});
const post = reactive({
    title: '',
    descriptions: '',
    type: '',
    content: '',
    files: <any>[]
});
const loading = ref(false)


watch(buttonCreatePost, () => {
    updatePost();
});

const validateForm = () => {
    if (!post.title || !post.title.trim()) {
        return { success: false, message: 'Tiêu đề bài viết không được bỏ trống' };
    }
    if (!post.descriptions || !post.descriptions.trim()) {
        return { success: false, message: 'Mô tả bài viết không được bỏ trống' };
    }
    // if (!post.files.length) {
    //     return { success: false, message: 'Ảnh bìa bài viết không được bỏ trống' };
    // }
    if (post.files.length != 0 && post.files[0].size > 25 * 1024 * 1024) {
        return { success: false, message: 'Ảnh không lớn hơn 25mb' };
    }
    if (!post.content || !post.content.trim()) {
        return { success: false, message: 'Nội dung bài viết không được bỏ trống' };
    }
    if(!post.type || !post.type.trim()) {
        return { success: false, message: 'Loại bài viết không được bỏ trống' };
    }
    return { success: true };
};

const updatePost = async (): Promise<void> => {
    let validate: any = validateForm();
    if (!validate?.success) {
        toast.error(validate.message);
        return;
    }
    setLoadingCreatePost(true);
    let data: any = new FormData();

    data.append('title', post.title);
    data.append('descriptions', post.descriptions);
    data.append('content', post.content);
    data.append('type', post.type);
    if (post.files.length) {
        data.append('file', post.files[0]);
    }

    axios
        .post('/post/update/' + postData.value._id, data)
        .then((response) => {
            toast('Cập nhật bài viết thành công');
            router.push('/list-post');
        })
        .catch((error) => {
            console.error(error);
            toast.error('Cập nhật bài viết thất bại');
        })
        .finally(() => setLoadingCreatePost(false));
};

const fetchPost = (): void => {
    if (!route.query.slug) return;
    loading.value = true
    axios
        .get('/post/get-update/' + route.query.slug)
        .then((response) => {
            postData.value = response.data.data;
            post.title = postData.value.title;
            post.content = postData.value.content;
            post.descriptions = postData.value.descriptions;
            post.type = postData.value.type;
        })
        .catch((error) => {
            console.error(error);
        }).finally(() => loading.value = false)
};

fetchPost();

const onReady = (eventData: any) => {
    eventData.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new UploadAdapter(loader);
    };
};
</script>

<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Tạo bài viết">
                <div class="pa-7 pt-0">
                    <v-label class="font-weight-bold mb-1">Tiều đề <span style="color: red">*</span> </v-label>
                    <v-text-field
                        v-model="post.title"
                        class="input-item"
                        type="text"
                        variant="outlined"
                        hide-details
                        color="primary"
                    ></v-text-field>

                    <v-label class="font-weight-bold mb-1">Mô tả <span style="color: red">*</span> </v-label>
                    <v-textarea
                        v-model="post.descriptions"
                        class="input-item"
                        label="Nhập mô tả bài viết"
                        variant="outlined"
                        hide-details
                        color="primary"
                    ></v-textarea>

                    <v-label class="font-weight-bold mb-1">Ảnh bìa bài viết <span style="color: red">*</span> </v-label>
                    <v-file-input
                        v-model="post.files"
                        :show-size="1000"
                        accept="image/*"
                        class="input-item"
                        label="Tải lên ảnh bìa"
                        color="primary"
                    ></v-file-input>

                    <v-label class="font-weight-bold mb-1">Thể loại <span style="color: red">*</span> </v-label>
                    <v-select
                        v-model="post.type"
                        :items="listType"
                        item-title="label"
                        item-value="value"
                        label="Chọn thể loại"
                        persistent-hint
                        single-line
                    ></v-select>

                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-bold mb-1">Nội dung <span style="color: red">*</span> </v-label>
                            <div id="app">
                                <ckeditor :editor="editor" v-model="post.content" :config="editorConfig" @ready="onReady"></ckeditor>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-bold mb-1">Xem trước</v-label>
                            <div class="content-preview" style="max-height: 500px; overflow-y: auto;" v-html="post.content"></div>
                        </v-col>
                    </v-row>
                </div>
            </UiParentCard>
        </v-col>
    </v-row>
    <LoadingPopupVue :dialog="loading"/>
</template>

<style scoped>
.input-item {
    margin-bottom: 20px;
}
</style>

<style>
.content-preview img {
    width: 70%;
    display: block;
    margin: auto;
}
.ck-editor__editable {
    min-height: 500px;
    max-height: 500px;
}

</style>
