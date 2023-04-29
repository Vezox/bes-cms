<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from '@/plugins/axios';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';

const { cookies } = useCookies()
const router = useRouter()

const checkbox = ref(true);

const user = reactive({
    email: '',
    password: ''
});

const login = (): void => {
    axios
        .post('/api/user/login', user)
        .then((response) => {
            cookies.set('token', response.data.token)
            router.push('/')
        })
        .catch((error) => console.error(error));
};
</script>

<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Email</v-label>
            <v-text-field v-model="user.email" type="email" variant="outlined" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Password</v-label>
            <v-text-field v-model="user.password" variant="outlined" type="password" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
            <div class="d-flex flex-wrap align-center ml-n2">
                <v-checkbox v-model="checkbox" color="primary" hide-details>
                    <template v-slot:label class="text-body-1">Remeber this Device</template>
                </v-checkbox>
                <div class="ml-sm-auto">
                    <RouterLink to="/" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                        >Forgot Password ?</RouterLink
                    >
                </div>
            </div>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-btn @click="login" to="/" color="primary" size="large" block flat>Sign in</v-btn>
        </v-col>
    </v-row>
</template>
