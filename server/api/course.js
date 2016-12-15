import { Router } from 'express'
import cookieJar from '../lib/cookieJar'
import request from 'request'

export default (urls) => {
	let course = Router()

    course.get('/', (req, res) => {
		res.json({status:"faild"})
	})

	return course
}
