import { Router } from 'express'
import cookieJar from '../../lib/cookieJar'
import r from '../../lib/backRequest'
import labor from './labor'
import inquire from './inquire'

export default (urls) => {
	let student = Router()

	student.use('/labor', labor(urls))

	student.use('/inquire', inquire(urls))
	
	return student
}
