import { version } from '../../package.json'
import { Router } from 'express'
import querystring from 'querystring'
import cheerio from 'cheerio'
import cookieJar from '../lib/cookieJar'
import r from '../lib/backRequest'
import student from './student'
import course from './course'
import crypto from 'crypto'

export default (urls) => {
	let api = Router();

	api.get('/', (req, res) => {
		res.json({ version })
	})

	api.get('/login/check', (req, res) => {
		var cookie = new cookieJar(req)
		r.get(urls.imoving.login, cookie.jar)
		.then(($) => {
			var login = $('[name="登入"]')
			res.json({
				status: 'success',
				logged: (login.length == 0)
			})
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	api.post('/login', (req, res) => {
		var cookie = new cookieJar(req)
		r.post(urls.imoving.login, cookie.jar, {
			form: {
				authority: "lhu",
				nativeApp: "true",
				loginUser: req.body.account,
				loginPassword: req.body.password,
				remainLoggedIn: "true"
			}
		})
		.then(($) => {
			if ($("*:contains('登入出現問題')").length > 0) {
				res.json({
					status: 'success',
					logged: false
				})
			} else {
				let token = crypto.randomBytes(128).toString('hex')
				res.json({
					status: 'success',
					logged: true,
					token:  token
				})
			}
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	api.get('/logout', (req, res) => {
		var cookie = new cookieJar(req)
		request.get(urls.imoving.logout, cookie.jar)
		.then(($) => {
			req.session.loggedJar = null
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

	api.use('/student', student(urls))
	api.use('/course', course(urls))

	return api
}
