import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import auth from './auth'

Vue.use(VueResource)

const app = new Vue({
    data ()  {
        return { user: auth.user, checking: true }
    },
    methods: {
        logout () {
            this.checking = true
            auth.logout((status) => {
                this.$root.checking = false
                this.$router.push('/')
            })
        }
    },
    mounted () {
        auth.check((status) => {
            this.$root.checking = false
            if (!status) {
                $('#error').modal('show')
                $('#error #msg').text("無法連線至龍華伺服器，請稍後再試。")
            }
            if (auth.user.logged) {
                this.handle = setInterval(() => {
                    auth.check()
                }, 1000)
            }
        })
    },
    destroyed () {
        if (this.handle) {
            clearInterval(this.handle)
        }
    },
    router
}).$mount('#app')
