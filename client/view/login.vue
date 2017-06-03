<template lang="html">
    <div v-if="!user.logged">
        <h1>登入</h1>
        <p class="lead">
            請直接輸入龍華系統之帳號密碼即可。
        </p>
        <form class="form-horizontal col-md-6 col-md-offset-3" v-on:submit.prevent="submit">
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
            <div class="form-group">
                <label for="captcha" class="col-sm-2 control-label">驗證碼</label>
                <div class="col-sm-10">
                    <input type="text" autocomplete="off" title="請輸入下方驗證碼圖片之文字" placeholder="請輸入下方驗證碼圖片之文字" class="form-control" v-model="captcha" id="captcha" required>
                </div>
            </div>
            <div class="form-group">
                <img :src="captchaImg" @click="refresh" @load="autoFill" id="captchaImg" alt="驗證碼" style="border-radius:6px;height:34px">
            </div>
            <button class="btn btn-default" id="submit" type="submit">登入</button>
        </form>
    </div>
    <div v-else>
        <h1>登入</h1>
        <p class="lead">您已經登入。</p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-home"></span> 回首頁</router-link>
    </div>
</template>

<script>
import auth from '../auth'
import Tesseract from 'tesseract.js'
export default {
    data () {
        return {
            user: auth.user,
            captchaImg: '/api/login/image?' + (new Date()).getTime(),
            captcha: ""
        }
    },
    methods: {
        submit () {
            if (!this.account || !this.password || !this.captcha) {
                return
            }
            this.$root.checking = true
            auth.login(this.account, this.password, this.captcha, (status) => {
                this.$root.checking = false
                if (status) {
                    if (auth.user.logged) {
                        this.$router.push('/')
                    } else {
                        this.account = this.password = this.captcha = ""
                        this.captchaImg = '/api/login/image?' + (new Date()).getTime()
                        $('#error').modal('show')
                        $('#error #msg').text("輸入的資料有誤，請再檢查。")
                    }
                } else {
                    $('#error').modal('show')
                    $('#error #msg').text("無法連線至龍華伺服器，請稍後再試。")
                }
            })
        },
        refresh () {
            this.captcha = ""
            this.captchaImg = '/api/login/image?' + (new Date()).getTime()
        },
        autoFill() {
            $("#captcha").attr("placeholder","分析中")
            let vue = this
            Tesseract.recognize(document.getElementById("captchaImg"), {
                tessedit_char_blacklist: 'abcdefghijklmnopqrstuvwxyz1234567890\'\":;=+-_\\|]}[{`!‘ @#$%^&*()/?.>,<'
            })
            .then((result) => {
                $("#captcha").attr("placeholder","")
                vue.captcha = result.text.replace("\n\n","")
            })
        }
    }
}
</script>
