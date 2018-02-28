import Vue from 'vue'

export default {
	user_data: {
		logged:  false,
		student: false,
		course:  false,
		auto_refresh: {}
	},
	student: {
		check () {
			let _this = this
			this.get('/student/check')
			.then((response) => response.json())
			.then((json) => {
				if (json.status == "success") {
					if (json.logged) {
						_this.user.student = true
					} else {
						_this.student_login(cb)
					}
				} else {
					throw "cannot_conn_school"
				}
			})
		},
		login () {
			let user_data = this.user_data
			this.get('/student/login')
			.then((response) => response.json())
			.then((json) => {
				if (json.status == "success") {
					user_data.student = json.logged
				} else {
					throw "cannot_conn_school"
				}
			})
		}
	},
	check () {
		let _this = this
		this.get('/login/check')
		.then((json) => {
			if (json.status == "success") {
				_this.user_data.logged = json.logged
				if (json.logged) {
					_this.student_check()
				}
			} else {
				throw "cannot_conn_school"
			}
		})
	},
	login (account, password) {
		var user_data = this.user_data
		this.post('/login', {
			account: account,
			password: password
		})
		.then((json) => {
			if (json.status == "success") {
				user_data.logged = json.logged
				if (json.logged) {
					_this.student.login()
				}
			} else {
				throw "cannot_conn_school"
			}
		})
	},
	logout () {
		var user = this.user
		this.get('/logout')
		.then((json) => {
			if (json.status == "success") {
				user.logged  = false
				user.student = false
				user.course  = false
			} else {
				throw "cannot_conn_school"
			}
		})
	},
	get (api_path) {
		Vue.http.get('/api' + api_path)
		.then((response) => response.json())
	},
	post (api_path, data) {
		Vue.http.post('/api' + api_path, data)
		.then((response) => response.json())
	}
}
