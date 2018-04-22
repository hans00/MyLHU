import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import auth from './auth'
import error_code from './error_code.json'

Vue.use(VueResource)

const app = new Vue({
    data ()  {
        return { user: auth.user_data, checking: false }
    },
    methods: {
        logout () {
            auth.clear_auto_update()
            this.checking = true
            auth.logout()
            .then((status) => {
                this.$root.checking = false
                this.$router.push('/')
            })
        },
        error (code) {
            this.checking = false
            $('#error').modal('show')
            if (error_code[code]) {
                $('#error #msg').text(error_code[code])
            } else {
                $('#error #msg').text(error_code['unknown'])
            }
            $('#error #code').text(code)
        }
    },
    created () {
        this.checking = true
        auth.check()
        .then(() => {
            this.$root.checking = false
            if (auth.user_data.logged) {
                auth.register_auto_update()
            }
        })
        .catch((code) => this.error(code))
    },
    destroyed () {
        auth.clear_auto_update()
    },
    router
}).$mount('#app')
