<template lang="html">
    <div v-if="user.student">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            學生資訊系統，請選擇功能
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <router-link to="/student/labor" class="btn btn-primary btn-lg">搶勞作</router-link>
        <router-link to="/student/inquire/teaching" class="btn btn-primary btn-lg">教學問卷</router-link>
        <router-link to="/student/inquire/tutor" class="btn btn-primary btn-lg">導師問卷</router-link>
    </div>
    <div v-else>
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            目前無法登入學生系統。
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-home"></span> 回首頁</router-link>
    </div>
</template>

<script>
import auth from '../../auth'
export default {
    data ()  {
        return { user: auth.user }
    },
    mounted () {
        if (auth.user.logged) {
            if (!auth.user.student) {
                this.$root.checking = true
            }
            auth.student((status) => {
                this.$root.checking = false
                if (!status) {
                    $('#error').modal('show')
                    $('#error #msg').text("無法連線至龍華伺服器，請稍後再試。")
                }
            })
        } else {
            this.$router.push('/')
        }
    }
}
</script>
