import rp from 'request-promise'
import cheerio from 'cheerio'

export default {

	get(url, cookie, options={}) {
		options['uri'] = url
		options['jar'] = cookie.jar
		options['method'] = 'GET'
		options['transform'] = (body) => cheerio.load(body)
		options['transform2xxOnly'] = false
		return rp(options).then(($) => {cookie.save();return $})
	},

	post(url, cookie, form, options={}) {
		options['url']  = url
		options['jar']  = cookie.jar
		options['form'] = form
		options['method'] = 'POST'
		options['transform'] = (body) => cheerio.load(body)
		options['transform2xxOnly'] = false
		return rp(options).then(($) => {cookie.save();return $})
	}

}