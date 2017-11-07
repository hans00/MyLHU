import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../lib/cookieJar'
import request from 'request'
import md5 from 'md5'

export default (urls) => {
	let labor = Router()

	labor.get('/list', (req, res) => {
		var cookie = new cookieJar(req)
		var body = ""
		request.get({
				url: urls.student.labor.list,
				jar: cookie.jar
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
			if (!req.session.labor) {
				req.session.labor = {}
			}
			var $ = cheerio.load(body)
			if ($("*:contains('皆已通過')").length > 0) {
				res.json({
					status: 'success',
					list: {}
				})
				return
			}
			var table = $("#DG_Content")
			if (table.find("tr").length > 0) {
				table.find("tr").each((i, elem) => {
					if (i == 0) return
					var _name = elem.children[2].children[0].children[0].data
					var _url  = elem.children[1].children[0].children[0].attribs.href
					var id    = md5(_name)
					if (!_name.includes("限"))
					if (!(id in req.session.labor)) {
						req.session.labor[id] = {
							url: urls.student.labor.get + _url.split("/").pop(),
							name: _name,
							count: 0,
							post: {},
							got: false
						}
					}
				})
				var output = {
					status: 'success',
					list: {}
				}
				for (var id in req.session.labor) {
					output.list[id] = req.session.labor[id].name
				}
				res.json(output)
			} else {
				res.json({
					status: 'success',
					list: {}
				})
			}
		})
		.on('error', (err) => {
			res.json({
				status: 'faild'
			})
		})
	})

	labor.post('/get', (req, res) => {
		if (!req.session.labor[req.body.id]) {
			res.json({
				status: 'faild',
				step: 'check'
			})
			return
		}
		var now = req.session.labor[req.body.id]
		var cookie = new cookieJar(req)
		var body = ""
		request.post({
				url: now.url,
				jar: cookie.jar,
				form: now.post
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
			var $ = cheerio.load(body)
			req.session.labor[req.body.id].post = {
				__VIEWSTATE: $("[name='__VIEWSTATE']").val(),
				Btn_Join: $("#Btn_Join").val()
			}
			switch (req.session.labor[req.body.id].post.Btn_Join) {
				case "取消參加此活動":
					res.json({
						status: 'success',
						result: 'success'
					})
					break
				case "活動人數額滿":
					res.json({
						status: 'success',
						result: 'fulled'
					})
					break
				case "報名參加此活動":
					res.json({
						status: 'success',
						result: 'available'
					})
					break
			}
		})
		.on('error', (err) => {
			res.json({
				status: 'faild',
				step: 'connection'
			})
		})
	})

	return labor
}
