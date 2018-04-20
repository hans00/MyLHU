import { Router } from 'express'
import cookieJar from '../../../lib/cookieJar'
import r from '../../../lib/backRequest'
import md5 from 'md5'

export default (urls) => {
	let teaching = Router()

	teaching.get('/get', (req, res) => {
		const find_data = /'([\w]+)' *, *'([\w+\$\d]+)'/
		req.session.teaching = {}
		let cookie = new cookieJar(req)
		r.get(urls.student.inquire.teaching.login, cookie)
		.then(($) => {
			let list = {}
			let table = $("td a").parent().parent().parent()
			if (table.length > 0) {
				let n = 0
				let p = Promise.resolve()
				table.each((i, e) => {
					p = p.then(() => {
						let text = $(e).find('td font')
						if (text.length) {
							let _class = $(text[0]).text()
							let _subject = $(text[1]).text()
							let _teacher = $(text[2]).text().replace(/ /g, "")
							let _href = $(e).find('td a').prop('href')
							let data = find_data.exec(_href)
							let id = md5(_class+_subject+_teacher)
							let d = {
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
					})
				})
				p.then(() => {
					console.log(req.session.teaching)
					req.session.save(() => {
						res.json({
							status: 'success',
							list: list
						})
					})
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
			console.log(req.session.teaching)
			res.json({
				status: 'faild',
				step: 'check'
			})
			return
		}
		let now = req.session.teaching[req.body.id]
		let my_score = [
			Math.ceil(req.body.myscore / 2),
			Math.ceil((req.body.myscore - 1) / 2)
		]
		if (my_score[1] <= 0) {
			my_score[1] = 1
		}
		let cookie = new cookieJar(req)
		r.get(urls.student.inquire.teaching.index, cookie)
		.then(($) => {
			r.post(urls.student.inquire.teaching.index, cookie, {
					__VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
					__VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
					__EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
					__EVENTTARGET: now[0],
					__EVENTARGUMENT: now[1]
				},{
					headers: { "Referer": urls.student.inquire.teaching.index },
				})
			.then(($) => {
				let sent = {
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
				let p = Promise.resolve()
				$("input[id^=GridView][value="+req.body.tscore+"]").each((i, e) => {
					p = p.then(() => {
						sent[$(e).attr('name')] = $(e).val()
					})
				})
				p.then(() => {
					let action_url = $("form[name=Question]").attr('action')
					r.post(
						urls.student.inquire.teaching.base + action_url,
						cookie,
						sent,
						{
							headers: { "Referer": urls.student.inquire.teaching.index },
						}
					).then(($) => {
						res.json({
							status: 'success'
						})
					})
				})
			})
		})
		.catch((err) => {
			console.log(err)
			res.json({
				status: 'conn_faild'
			})
		})
	})

	return teaching
}
