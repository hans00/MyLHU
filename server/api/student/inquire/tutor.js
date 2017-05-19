import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../../lib/cookieJar'
import request from 'request'
import md5 from 'md5'

export default (urls) => {
	let tutor = Router()

	tutor.post('/fill', (req, res) => {
		var cookie = new cookieJar(req)
		var body = ""
		request.get({
				url: urls.student.inquire.tutor.login,
				jar: cookie.jar
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
				Btn_Save: "確定送出"
			}
			var p = Promise.resolve();
			$("input[id^=GridView][value="+req.body.score+"]").each(function(i, e){
				p = p.then(function(){ 
					sent[$(e).attr('name')] = $(e).val()
				});
			});
			p.then(function(){
				request.post({
						url: urls.student.inquire.tutor.index,
						headers: { "Referer": urls.student.inquire.tutor.index },
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

	return tutor
}
