<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { productPerformance } from '@/data/dashboard/dashboardData';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import LoadingPopup from '@/components/LoadingPopup.vue';

const { cookies } = useCookies();
const type = ref('all');
const list = ref<any>([]);
const listType = ref<any>([
  { label: 'Tất cả', value: 'all' },
  { label: 'Tin tức', value: 'news' },
  { label: 'Sự kiện', value: 'event' },
  { label: 'Blog', value: 'blog' }
]);

const sub: any = {
  news: 'Tin tức',
  event: 'Sự kiện',
  blog: 'Blog'
}

const select = ref({
  name: 'Tất cả',
  _id: '1'
});
const page = ref(1);
const limit = ref(10);
const totalPage = ref(1);
const dialog = ref(false);
const loadingFetchPost = ref(false);

const size = ref({ state: '10 / page', abbr: 10 });
const listSize = ref([
  { state: '10 / page', abbr: 10 },
  { state: '20 / page', abbr: 20 },
  { state: '30 / page', abbr: 30 },
  { state: '40 / page', abbr: 40 },
  { state: '50 / page', abbr: 50 }
]);

const sort = ref({ state: 'Ngày tạo mới nhất', abbr: '1' });
const listSort = ref([
  { state: 'Ngày tạo mới nhất', abbr: '1' },
  { state: 'Ngày tạo cũ nhất', abbr: '2' },
  { state: 'Lượt xem nhiều nhất', abbr: '3' },
  { state: 'Lượt xem ít nhất', abbr: '4' }
]);

const sortDb: any = {
  '1': {
    created_time: -1
  },
  '2': {
    created_time: 1
  },
  '3': {
    view: -1
  },
  '4': {
    view: 1
  }
};

const search = ref('');
const loadingPost = ref<any>({});

const fetchPost = (): void => {
  loadingFetchPost.value = true;
  let params: any = {
    page: page.value,
    limit: limit.value,
    sort: sortDb[sort.value.abbr],
    search: search.value,
    type: type.value
  };
  if (type.value == 'all') {
    delete params.type;
  }
  axios
    .post('/post/list', params)
    .then((response) => {
      list.value = response.data.list;
      list.value.map((i: any) => (loadingPost.value[i._id] = false));
      totalPage.value = response.data.totalPage;
    })
    .catch((error) => {
      toast.error('Đã xảy ra lỗi!');
      console.error(error);
    })
    .finally(() => (loadingFetchPost.value = false));
};

fetchPost();

const changeSize = (): void => {
  limit.value = size.value.abbr;
  fetchPost();
};

const changePagination = (p: any): void => {
  page.value = p;
  fetchPost();
};

const findPost = (page: any): void => {
  page.value = 1;
  limit.value = 10;
  fetchPost();
};

const deletePost = (): void => {
  loadingPost.value[postId.value] = true;
  dialog.value = false;
  axios
    .delete('/post/delete/' + postId.value)
    .then((response) => {
      toast('Xoá bài viết thành công');
      fetchPost();
    })
    .catch((error) => {
      toast.error('Xoá bài viết thất bại');
      console.error(error);
    })
    .finally(() => (loadingPost.value[postId.value] = false));
};

const postId = ref('');
const openDialog = (id: string) => {
  postId.value = id;
  dialog.value = true;
};
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Thể loại">
        <div class="pa-7 pt-0">
          <v-row>
            <v-col cols="12" sm="3">
              <v-text-field v-model="search" class="input-item" type="text" variant="outlined" hide-details color="primary"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-select
                v-model="type"
                :items="listType"
                item-title="label"
                item-value="value"
                label="Chọn thể loại"
                persistent-hint
                single-line
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-select
                v-model="sort"
                :items="listSort"
                item-title="state"
                item-value="abbr"
                label="Sắp xếp"
                persistent-hint
                single-line
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-btn class="bg-primary" style="height: 55px" @click="findPost">Tìm kiếm</v-btn>
            </v-col>
          </v-row>

          <v-card elevation="10" class="" style="margin-top: 20px">
            <v-card-item class="pa-6">
              <!-- <v-card-title class="text-h5 pt-sm-2 pb-7">Danh sách thể loại</v-card-title> -->
              <div style="max-height: 700px; overflow: auto">
                <v-table class="month-table table-post">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Stt</th>
                      <th class="text-subtitle-1 font-weight-bold">Tên bài viết</th>
                      <th class="text-subtitle-1 font-weight-bold">Loại</th>
                      <th class="text-subtitle-1 font-weight-bold">Ngày tạo</th>
                      <th class="text-subtitle-1 font-weight-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in list" :key="item._id" class="month-item">
                      <td>
                        <p class="text-15 font-weight-medium">{{ (page - 1) * limit + index + 1 }}</p>
                      </td>
                      <td>
                        <div class="">
                          <h6 class="text-subtitle-1 font-weight-bold">
                            {{ item.title }}
                          </h6>
                        </div>
                      </td>
                      <td>
                        {{ sub[item.type] }}
                      </td>
                      <td>
                        <h6 class="text-body-1 text-muted">{{ new Date(item.created_time).toLocaleString() }}</h6>
                      </td>
                      <td>
                        <div style="display: flex">
                          <router-link :to="'/update-post?slug=' + item.slug"><v-btn>Sửa</v-btn></router-link>
                          <v-btn style="margin-left: 5px; color: red" :loading="loadingPost[item._id]" @click="openDialog(item._id)"
                            >Xoá</v-btn
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
              <v-row>
                <v-col cols="6">
                  <v-select
                    style="width: 50%"
                    v-model="size"
                    :items="listSize"
                    item-title="state"
                    item-value="abbr"
                    label="Select"
                    persistent-hint
                    single-line
                    variant="underlined"
                    @update:model-value="changeSize"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-pagination style="float: right" :length="totalPage" @update:modelValue="changePagination"></v-pagination>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </div>
      </UiParentCard>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" persistent width="auto">
    <v-card>
      <v-card-title class="text-h5">Xoá bài viết?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="dialog = false"> Huỷ </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="deletePost"> Xoá </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <LoadingPopup :dialog="loadingFetchPost" />
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

<style>
.table-post table {
  min-width: 700px;
}
</style>
