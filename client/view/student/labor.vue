<template lang="html">
    <div v-if="user.logged">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            搶勞作！！！<br>
            目前功能僅無差別搶勞作（不搶限xx系專用勞作），若需取消報名請回到學生資訊系統操作。
        </p>
        <router-link to="/" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <form class="form-inline">
            <div class="form-group">
                <label for="start" class="sr-only control-label">啟動</label>
                <label class="toggle">
                    <input type="checkbox">
                    <span class="handle" @click="toogle"></span>
                </label>
            </div>
            <div class="form-group">
                <label for="intervl" class="sr-only control-label">間格</label>
                <div class="input-group">
                    <input type="number" id="intervl" class="form-control" v-model="interval" @change="setup" min="0.5" step="0.1">
                    <div class="input-group-addon">秒</div>
                </div>
            </div>
        </form>
        <div class="col-lg-6">
            <ul class="list-group">
                <li class="list-group-item list-group-item-warning active" style="color: white">尚未報名</li>
                <li v-for="name in faild_list" class="list-group-item">
                    {{ name }}
                </li>
            </ul>
        </div>
        <div class="col-lg-6">
            <ul class="list-group">
                <li class="list-group-item list-group-item-success" style="color: white">已報名</li>
                <li v-for="name in succ_list" class="list-group-item">
                    {{ name }}
                </li>
            </ul>
        </div>
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
import error_code from '../../error_code.json'
export default {
    data ()  {
        return {
            user: auth.user_data,
            start: false,
            interval: 1,
            list: {},
            succ_list: ["何でもない…"],
            faild_list: ["何でもない…"]
        }
    },
    methods: {
        toogle () {
            this.start = !this.start
        },
        setup () {
            if (this.handle) {
                clearInterval(this.handle)
            }
            this.handle = setInterval(this.sync, this.interval * 1000)
        },
        sync () {
            if (this.start) {
                this.getList()
                for (var id in this.list) {
                    if (!this.list[id].got && !this.list[id].running) {
                        this.list[id].running = true
                        this.getLabor(id)
                    }
                }
                this.display_faild()
                this.display_succ()
            }
        },
        getList () {
            auth.get('/student/labor/list?' + (new Date()).getTime())
            .then((json) => {
                for (var id in json.list) {
                    if (!(id in this.list)) {
                        this.list[id] = {
                            name: json.list[id],
                            got: false,
                            running: false
                        }
                    }
                }
            })
            .catch(code => this.$root.error(code))
        },
        getLabor (id) {
            auth.post('/student/labor/get?' + (new Date()).getTime(), { id: id })
            .then((json) => {
                if (json.result == "success") {
                    switch (json.result) {
                        case "available":
                            this.getLabor(id)
                            break
                        case "success":
                            this.list[id].got = true
                            break
                        case "fulled":
                            this.list[id].got = false
                            break
                    }
                }
                this.list[id].running = false
            })
            .catch(code => this.$root.error(code))
        },
        display_faild () {
            var temp = []
            for (var id in this.list) {
                if (this.list[id].got == false) {
                    temp[temp.length] = this.list[id].name
                }
            }
            if (temp.length > 0) {
                this.faild_list = temp
            } else {
                this.faild_list = ["何でもない…"]
            }
        },
        display_succ () {
            var temp = []
            for (var id in this.list) {
                if (this.list[id].got == true) {
                    temp[temp.length] = this.list[id].name
                }
            }
            if (temp.length > 0) {
                this.succ_list = temp
            } else {
                this.succ_list = ["何でもない…"]
            }
        }
    },
    destroyed () {
        clearInterval(this.handle)
    }
}
</script>
