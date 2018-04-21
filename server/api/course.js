import { Router } from 'express'
import cookieJar from '../lib/cookieJar'
import r from '../lib/backRequest'

export default (urls) => {
	let course = Router()

    course.get('/', (req, res) => {
		res.json({status:"faild"})
	})

	return course
}
