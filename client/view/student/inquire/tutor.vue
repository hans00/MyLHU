<template lang="html">
    <div v-if="user.logged">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            導師問券填寫
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <form  v-on:submit.prevent="submit" v-if="available">
            <div class="form-group">
                <label for="score">您想給班導多少分呢？</label>
                <span v-html="score" class="badge"></span><br>
                <input class="slider" id="score" v-model="score" type="text" data-slider-min="1" data-slider-max="5" data-slider-step="1" data-slider-value="5"/>
            </div>
            <button class="btn btn-primary" type="submit">送出</button>
            <br>
            <h3 v-html="result"></h3>
        </form>
        <p class="lead" v-else>
            目前尚未開放或您已填寫。
        </p>
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
import error_code from '../../../error_code.json'
import Slider from 'bootstrap-slider'
export default {
    data ()  {
        return {
            available: false,
            user: auth.user_data,
            result: ""
        }
    },
    methods: {
        submit () {
            var t = this
            this.$root.checking = true
            auth.post('/student/inquire/tutor/fill', {
                score: t.score
            })
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
    watch: {
        available() {
            if (this.available) {
                this.$nextTick(() => new Slider('.slider'))
            }
        }
    },
    mounted () {
        if (auth.user_data.logged) {
            this.$root.checking = true
            auth.get('/student/inquire/tutor/check')
            .then((json) => {
                this.$root.checking = false
                this.available = json.available
            })
            .catch(code => this.$root.error(code))
        } else {
            this.$router.push('/')
        }
    },
    destroyed () {
    }
}
</script>
