<template lang="html">
    <div v-if="user.student">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            導師問券填寫
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <form  v-on:submit.prevent="submit">
            <div class="form-group">
                <label for="score">您想給班導多少分呢？</label>
                <span v-html="score" class="badge"></span><br>
                <input class="slider" id="score" v-model="score" type="text" data-slider-min="1" data-slider-max="5" data-slider-step="1" data-slider-value="5"/>
            </div>
            <button class="btn btn-primary" type="submit">送出</button>
        </form>
        <h3 v-html="result"></h3>
    </div>
    <div v-else>
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            請確定是否已登入
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-home"></span> 回首頁</router-link>
    </div>
</template>

<script>
import auth from '../../../auth'
import Slider from 'bootstrap-slider'
export default {
    data ()  {
        return {
            user: auth.user,
            result: ""
        }
    },
    methods: {
        submit () {
            var t = this
            this.$root.checking = true
            fetch('/api/student/inquire/tutor/fill', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score: t.score
                })
            })
            .then((response) => { return response.json() })
            .then((json) => {
                this.$root.checking = false
                if (json.status == "success") {
                    t.result = "成功送出。"
                } else {
                    t.result = "失敗！！"
                }
            })
        }
    },
    mounted () {
        if (auth.user.logged) {
            auth.student((status) => {
                this.$root.checking = false
                if (!status) {
                    $('#error').modal('show')
                    $('#error #msg').text("無法連線至龍華伺服器，請稍後再試。")
                }
            })
            this.slide = new Slider("input.slider")
        } else {
            this.$router.push('/')
        }
    },
    destroyed () {
    }
}
</script>
