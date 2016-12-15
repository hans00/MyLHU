import Vue from 'vue'
import router from './router'
import auth from './auth'

const app = new Vue({
    data ()  {
        return { user: auth.user, checking: true }
    },
    methods: {
        logout () {
            this.checking = false
            auth.logout((status) => {
                location = '#'
            })
        }
    },
    mounted () {
        auth.check((status) => {
            this.$root.checking = false
            if (!status) {
                $('#error').focus()
            }
        })
        this.handle = setInterval(() => {
            console.log(this)
            auth.check((status) => {
                this.$root.checking = false
                console.log(this)
            })
        }, 30000)
    },
    destroyed () {
        clearInterval(this.handle)
    },
    router
}).$mount('#app')
