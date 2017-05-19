import { Router } from 'express'
import teaching from './teaching'
import tutor from './tutor'

export default (urls) => {
	let inquire = Router()

	inquire.use('/teaching', teaching(urls))
	inquire.use('/tutor', tutor(urls))

	return inquire
}
