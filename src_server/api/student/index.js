import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../lib/cookieJar'
import request from '../../lib/request'
import labor from './labor'

export default (urls) => {
	let student = Router()

	student.get('/check', (req, res) => {
		var cookie = new cookieJar(req)
        request.get(urls.student.check, { cookie: cookie },
			(error, response, body) => {
				if (!error) {
					var $ = cheerio.load(body)
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
				} else {
					res.json({
						status: 'faild'
					})
				}
			}
		)
	})

    student.get('/login', (req, res) => {
		var cookie = new cookieJar(req)
		request.get(urls.eportal.std_sso, { cookie: cookie },
			(error, response, body) => {
				if (!error) {
					var $ = cheerio.load(body)
					request.post(urls.student.login, {
							form: {
								sessionId: $("input[name='sessionId']").val(),
								LogLDAPIDTXSd: $("input[name='LogLDAPIDTXSd']").val(),
								LogLDAPPassTXSd: $("input[name='LogLDAPPassTXSd']").val()
							},
					    	cookie: cookie
				    	}, (error, response, body) => {
							if (!error) {
								var $ = cheerio.load(body)
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
							} else {
								res.json({
									status: 'faild'
								})
							}
						})
				} else {
					res.json({
						status: 'faild'
					})
				}
			}
		)
	})

	student.use('/labor', labor(urls))

    student.get('/inquire/teaching', (req, res) => {
		res.json({status:"faild"})
	})

    student.get('/inquire/tutor', (req, res) => {
		res.json({status:"faild"})
	})

	return student
}
