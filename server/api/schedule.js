import { Router } from 'express'
import cookieJar from '../lib/cookieJar'
import r from '../lib/backRequest'
import {schedule as Schedule} from '../index'

export default (urls) => {
	let schedule = Router()

    schedule.get('/', (req, res) => {
		res.json({
			status: "succcess",
			result: Schedule.schedule
		})
	})

	return schedule
}
