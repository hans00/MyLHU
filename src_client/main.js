import Vue from 'vue'
import router from './router'
import auth from './auth'

auth.check()

const app = new Vue({
    data ()  {
        return { user: auth.user }
    },
    methods: {
        logout () {
            auth.logout()
            this.logged = false
            location.reload()
        }
    },
    mounted () {
        this.handle = setInterval(() => {
            auth.check()
        }, 30000)
    },
    destroyed () {
        clearInterval(this.handle)
    },
    router
}).$mount('#app')
