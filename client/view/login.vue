<template lang="html">
    <div v-if="!user.logged">
        <h1>登入</h1>
        <p class="lead">
            請直接輸入龍華系統之帳號密碼即可。
        </p>
        <form class="form-horizontal">
            <div class="form-group">
                <label for="account" class="col-sm-2 control-label">帳號</label>
                <div class="col-sm-10">
                    <input type="text" autocomplete="off" placeholder="帳號" class="form-control" v-model="account" id="account" required>
                </div>
            </div>
            <div class="form-group">
                <label for="password" class="col-sm-2 control-label">密碼</label>
                <div class="col-sm-10">
                    <input type="password" autocomplete="off" placeholder="密碼" class="form-control" v-model="password" id="password" required>
                </div>
            </div>
            <div class="form-group">
                <label for="captcha" class="col-sm-2 control-label">驗證碼</label>
                <div class="col-sm-10">
                    <input type="text" autocomplete="off" placeholder="驗證碼" class="form-control" v-model="captcha" id="captcha" required>
                </div>
            </div>
            <div class="form-group">
                <img :src="captchaImg" @click="refresh" alt="驗證碼" style="border-radius:6px;height:34px">
            </div>
            <button class="btn btn-default" id="submit" @click="submit">登入</button>
        </form>
    </div>
</template>

<script>
import auth from '../auth'
export default {
    data () {
        return {
            user: auth.user,
            captchaImg: '/api/login/image?' + (new Date()).getTime()
        }
    },
    methods: {
        submit () {
            if (!this.account || !this.password || !this.captcha) {
                return
            }
            auth.login(this.account, this.password, this.captcha, (ok) => {
                if (ok) {
                    window.location = "#"
                } else {
                    alert("資訊有誤，請重新輸入")
                    this.account = this.password = this.captcha = ""
                    this.refresh()
                }
            })
        },
        refresh () {
            this.captchaImg = '/api/login/image?' + (new Date()).getTime()
        }
    }
}
</script>
