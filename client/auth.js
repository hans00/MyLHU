import Vue from 'vue'

const auth = {
	user_data: {
		logged:  false,
		course:  false,
	},
	auto_refresh: {},
	get (api_path) {
		return Vue.http.get('/api' + api_path)
		.then((response) => response.json())
		.then((json) => {
			if (json.status != "success") {
				throw json.status
			} else {
				return json
			}
		})
	},
	post (api_path, data) {
		return Vue.http.post('/api' + api_path, data)
		.then((response) => response.json())
		.then((json) => {
			if (json.status != "success") {
				throw json.status
			} else {
				return json
			}
		})
	},
	check () {
		return auth.get('/login')
		.then((json) => {
			auth.user_data.logged = json.logged
		})
	},
	login (account, password) {
		return auth.post('/login', {
			account: account,
			password: password
		})
		.then((json) => {
			auth.user_data.logged = json.logged
		})
	},
	logout () {
		return auth.get('/logout')
		.then((json) => {
			auth.user_data.logged  = false
			auth.user_data.student = false
			auth.user_data.course  = false
		})
	},
	register_auto_update() {
		if (!auth.auto_refresh['basic']) {
			auth.auto_refresh['basic'] = setInterval(auth.check, 3000)
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
