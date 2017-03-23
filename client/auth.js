import 'whatwg-fetch'

export default {
    user: {
        logged: false,
        student: false,
        course: false
    },
    student (cb) {
        var user = this.user
        fetch('/api/student/check', { credentials: 'same-origin' })
        .then((response) => { return response.json() })
        .then((json) => {
            if (json.status == "success") {
                if (json.logged) {
                    user.student = true
                }
                if (typeof cb === "function") cb(true)
            } else {
                if (typeof cb === "function") cb(false)
            }
        })
    },
    student_login (cb) {
        var user = this.user
        fetch('/api/student/login', { credentials: 'same-origin' })
        .then((response) => { return response.json() })
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
        fetch('/api/login/check', {credentials: 'same-origin'})
        .then(function(response) {
            return response.json()
        }).then(function(json) {
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
        fetch('/api/login', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                muid: account,
                mpassword: password,
                authcode: code
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
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
        fetch('/api/logout', {credentials: 'same-origin'})
        .then(function(response) {
            return response.json()
        }).then(function(json) {
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
