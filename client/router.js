import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './view/main.vue'
import About from './view/about.vue'
import Login from './view/login.vue'
import Logout from './view/main.vue'
import Student from './view/student/main.vue'
import Labor from './view/student/labor.vue'
import Course from './view/course.vue'
import NotFound from './view/notfound.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Main
        },
        {
            path: '/about',
            component: About
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/logout',
            component: Logout
        },
        {
            path: '/student',
            component: Student
        },
        {
            path: '/student/labor',
            component: Labor
        },
        {
            path: '/course',
            component: Course
        },
        {
            path: '*',
            component: NotFound
        }
    ]
})

export default router;
