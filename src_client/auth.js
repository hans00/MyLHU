import 'whatwg-fetch'

export default {
    user: {
        logged: false,
        student: false,
        course: false
    },
    student () {
        var user = this.user
        fetch('/api/student/check', { credentials: 'same-origin' })
        .then((response) => { return response.json() })
        .then((json) => {
            if (json.status == "success") {
                if (!json.logged) {
                    fetch('/api/student/login', { credentials: 'same-origin' })
                    .then((response) => { return response.json() })
                    .then((json) => {
                        if (json.status == "success") {
                            user.student = json.logged
                        } else {
                            user.student = false
                        }
                    })
                } else {
                    user.student = true
                }
            }
        })
    },
    check () {
        var user = this.user
        fetch('/api/login/check', {credentials: 'same-origin'})
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            if (json.status == "success") {
                user.logged = json.logged
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
                cb(user.logged)
            } else {
                alert("無法正常連線至龍華系統")
            }
        })
    },
    logout () {
        var user = this.user
        fetch('/api/logout', {credentials: 'same-origin'})
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            if (json.status == "success") {
                user.logged = false
            }
        })
    }
}
