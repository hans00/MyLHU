import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './view/main.vue'
import About from './view/about.vue'
import Login from './view/login.vue'
import Logout from './view/main.vue'
import Student from './view/student/main.vue'
import Labor from './view/student/labor.vue'
import TeachingInq from './view/student/inquire/teaching.vue'
import TutorInq from './view/student/inquire/tutor.vue'
import Course from './view/course.vue'
import NotFound from './view/notfound.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
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
            path: '/student/inquire/teaching',
            component: TeachingInq
        },
        {
            path: '/student/inquire/tutor',
            component: TutorInq
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
