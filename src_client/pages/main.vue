<template lang="html">
    <div v-if="!user.logged">
        <h1>歡迎</h1>
        <p class="lead">
            您尚未登入
        </p>
        <router-link to="/login" class="btn btn-success">登入</router-link>
    </div>
    <div v-else>
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            請選擇功能
        </p>
        <router-link to="/student" class="btn btn-primary btn-lg">學生資訊系統</router-link>
        <router-link to="/course" class="btn btn-primary btn-lg">線上選課系統</router-link>
    </div>
</template>

<script>
import auth from '../auth'
export default {
    data ()  {
        return { user: auth.user }
    }
}
</script>
