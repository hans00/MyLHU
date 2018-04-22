import { Router } from 'express'
import querystring from 'querystring'
import crypto from 'crypto'
import { version } from '../../package.json'
import cookieJar from '../lib/cookieJar'
import r from '../lib/backRequest'
import schedule from './schedule'
import student from './student'
import course from './course'

export default (urls) => {
	let api = Router();

	api.get('/', (req, res) => {
		res.json({ version })
	})

	api.get('/login', (req, res) => {
		let cookie = new cookieJar(req)
		r.get(urls.student.check, cookie)
		.then(($) => {
			if ($("*:contains('重新登入')").length > 0) {
				res.json({
					status: 'success',
					logged: false
				})
			} else {
				res.json({
					status: 'success',
					logged: true
				})
			}
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	api.post('/login', (req, res) => {
		let cookie = new cookieJar(req)
		r.post(urls.student.login, cookie, {
			sessionId: "fake_data_OWO",
			LogLDAPIDTXSd: req.body.account,
			LogLDAPPassTXSd: req.body.password
		})
		.then(($) => {
			res.json({
				status: 'success',
				logged: false
			})
		})
		.catch((err) => {
			if (err.statusCode && err.statusCode == 302) {
				let token = crypto.randomBytes(128).toString('hex')
				req.session.account = {
					id: req.body.account,
					pw: req.body.password
				}
				res.json({
					status: 'success',
					logged: true,
					token:  token
				})
			} else {
				res.json({
					status: 'conn_faild'
				})
			}
		})
	})

	api.get('/logout', (req, res) => {
		let cookie = new cookieJar(req)
		r.get(urls.imoving.logout, cookie)
		.then(($) => {
			req.session.loggedJar = null
			req.session.account   = null
			res.json({
				status: "success"
			})
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	api.use('/schedule', schedule(urls))
	api.use('/student', student(urls))
	api.use('/course', course(urls))

	return api
}
