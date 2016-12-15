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
        <ul class="list-group" style="float:left">
            <li class="list-group-item list-group-item-warning">尚未報名</li>
            <li v-for="name in is_got(list, false)" class="list-group-item">
                {{ name }}
            </li>
        </ul>
        <ul class="list-group" style="float:right">
            <li class="list-group-item list-group-item-success">已報名</li>
            <li v-for="name in is_got(list, true)" class="list-group-item">
                {{ name }}
            </li>
        </ul>
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
        return { user: auth.user, start: false, interval: 1, list:{} }
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
            this.getList()
            if (this.list.length > 0) {
                this.scanLabor()
            }
        },
        getList () {
            fetch('/api/student/labor/list', { credentials: 'same-origin' })
            .then((response) => { return response.json() })
            .then((json) => {
                if (json.status != "success") {
                    for (var id in json.list) {
                        if (!this.list[id]) {
                            this.list[id] = {
                                name: json.list[id]
                            }
                        }
                    }
                }
            })
        },
        scanLabor () {
            for (var id in this.list) {
                if (!this.list[id].got) {
                    this.getLabor(id)
                }
            }
        },
        getLabor (id) {
            fetch('/api/student/labor/get', {
                credentials: 'same-origin',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            })
            .then((response) => { return response.json() })
            .then((json) => {
                if (json.status == "success" && json.result == "success") {
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
            })
        },
        is_got (list, check) {
            var temp = []
            for (data of list) {
                if (data.got == check) {
                    temp[temp.length] = data.name
                }
            }
            return temp
        }
    },
    mounted () {
        if (auth.user.logged) {
            auth.student()
            this.setup()
        }
    },
    destroyed () {
        clearInterval(this.handle)
    }
}
</script>
