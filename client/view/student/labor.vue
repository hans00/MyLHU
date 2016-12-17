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
                <li v-if="is_got(false).length > 0" v-for="name in is_got(false)" class="list-group-item">
                    {{ name }}
                </li>
            </ul>
        </div>
        <div class="col-lg-6">
            <ul class="list-group">
                <li class="list-group-item list-group-item-success" style="color: white">已報名</li>
                <li v-for="name in is_got(true)" class="list-group-item">
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
export default {
    data ()  {
        return {
            user: auth.user,
            start: false,
            interval: 1,
            list: {}
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
                if (this.list.length > 0) {
                    this.scanLabor()
                }
            }
        },
        getList () {
            fetch('/api/student/labor/list?' + (new Date()).getTime(), { credentials: 'same-origin' })
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
            fetch('/api/student/labor/get?' + (new Date()).getTime(), {
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
        is_got (check) {
            var temp = []
            for (var id in this.list) {
                if (this.list[id].got == check) {
                    temp[temp.length] = this.list[id].name
                }
            }
            if (temp.length > 0) {
                return temp
            } else {
                return ["何でもない…"]
            }
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
