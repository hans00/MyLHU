import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './pages/main.vue'
import About from './pages/about.vue'
import Login from './pages/login.vue'
import Logout from './pages/main.vue'
import Student from './pages/student/main.vue'
import Labor from './pages/student/labor.vue'
import Course from './pages/course.vue'

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
        }
    ]
})

export default router;
