<template lang="html">
    <div v-if="user.student">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            搶勞作！！！
        </p>
        <router-link to="/student" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <form class="form-inline">
            <div class="form-group">
                <label for="start" class="sr-only control-label">啟動</label>
                <div class="input-group">
                    <label class="toggle">
			            <input type="checkbox" >
			            <span class="handle" @click="toogle"></span>
			        </label>
                </div>
            </div>
            <div class="form-group">
                <label for="intervl" class="sr-only control-label">間格</label>
                <div class="input-group">
                    <input type="number" id="intervl" class="form-control" v-model="interval" @change="setup" min="0.8" step="0.1">
                    <div class="input-group-addon">秒</div>
                </div>
            </div>
        </form>
        <ul class="list-group" style="float:left"></ul>
        <ul class="list-group" style="float:right"></ul>
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
import auth from '../../auth'
export default {
    data ()  {
        return { user: auth.user, start: false, interval: 1 }
    },
    methods: {
        toogle () {
            this.start = !this.start
        },
        setup () {
            if (this.handle) {
                clearInterval(this.handle)
            }
            this.handle = setInterval(this.getLabor, this.interval * 1000)
        },
        getLabor () {
            console.log(this.start)
        }
    },
    mounted () {
        auth.student()
        this.setup()
    },
    destroyed () {
        clearInterval(this.handle)
    }
}
</script>
