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
        <div class="col-sm-6 col-sm-offset-3">
            <div class="inner-addon left-addon">
                <i class="glyphicon glyphicon-search"></i>
                <input type="search" class="form-control" placeholder="搜尋" v-model="search"/>
            </div>
        </div>
        <div class="clearfix"></div>
        <br>
        <div class="main-block" v-if="search == ''">
            <router-link v-for="func in functions" v-bind:to="func.path" class="btn btn-primary btn-lg">{{func.name}}</router-link>
        </div>
        <div class="main-block" v-else>
            <router-link v-for="func in filter" v-bind:to="func.path" class="btn btn-primary btn-lg">{{func.name}}</router-link>
            <div v-if="!filter.length">找不到包含「{{search}}」的功能。</div>
        </div>
    </div>
</template>

<script>
import auth from '../auth'
export default {
    data ()  {
        return {
            user: auth.user,
            functions: [
                { path: "/student/labor", name: "搶勞作" },
                { path: "/student/inquire/teaching", name: "教學問卷" },
                { path: "/student/inquire/tutor", name: "導師問卷" },
            ],
            filter: [],
            search: ''
        }
    },
    watch: {
        search() {
            this.filter = []
            for (var func of this.functions) {
                if (func.name.indexOf(this.search) !== -1) {
                    this.filter.push(func)
                }
            }
        }
    }
}
</script>
