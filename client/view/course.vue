<template lang="html">
    <div v-if="user.logged">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            選課系統，請選擇功能
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <router-link to="/course" class="btn btn-primary btn-lg">???</router-link>
    </div>
</template>

<script>
import auth from '../auth'
export default {
    data () {
        return {
            user: auth.user
        }
    }
}
</script>
