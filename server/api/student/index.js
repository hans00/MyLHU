import { Router } from 'express'
import cookieJar from '../../lib/cookieJar'
import r from '../../lib/backRequest'
import labor from './labor'
import inquire from './inquire'

export default (urls) => {
	let student = Router()
	student.get('/check', (req, res) => {
		var cookie = new cookieJar(req)
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

	student.get('/login', (req, res) => {
		var cookie = new cookieJar(req)
		r.post(urls.student.login, cookie, {
			sessionId: "fake_data_OWO",
			LogLDAPIDTXSd: req.session.account.id,
			LogLDAPPassTXSd: req.session.account.pw
		})
		.then(($) => {
			if ($("*:contains('錯誤')").length > 0) {
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
			if (err.statusCode && err.statusCode == 302) {
				res.json({
					status: 'success',
					logged: true
				})
			} else {
				res.json({
					status: 'conn_faild'
				})
			}
		})
	})

	student.use('/labor', labor(urls))

	student.use('/inquire', inquire(urls))
	
	return student
}
