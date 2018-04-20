import { Router } from 'express'
import cookieJar from '../../../lib/cookieJar'
import r from '../../../lib/backRequest'
import md5 from 'md5'

export default (urls) => {
	let tutor = Router()

	tutor.get('/check', (req, res) => {
		let cookie = new cookieJar(req)
		r.get(urls.student.inquire.tutor.login, cookie)
		.then(($) => {
			let available = $("*:contains('確定送出')").length > 0
			res.json({
				status: 'success',
				available: available
			})
		})
		.catch((err) => {
			res.json({
				status: 'conn_faild'
			})
		})
	})

	tutor.post('/fill', (req, res) => {
		let cookie = new cookieJar(req)
		r.get(urls.student.inquire.tutor.login, cookie)
		.then(($) => {
			let sent = {
				__VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
				__VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
				__EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
				Btn_Save: "確定送出"
			}
			let p = Promise.resolve()
			$("input[id^=GridView][value="+req.body.score+"]").each((i, e) => {
				p = p.then(() => { 
					sent[$(e).attr('name')] = $(e).val()
				})
			})
			p.then(() => {
				r.post(urls.student.inquire.tutor.index, cookie, {
						headers: { "Referer": urls.student.inquire.tutor.index },
						form: sent
					})
				.then(($) => {
					res.json({
						status: 'success'
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

	return tutor
}
