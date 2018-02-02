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
                <div class="form-group">
                    <label for="captcha" class="col-sm-2 control-label">驗證碼</label>
                    <div class="col-sm-10">
                        <div class="input-group">
                            <input type="text" autocomplete="off" title="請輸入右方驗證碼圖片之文字" placeholder="請輸入右方驗證碼圖片之文字" class="form-control" v-model="captcha" id="captcha" required>
                            <div class="input-group-addon input-group-addon-img">
                                <img :src="captchaImg" @click="refresh" @load="autoFill" id="captchaImg" alt="無法載入驗證碼" title="點我更新驗證碼">
                            </div>
                        </div>
                    </div>
                </div>
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
    .input-group-addon-img {
        padding: 0;
        overflow-y: hidden;
    }
    .input-group-addon-img > img {
        height: 32px;
    }
</style>

<script>
import Vue from 'vue'
import auth from '../auth'
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
                        this.refresh()
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
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            })
            .then((result) => {
                $("#captcha").attr("placeholder","")
                vue.captcha = result.text.replace("\n\n","").replace(" ","")
            })
        }
    }
}
</script>
