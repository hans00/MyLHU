import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../../lib/cookieJar'
import request from 'request'
import md5 from 'md5'

export default (urls) => {
	let teaching = Router()

	teaching.get('/get', (req, res) => {
		const find_data = /'([\w]+)' *, *'([\w+\$\d]+)'/;
		var cookie = new cookieJar(req)
		var body = ""
		request.get({
				url: urls.student.inquire.teaching.login,
				jar: cookie.jar
			})
		.on('response', () => cookie.save())
		.on('data', (data) => body += data)
		.on('end', () => {
			if (!req.session.labor) {
				req.session.teaching = {}
			}
			var list = {}
			var $ = cheerio.load(body)
			var table = $("td a").parent().parent().parent()
			if (table.length > 0) {
				var n = 0
				var p = Promise.resolve()
				table.each((i, e) => {
					p = p.then(() => { 
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
							}
						}
					})
				})
				p.then(() => {
					res.json({
						status: 'success',
						list: list
					})
				})
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

	teaching.post('/fill', (req, res) => {
		if (!req.session.teaching[req.body.id] || !req.body.myscore || !req.body.tscore) {
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
		var body = ""
		request.get({
				url: urls.student.inquire.teaching.index,
				jar: cookie.jar
			})
		.on('data', (data) => body += data)
		.on('end', () => {
			var $ = cheerio.load(body)
			body = ""
			request.post({
					url: urls.student.inquire.teaching.index,
					headers: { "Referer": urls.student.inquire.teaching.index },
					jar: cookie.jar,
					form: {
						__VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
						__VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
						__EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
						__EVENTTARGET: now[0],
						__EVENTARGUMENT: now[1]
					}
				})
			.on('response', () => cookie.save())
			.on('data', (data) => body += data)
			.on('end', () => {
				var $ = cheerio.load(body)
				body = ""
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
				var p = Promise.resolve();
				$("input[id^=GridView][value="+req.body.tscore+"]").each(function(i, e){
					p = p.then(function(){ 
						sent[$(e).attr('name')] = $(e).val()
					});
				});
				p.then(function(){
					request.post({
							url: urls.student.inquire.teaching.base +
								 $("form[name=Question]").attr('action'),
							headers: { "Referer": urls.student.inquire.teaching.index },
							jar: cookie.jar,
							form: sent
						})
					.on('response', () => cookie.save())
					.on('data', (data) => body += data)
					.on('end', () => {
						res.json({
							status: 'success'
						})
					})
					.on('error', (err) => {
						res.json({
							status: 'faild'
						})
					})
				})
			})
			.on('error', (err) => {
				res.json({
					status: 'faild'
				})
			})
		})
		.on('error', (err) => {
			res.json({
				status: 'faild'
			})
		})
	})

	return teaching
}
