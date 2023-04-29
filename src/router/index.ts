import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const { cookies } = useCookies();
const routerVue = useRouter()

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/pages/Error404.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});


function nextFactory(context: any, middleware: any, index: any) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;
    return (...parameters: any) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Then run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {

    if (to.meta.requiresAuth) {
        if (!cookies.get("token")) {
            router.push({ path: "/login" });

        }
        // const middleware = Array.isArray(to.meta.requiresAuth)
        //     ? to.meta.requiresAuth
        //     : [to.meta.requiresAuth];
        // const context = {
        //     from,
        //     next,
        //     router,
        //     to,
        // };
        // const nextMiddleware = nextFactory(context, middleware, 1);

        // return middleware[0]({ ...context, next: nextMiddleware });
    }

    return next();
});

export { router };
