import { version } from '../../package.json'
import { Router } from 'express'
import querystring from 'querystring'
import cheerio from 'cheerio'
import cookieJar from '../lib/cookieJar'
import request from 'request'
import student from './student'
import course from './course'

export default (urls) => {
	let api = Router();

	api.get('/', (req, res) => {
		res.json({ version })
	})

	api.get('/login/check', (req, res) => {
		var cookie = new cookieJar(req)
		var body = ""
		request.get({
				url: urls.eportal.main,
				headers: { "Referer": urls.eportal.main },
				jar: cookie.jar
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
			var input = cheerio.load(body)('input#muid[type="hidden"]')
			if (input.length > 0 && input.val() != '') {
				res.json({
					status: 'success',
					logged: true
				})
			} else {
				res.json({
					status: 'success',
					logged: false
				})
			}
		})
		.on('error', (err) => {
			res.json({
				status: 'faild'
			})
		})
	})

	api.get('/login/image', (req, res) => {
		var cookie = new cookieJar(req)
		request.get({
			url: urls.eportal.captcha,
			jar: cookie.jar
		}).on('response', () => cookie.save())
		.pipe(res)
	})

	api.post('/login', (req, res) => {
		var cookie = new cookieJar(req)
		var body = ""
		request.post({
				url: urls.eportal.login,
				headers: { "Referer": urls.eportal.index },
				jar: cookie.jar,
				form: req.body
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
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
		})
		.on('error', (err) => {
			res.json({
				status: 'faild'
			})
		})
	})

	api.get('/logout', (req, res) => {
		var cookie = new cookieJar(req)
		var body = ""
		request.get({
				url: urls.eportal.logout,
				headers: { "Referer": urls.eportal.main },
				jar: cookie.jar
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
			req.session.loggedJar = null
			res.json({
				status: "success"
			})
		})
		.on('error', (err) => {
			res.json({
				status: 'faild'
			})
		})
	})

	api.use('/student', student(urls))
	api.use('/course', course(urls))

	return api
}
