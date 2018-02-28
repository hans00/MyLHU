import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../../lib/cookieJar'
import r from '../../../lib/backRequest'
import md5 from 'md5'

export default (urls) => {
	let teaching = Router()

	teaching.get('/get', (req, res) => {
		const find_data = /'([\w]+)' *, *'([\w+\$\d]+)'/;
		var cookie = new cookieJar(req)
		r.get(urls.student.inquire.teaching.login, cookie.jar)
		.then(($) => {
			if (!req.session.teaching) {
				req.session.teaching = {}
			}
			var list = {}
			var table = $("td a").parent().parent().parent()
			if (table.length > 0) {
				var n = 0
				table.each((i, e) => {
					var text = $(this).find('td font')
					if (text.length) {
						var _class = $(text[0]).text()
						var _subject = $(text[1]).text()
						var _teacher = $(text[2]).text().replace(/ /g, "")
						var _href = $(this).find('td a').prop('href')
						var data = find_data.exec(_href)
						var id = md5(_class+_subject+_teacher)
						var d = {
							class: _class,
							subject: _subject,
							teacher: _teacher,
							avaiable: !!data
						}
						list[id] = d
						if (data) {
							req.session.teaching[id] = [
								data[1],
								data[2]
							]
						} else {
							req.session.teaching[id] = null
						}
					}
					if (i == table.length-1) {
						res.json({
							status: 'success',
							list: list
						})
					}
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

	teaching.post('/fill', (req, res) => {
		if (!req.session.teaching || !req.session.teaching[req.body.id] || !req.body.myscore || !req.body.tscore) {
			res.json({
				status: 'faild',
				step: 'check'
			})
			return
		}
		var now = req.session.teaching[req.body.id]
		var my_score = [
			Math.ceil(req.body.myscore / 2),
			Math.ceil((req.body.myscore - 1) / 2)
		]
		if (my_score[1] <= 0) {
			my_score[1] = 1
		}
		var cookie = new cookieJar(req)
		r.get(urls.student.inquire.teaching.index, cookie.jar)
		.then(($) => {
			r.post(urls.student.inquire.teaching.index, cookie.jar, {
					headers: { "Referer": urls.student.inquire.teaching.index },
					form: {
						__VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
						__VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
						__EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
						__EVENTTARGET: now[0],
						__EVENTARGUMENT: now[1]
					}
				})
			.then(($) => {
				var sent = {
					__VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
					__VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
					__EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
					__EVENTTARGET: 'Btn_Save',
					__EVENTARGUMENT: '',
					__SCROLLPOSITIONX: $("input[name=__SCROLLPOSITIONX]").val() || '',
					__SCROLLPOSITIONY: $("input[name=__SCROLLPOSITIONY]").val() || '',
					RBL_S1: my_score[0],
					RBL_S2: my_score[1]
				}
				var p = Promise.resolve()
				$("input[id^=GridView][value="+req.body.tscore+"]").each((i, e) => {
					p = p.then(() => {
						sent[$(e).attr('name')] = $(e).val()
					})
				})
				p.then(() => {
					let action_url = $("form[name=Question]").attr('action')
					r.post(
						urls.student.inquire.teaching.base + action_url,
						cookie.jar,
						{
							headers: { "Referer": urls.student.inquire.teaching.index },
							form: sent
						}
					).then(($) => {
						res.json({
							status: 'success'
						})
					})
					.catch((err) => {
						res.json({
							status: 'conn_faild'
						})
					})
				})
			})
			.catch((err) => {
				res.json({
					status: 'conn_faild'
				})
			})
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	return teaching
}
