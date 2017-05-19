<template lang="html">
    <div v-if="user.student">
        <h1>歡迎使用 My LHU</h1>
        <p class="lead">
            教學問券填寫
        </p>
        <router-link to="/student" class="btn btn-info"><span class="glyphicon glyphicon-arrow-left"></span> 回上一層</router-link><br><br>
        <div class="col-lg-6">
            <div class="list-group" id="inqs">
                <a class="list-group-item list-group-item-info">
                    <h4 class="list-group-item-heading">問卷</h4>
                </a>
                <a v-for="item in list" class="list-group-item" @click="click(item)" v-bind:id="item.id" v-bind:class="{ 'disabled': !item.avaiable }">
                    班級：{{ item.class }}
                    課程：{{ item.subject }}
                    老師：{{ item.teacher }}
                    <span v-if="!item.avaiable">（已填寫）</span>
                </a>
                <a class="list-group-item" v-if="list.length==0">沒有問卷</a>
            </div>
        </div>
        <div class="col-lg-6">
            <div v-if="selected != ''">
                <form class="form-inline" v-on:submit.prevent="submit">
                    <div class="form-group">
                        <label for="tscore">您想給老師多少分呢？</label>
                        <div class="input-group">
                            <input id="tscore" v-model="tscore" class="form-control" type="number" min="1" max="5" step="1" value="5"/>
                            <span class="input-group-btn">
                                <a class="btn btn-default" onclick="document.getElementById('tscore').stepUp(1)"><i class="glyphicon glyphicon-plus"></i></a>
                                <a class="btn btn-default" onclick="document.getElementById('tscore').stepDown(1)"><i class="glyphicon glyphicon-minus"></i></a>
                            </span>
                        </div>
                    </div>
                    <br>
                    <div class="form-group">
                        <label for="myscore">您想給自己多少分呢？</label>
                        <div class="input-group">
                            <input id="myscore" v-model="myscore" class="form-control" type="number" min="1" max="10" step="1" value="10"/>
                            <span class="input-group-btn">
                                <a class="btn btn-default" onclick="document.getElementById('myscore').stepUp(1)"><i class="glyphicon glyphicon-plus"></i></a>
                                <a class="btn btn-default" onclick="document.getElementById('myscore').stepDown(1)"><i class="glyphicon glyphicon-minus"></i></a>
                            </span>
                        </div>
                    </div>
                    <br><br>
                    <button class="btn btn-primary" type="submit">送出</button>
                </form>
                <h4 v-html="result"></h4>
            </div>
            <div v-else>
                <h3>請先選擇問卷。</h3>
            </div>
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
import auth from '../../../auth'
import Slider from 'bootstrap-slider'
export default {
    data ()  {
        return {
            user: auth.user,
            list: [],
            selected: '',
            result: ''
        }
    },
    methods: {
        click (item) {
            if (!item.avaiable) return
            if ($("#inqs a#"+item.id).hasClass("active")) {
                $("#inqs a#"+item.id).removeClass("active")
                this.result = this.selected = ''
            } else {
                $("#inqs a.active").removeClass("active")
                $("#inqs a#"+item.id).addClass("active")
                this.selected = item.id
            }
        },
        submit () {
            var t = this
            this.$root.checking = true
            fetch('/api/student/inquire/teaching/fill', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: t.selected,
                    myscore: t.myscore,
                    tscore: t.tscore
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
        },
        getList () {
            this.$root.checking = true
            fetch('/api/student/inquire/teaching/get?' + (new Date()).getTime(), { credentials: 'same-origin' })
            .then((response) => { return response.json() })
            .then((json) => {
                this.$root.checking = false
                if (json.status == "success") {
                    this.list = []
                    for (var id in json.list) {
                        var tmp = json.list[id]
                        tmp.id = id
                        this.list.push(tmp)
                    }
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
            this.getList()
        } else {
            this.$router.push('/')
        }
    },
    destroyed () {
        clearInterval(this.handle)
    }
}
</script>
