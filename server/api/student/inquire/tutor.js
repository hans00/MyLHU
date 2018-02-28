import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../../lib/cookieJar'
import r from '../../../lib/backRequest'
import md5 from 'md5'

export default (urls) => {
	let tutor = Router()

	tutor.post('/fill', (req, res) => {
		var cookie = new cookieJar(req)
		r.get(urls.student.inquire.tutor.login, cookie.jar)
		.then(($) => {
			var sent = {
				__VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
				__VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
				__EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
				Btn_Save: "確定送出"
			}
			var p = Promise.resolve()
			$("input[id^=GridView][value="+req.body.score+"]").each((i, e) => {
				p = p.then(() => { 
					sent[$(e).attr('name')] = $(e).val()
				})
			})
			p.then(() => {
				request.post(urls.student.inquire.tutor.index, cookie.jar, {
						headers: { "Referer": urls.student.inquire.tutor.index },
						form: sent
					})
				.then(($) => {
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

	return tutor
}
