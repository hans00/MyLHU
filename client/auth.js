import Vue from 'vue'

const auth = {
	user_data: {
		logged:  false,
		student: false,
		course:  false,
	},
	auto_refresh: {},
	get (api_path) {
		return Vue.http.get('/api' + api_path)
		.then((response) => response.json())
	},
	post (api_path, data) {
		return Vue.http.post('/api' + api_path, data)
		.then((response) => response.json())
	},
	student: {
		check () {
			const student = this
			return auth.get('/student/check')
			.then((json) => {
				if (json.status == "success") {
					if (json.logged) {
						auth.user_data.student = true
					} else {
						student.login()
					}
				} else {
					throw "cannot_conn_school"
				}
			})
		},
		login () {
			return auth.get('/student/login')
			.then((json) => {
				if (json.status == "success") {
					auth.user_data.student = json.logged
				} else {
					throw "cannot_conn_school"
				}
			})
		}
	},
	check () {
		return auth.get('/login')
		.then((json) => {
			if (json.status == "success") {
				auth.user_data.logged = json.logged
				if (json.logged) {
					auth.student.check()
				}
			} else {
				throw "cannot_conn_school"
			}
		})
	},
	login (account, password) {
		return auth.post('/login', {
			account: account,
			password: password
		})
		.then((json) => {
			if (json.status == "success") {
				auth.user_data.logged = json.logged
				if (json.logged) {
					auth.student.login()
				}
			} else {
				throw "cannot_conn_school"
			}
		})
	},
	logout () {
		return auth.get('/logout')
		.then((json) => {
			if (json.status == "success") {
				auth.user_data.logged  = false
				auth.user_data.student = false
				auth.user_data.course  = false
			} else {
				throw "cannot_conn_school"
			}
		})
	},
	register_auto_update() {
		if (!auth.auto_refresh['basic']) {
			auth.auto_refresh['basic'] = setInterval(auth.check, 1000)
		}
	},
	clear_auto_update() {
		if (auth.auto_refresh['basic']) {
			clearInterval(auth.auto_refresh['basic'])
			auth.auto_refresh['basic'] = null
		}
	},
}

export default auth
