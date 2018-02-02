import Vue from 'vue'

export default {
    user: {
        logged:  false,
        student: false,
        course:  false,
        auto_refresh: {}
    },
    student (cb) {
        var system = this
        Vue.http.get('/api/student/check')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == "success") {
                if (json.logged) {
                    system.user.student = true
                } else {
                    system.student_login(cb)
                }
            } else {
                if (typeof cb === "function") cb(false)
            }
        })
    },
    student_login (cb) {
        var user = this.user
        Vue.http.get('/api/student/login')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == "success") {
                user.student = json.logged
                if (typeof cb === "function") cb(true)
            } else {
                user.student = false
                if (typeof cb === "function") cb(false)
            }
        })
    },
    check (cb) {
        var user = this.user
        Vue.http.get('/api/login/check')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == "success") {
                user.logged = json.logged
                if (typeof cb === "function") cb(true)
            } else {
                if (typeof cb === "function") cb(false)
            }
        })
    },
    login (account, password, code, cb) {
        var user = this.user
        Vue.http.post('/api/login', {
            muid: account,
            mpassword: password,
            authcode: code
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.status == "success") {
                user.logged = json.logged
                if (typeof cb === "function") cb(true)
            } else {
                if (typeof cb === "function") cb(false)
            }
        })
    },
    logout (cb) {
        var user = this.user
        Vue.http.get('/api/logout')
        .then((response) => response.json())
        .then((json) => {
            if (json.status == "success") {
                user.logged = false
                user.student = false
                user.course = false
                if (typeof cb === "function") cb(true)
            } else {
                if (typeof cb === "function") cb(false)
            }
        })
    }
}
