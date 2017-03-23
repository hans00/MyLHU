import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../lib/cookieJar'
import request from 'request'
import labor from './labor'

export default (urls) => {
	let student = Router()
	var body = ""
	student.get('/check', (req, res) => {
		var cookie = new cookieJar(req)
		request.get({
				url: urls.student.check,
				jar: cookie.jar
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
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
		})
		.on('error', (err) => {
			res.json({
				status: 'faild'
			})
	  	})
	})

    student.get('/login', (req, res) => {
		var cookie = new cookieJar(req)
		var body = ""
		request.get({
				url: urls.eportal.std_sso,
				jar: cookie.jar
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
			var $ = cheerio.load(body)
			var body2 = ""
			request.post({
					url: urls.student.login,
					jar: cookie.jar,
					form: {
						sessionId: $("input[name='sessionId']").val(),
						LogLDAPIDTXSd: $("input[name='LogLDAPIDTXSd']").val(),
						LogLDAPPassTXSd: $("input[name='LogLDAPPassTXSd']").val()
					}
				})
			.on('response', () => cookie.save())
			.on('data', (data) => body2 += data)
			.on('end', () => {
				var $ = cheerio.load(body2)
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
			.on('error', (err) => {
				res.json({
					status: 'faild',
					step: 'login'
				})
		  	})
		})
		.on('error', (err) => {
			res.json({
				status: 'faild',
				step: 'sso'
			})
	  	})
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
