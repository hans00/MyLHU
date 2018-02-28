import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../lib/cookieJar'
import request from 'request'
import md5 from 'md5'

export default (urls) => {
	let labor = Router()

	labor.get('/list', (req, res) => {
		var cookie = new cookieJar(req)
		r.get(urls.student.labor.list, cookie.jar)
		.then(($) => {
			if (!req.session.labor) {
				req.session.labor = {}
			}
			if ($("*:contains('皆已通過')").length > 0) {
				res.json({
					status: 'all_passed',
					list: {}
				})
				return
			}
			var table = $("#DG_Content")
			if (table.find("tr").length > 0) {
				var p = Promise.resolve()
				table.find("tr").each((i, e) => {
					p = p.then(() => {
						if (i == 0) return
						var _name = $(this).find("td:nth-child(2) font").text()
						var _url  = $(this).find("td:first-child a").prop("href")
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
					}
				})
				p.then(() => {
					var output = {
						status: 'success',
						list: {}
					}
					for (var id in req.session.labor) {
						output.list[id] = req.session.labor[id].name
					}
					res.json(output)
				})
			} else {
				res.json({
					status: 'success',
					list: {}
				})
			}
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
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
		r.post(now.url, cookie.jar, {
			form: now.post
		})
		.then(($) => {
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
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	return labor
}
