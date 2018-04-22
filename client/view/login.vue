<template lang="html">
    <div v-if="!user.logged">
        <h1>登入</h1>
        <p class="lead">
            請直接輸入龍華系統之帳號密碼即可。
        </p>
        <div class="col-md-6 col-md-offset-3">
            <form class="form-horizontal" v-on:submit.prevent="submit">
                <div class="form-group">
                    <label for="account" class="col-sm-2 control-label">帳號</label>
                    <div class="col-sm-10">
                        <input type="text" autocomplete="off" placeholder="請輸入您的學號" class="form-control" v-model="account" id="account" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="password" class="col-sm-2 control-label">密碼</label>
                    <div class="col-sm-10">
                        <input type="password" autocomplete="off" placeholder="請輸入您龍華資訊入口之密碼" class="form-control" v-model="password" id="password" required>
                    </div>
                </div>
                <!-- <div class="form-group">
                    <div class="col-sm-12 vcenter">
                        <label class="toggle">
                            <input type="checkbox" id="autologin" v-model="autologin">
                            <span class="handle" @click="toogle"></span>
                        </label>
                        <label class="text" for="autologin">自動登入</label>
                    </div>
                </div> -->
                <button class="btn btn-primary" type="submit">登入</button>
            </form>
        </div>
    </div>
    <div v-else>
        <h1>登入</h1>
        <p class="lead">您已經登入。</p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-home"></span> 回首頁</router-link>
    </div>
</template>

<style>
    .vcenter > * {
        vertical-align: middle
    }
    .text {
        font-weight: normal;
    }
</style>

<script>
import Vue from 'vue'
import error_code from '../error_code.json'
import auth from '../auth'
export default {
    data () {
        return {
            user: auth.user_data,
            // autologin: false
        }
    },
    methods: {
        // toogle () {
        //     autologin = !autologin
        // },
        submit () {
            if (!this.account || !this.password) {
                return
            }
            this.$root.checking = true
            auth.login(this.account, this.password)
            .then(() => {
                this.$root.checking = false
                if (auth.user_data.logged) {
                    auth.register_auto_update()
                    this.$router.push('/')
                } else {
                    this.account = this.password = ""
                    this.$root.error('login_faild')
                }
            })
            .catch((code) => {
                this.$root.error(code)
            })
        },
    },
    // watch: {
    //     autologin () {
    //         if (this.autologin) {
    //             if (!confirm("警告：")) {
    //                 this.autologin = false
    //             }
    //         }
    //     },
    // }
}
</script>
