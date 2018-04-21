import PDFParser from "pdf2json"
import fs from "fs"
import nodeEvents from "events"
import rp from 'request-promise'

function date_type(text) {
	if (/1?\d\/[1-3]?\d~1?\d\/[1-3]?\d/g.test(text)) return 1
	if (/[1-3]?\d~[1-3]?\d日/g.test(text)) return 2
	if (/[1-3]?\d日/g.test(text)) return 3
	return 0
}

function get_date(text) {
	let type = date_type(text)
	if (type==1) return parseInt(/1?\d\/([1-3]?\d)~1?\d\/[1-3]?\d/g.exec(text)[1])
	if (type==2) return parseInt(/([1-3]?\d)~[1-3]?\d日/g.exec(text)[1])
	if (type==3) return parseInt(/([1-3]?\d)日/g.exec(text)[1])
}

function getText(marks, ex, ey, options) {
	let x = marks[0].x
	let y = marks[0].y
	let txt = ''
	let min_x = (options.min_x) ? options.min_x : 0
	let max_x = (options.max_x) ? options.max_x : 1000
	let min_y = (options.min_y) ? options.min_y : 0
	let max_y = (options.max_y) ? options.max_y : 1000
	for (let i = 0; i < marks.length; i++) {
		let c = marks[i]
		let dx = c.x - x
		let dy = c.y - y
		if (c.x < min_x || c.x > max_x || c.y < min_y || c.y > max_y) continue
		if (Math.abs(dy) > ey) {
			txt += "\n"
			if (marks[i+1]) {
				x = marks[i+1].x
			}
		}
		let t = decodeURIComponent(c.R[0].T)
		txt += t
		x = c.x
		y = c.y
	}
	return txt
}

function parse(pdfData) {
	let pages     = pdfData.formImage.Pages
	let pageWidth = pdfData.formImage.Width
	let contents  = []
	for (let page of pages) {
		page.Texts.sort((a, b) => {
			let dx = a.x - b.x
			let dy = a.y - b.y
			return dy * pageWidth + dx
		})
		let year = ""
		try {
			year = /(\d{3}年)/g.exec(
					getText(page.Texts, 1.5, 0.5,
						{
							min_x: pageWidth * 0.25,
							max_x: pageWidth * 0.45,
							min_y: page.Height * 0.01,
							max_y: page.Height * 0.09
						})
					.replace(/\n/g, "")
				)[1]
		} catch (e) {
			year = ""
		}
		let months = getText(page.Texts, 1.5, 0.5,
			{
				min_x: pageWidth * 0.1,
				max_x: pageWidth * 0.12,
				min_y: page.Height * 0.11
			})
			.replace(/\n/g, "")
			.split(/((?:\d{3}年)?\d{1,2}月)/g)
			.filter(e => e != '' || e)
		let events = getText(page.Texts, 1.5, 0.5,
			{
				min_x: pageWidth * 0.51,
				min_y: page.Height * 0.11
			})
			.replace(/\n/, "")
			.replace(/\n([^\d~]+[^日]\S*)/g, "$1")
			.split(/(\d{1,2}日|\d{1,2}~\d{1,2}日|\d{1,2}\/\d{1,2}~\d{1,2}\/\d{1,2})(.+)\n?/)
			.filter(e => e != '' || e)
		for (let i=0, j=0; j < events.length; j+=2) {
			let d_type = date_type(events[j])
			if (d_type == 0) {
				j -= 1
				continue
			}
			if (j > 0 && get_date(events[j]) < get_date(events[j-2]) && i+1 < months.length) {
				i++
			}
			let date = (d_type == 1) ? events[j] : months[i]+events[j]
			if (!date.includes('年')) {
				date = year + date
			}
			if (d_type == 1) {
				let month1 = /(1?\d)\/[1-3]?\d~1?\d\/[1-3]?\d/.exec(events[j])[1]
				let month2 = /1?\d\/[1-3]?\d~(1?\d)\/[1-3]?\d/.exec(events[j])[1]
				let day1   = /1?\d\/([1-3]?\d)~1?\d\/[1-3]?\d/.exec(events[j])[1]
				let day2   = /1?\d\/[1-3]?\d~1?\d\/([1-3]?\d)/.exec(events[j])[1]
				contents.push([ year+month1+"月"+day1+"日~"+month2+"月"+day2+"日", events[j+1] ])
			} else {
				contents.push([ date, events[j+1] ])
			}
		}
	}
	return contents
}

function pdfParserPromise(url) {
	let promise = new Promise((resolve, reject) => {
		let pdfParser = new PDFParser()
		rp(url).pipe(pdfParser)
		pdfParser.on("pdfParser_dataReady", (evtData) => resolve(evtData))
		pdfParser.on("pdfParser_dataError", (evtData) => reject(evtData))
	})
	return promise
}

export default class {
	constructor (pdf_url, cache_path) {
		this.schedule = []
		const expire_day = 24*60*60*1000 * 10 //days
		// const expire_day = 1000 //ms
		if (fs.existsSync(cache_path)) {
			console.log(`Load cache from ${cache_path}`)
			let schedule = require(cache_path)
			if (new Date(schedule.cache_time+expire_day) > new Date()) {
				this.schedule = schedule.schedule
			} else {
				console.log(`Cahce expired`)
			}
		}
		if (!this.schedule.length) {
			console.log(`Download PDF from ${pdf_url}`)
			let _this = this
			pdfParserPromise(pdf_url)
			.then((data) => _this.schedule = parse(data))
			.then((schedule) => {
				schedule = {
					cache_time: new Date().getTime(),
					schedule: schedule
				}
				_this.schedule = schedule.schedule
				fs.writeFile(cache_path, JSON.stringify(schedule, null, 2), 'utf8', () => null)
			})
		}
	}
}
