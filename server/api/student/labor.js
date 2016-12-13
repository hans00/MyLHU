import { Router } from 'express'
import cheerio from 'cheerio'
import cookieJar from '../../lib/cookieJar'
import request from '../../lib/request'

export default (urls) => {
	let labor = Router()

	labor.get('/list', (req, res) => {
		res.json({status:"faild"})
	})

	labor.get('/get', (req, res) => {
		res.json({status:"faild"})
	})

	return labor
}
