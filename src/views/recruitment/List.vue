<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import LoadingPopup from '@/components/LoadingPopup.vue';

const list = ref<any>([]);
const page = ref(1);
const limit = ref(10);
const totalPage = ref(1);
const loadingFetchPost = ref(false);

const size = ref(10);
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
  { state: 'Ngày tạo cũ nhất', abbr: '2' }
]);

const sortDb: any = {
  '1': {
    created_time: -1
  },
  '2': {
    created_time: 1
  }
};


const fetchPost = (): void => {
  loadingFetchPost.value = true;
  let params: any = {
    page: page.value,
    limit: limit.value,
    sort: sortDb[sort.value.abbr]
  };
  axios
    .post('/recruitment/list', params)
    .then((response) => {
      list.value = response.data.list.map((item: any) => {

      item.cv = import.meta.env.VITE_API_URL + '/recruitment/cv/' + item.file;
        item.loading = false;
        return item;
      });
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
  limit.value = size.value;
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

const handleChecking = async (id: string) => {
  const index = list.value.findIndex((item: any) => item._id === id);
  list.value[index].loading = true;
  try {
    await axios.post('/consultation/check', { id });
    toast.success('Đã xác nhận!');
    list.value = list.value.map((item: any) => {
      if (item._id === id) {
        item.loading = true;
      }
      return item;
    });
    list.value[index].checked = true;
  } catch (error) {
    console.error(error);
  } finally {
    list.value[index].loading = false;
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Thể loại">
        <div class="pa-7 pt-0">
          <v-row>
            <v-col cols="12" sm="3">
              <v-select
                v-model="sort"
                :items="listSort"
                item-title="state"
                item-value="abbr"
                label="Chọn thể loại"
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
                      <th class="text-subtitle-1 font-weight-bold">Họ và tên</th>
                      <th class="text-subtitle-1 font-weight-bold">SĐT</th>
                      <th class="text-subtitle-1 font-weight-bold">Email</th>
                      <th class="text-subtitle-1 font-weight-bold">Lương hiện tại</th>
                      <th class="text-subtitle-1 font-weight-bold">Lương mong muốn</th>
                      <th class="text-subtitle-1 font-weight-bold">CV</th>
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
                            {{ item.full_name }}
                          </h6>
                        </div>
                      </td>
                      <td>
                        <h6 class="text-body-1 text-muted">{{ item.phone }}</h6>
                      </td>
                      <td>
                        <h6 class="text-body-1 text-muted">{{ item.email }}</h6>
                      </td>
                      <td>
                        <h6 class="text-body-1 text-muted">{{ item.current_salary }}</h6>
                      </td>
                      <td>
                        <h6 class="text-body-1 text-muted">{{ item.expected_salary }}</h6>
                      </td>
                      <td>
                        <a :href="item.cv" target="_blank">
                          <v-btn style="color: green">Tải CV</v-btn>
                        </a>
                      </td>
                      <td>
                        <h6 class="text-body-1 text-muted">{{ new Date(item.created_time).toLocaleString() }}</h6>
                      </td>
                      <td>
                        <div v-if="item.checked" style="color: blue">Đã xem</div>
                        <v-btn v-else style="color: green" :loading="item.loading" @click="handleChecking(item._id)"> Liên hệ </v-btn>
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
