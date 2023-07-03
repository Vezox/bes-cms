const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/',
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'Typography',
            path: '/ui/typography',
            component: () => import('@/views/components/Typography.vue')
        },
        {
            name: 'Shadow',
            path: '/ui/shadow',
            component: () => import('@/views/components/Shadow.vue')
        },
        {
            name: 'Icons',
            path: '/icons',
            component: () => import('@/views/pages/Icons.vue')
        },
        {
            name: 'Starter',
            path: '/sample-page',
            component: () => import('@/views/pages/SamplePage.vue')
        },
        {
            name: 'Create Post',
            path: '/create-post',
            component: () => import('@/views/post/CreatePost.vue')
        },
        {
            name: 'Update Post',
            path: '/update-post',
            component: () => import('@/views/post/UpdatePost.vue')
        },
        {
            name: 'List Post',
            path: '/list-post',
            component: () => import('@/views/post/ListPost.vue')
        },
        {
            name: 'Category',
            path: '/category',
            component: () => import('@/views/category/Category.vue')
        },
        {
            name: 'List Contact',
            path: '/contacts',
            component: () => import('@/views/contact/ListContact.vue')
        },
        {
            name: 'Detail Contact',
            path: '/contacts/:id',
            component: () => import('@/views/contact/DetailContact.vue')
        },
        {
            name: 'List Topic',
            path: '/topics',
            component: () => import('@/views/topic/ListTopic.vue')
        },
        {
            name: 'Detail Topic',
            path: '/topics/:id',
            component: () => import('@/views/topic/DetailTopic.vue')
        },
        {
            name: "List consultation",
            path: "/consultations",
            component: () => import("@/views/consultation/List.vue")
        },
        {
            name: "List recruitment",
            path: "/recruitment",
            component: () => import("@/views/recruitment/List.vue")
        }
    ]
};

export default MainRoutes;
