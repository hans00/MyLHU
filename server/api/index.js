import { version } from '../../package.json'
import { Router } from 'express'
import querystring from 'querystring'
import cheerio from 'cheerio'
import cookieJar from '../lib/cookieJar'
import request from '../lib/request'
import student from './student'
import course from './course'

export default (urls) => {
	let api = Router();

    api.get('/', (req, res) => {
		res.json({ version })
	})

	api.get('/login/check', (req, res) => {
		var cookie = new cookieJar(req)
		request.get( urls.eportal.main,
			{
				referer: urls.eportal.main,
				cookie: cookie
			}, (error, response, body) => {
				if (!error) {
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
				} else {
					res.json({
						status: 'faild'
					})
				}
			}
		)
	})

    api.get('/login/image', (req, res) => {
		var cookie = new cookieJar(req)
		request.get(urls.eportal.captcha, { cookie: cookie }).pipe(res)
	})

    api.post('/login', (req, res) => {
		var cookie = new cookieJar(req)
		request.post(urls.eportal.login,
			{
		    	referer: urls.eportal.index,
		    	form: req.body,
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
			}
		)
	})

    api.get('/logout', (req, res) => {
		var cookie = new cookieJar(req)
		request.get(urls.eportal.logout ,{
		    	referer: urls.eportal.main,
		    	cookie: cookie
	    	}, (error, response, body) => {
				req.session.loggedJar = null
				res.json({
					status: "success"
				})
			}
		)
	})

	api.use('/student', student(urls))
	api.use('/course', course(urls))

	return api
}
