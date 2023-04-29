<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ref, reactive, watch } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import { revertButtonCreatePost, loadingCreatePost, setLoadingCreatePost, buttonCreatePost } from '@/store/index';
import { UploadAdapter } from '@/plugins/upload';
// import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, PictureEditing } from '@ckeditor/ckeditor5-image';
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageResizeEditing from '@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting';
// import ImageResizeHandles from '@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles';

const { cookies } = useCookies();

const editor = ref(ClassicEditor);
const editorData = ref('<p>Content of the editor.</p>');
const editorConfig = ref({
    // plugins: [Bold, Italic ],
    // toolbar: {
    //     items: ["bold", "italic"]
    // }
    // ckfinder: {
    //     options: {
    //         headers: {
    //             Authorization: 'Bearer ' + cookies.get('token')
    //         }
    //     },
    //     uploadUrl: import.meta.env.VITE_API_URL + '/api/upload'
    // }
});
const select = ref<any>([]);
const listCategory = ref<any>([]);
const post = reactive({
    title: '',
    descriptions: '',
    category: '',
    content: '',
    files: <any>[]
});

const fetchCategory = (): void => {
    axios
        .get('/api/category/list')
        .then((response) => {
            listCategory.value = response.data.list;
        })
        .catch((error) => {
            console.error(error);
        });
};

const test = () => {
    console.log(post.files);
};

watch(buttonCreatePost, () => {
    createPost();
});

const validateForm = () => {
    if (!post.title || !post.title.trim()) {
        return { success: false, message: 'Tiêu đề bài viết không được bỏ trống' };
    }
    if(!select.value.length) {
        return { success: false, message: 'Chưa chọn thể loại' };
    }
    if (!post.descriptions || !post.descriptions.trim()) {
        return { success: false, message: 'Mô tả bài viết không được bỏ trống' };
    }
    if (!post.files.length) {
        return { success: false, message: 'Ảnh bìa bài viết không được bỏ trống' };
    }
    if (post.files[0].size > 25 * 1024 * 1024) {
        return { success: false, message: 'Ảnh không lớn hơn 25mb' };
    }
    if (!post.content || !post.content.trim()) {
        return { success: false, message: 'Nội dung bài viết không được bỏ trống' };
    }
    return { success: true };
};

const createPost = async (): Promise<void> => {
    let validate: any = validateForm();
    if (!validate?.success) {
        toast.error(validate.message);
        return;
    }
    setLoadingCreatePost(true);
    let data: any = new FormData();

    for (var i = 0; i < select.value.length; i++ ){
        let cate = select.value[i];
        data.append('category', cate);
    }
    data.append('title', post.title);
    data.append('descriptions', post.descriptions);
    data.append('content', post.content);
    data.append('file', post.files[0]);

    axios
        .post('/api/post/create', data)
        .then((response) => {
            toast('Tạo bài viết thành công');
            post.title = '';
            (post.descriptions = ''), (post.content = ''), (post.files = []);
        })
        .catch((error) => {
            console.error(error);
            toast.error('Tạo bài viết thất bại');
        })
        .finally(() => setLoadingCreatePost(false));
};

fetchCategory();

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
                        @change="test"
                        :show-size="1000"
                        accept="image/*"
                        class="input-item"
                        label="Tải lên ảnh bìa"
                        color="primary"
                    ></v-file-input>

                    <v-label class="font-weight-bold mb-1">Thể loại <span style="color: red">*</span> </v-label>
                    <v-select
                        v-model="select"
                        :items="listCategory"
                        item-title="name"
                        item-value="_id"
                        label="Chọn thể loại"
                        @update:modelValue="test"
                        persistent-hint
                        multiple
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
</template>

<style scoped>
.input-item {
    margin-bottom: 20px;
}



</style>

<style>
.ck-editor__editable {
    min-height: 500px;
    max-height: 500px;
}

.content-preview img {
    width: 70%;
    display: block;
    margin: auto;
}
</style>
