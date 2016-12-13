import request from 'request'
import cookieJar from './cookieJar'

export default {
    get (url, setting, cb) {
        if (setting.referer) {
            var headers = { "Referer": setting.referer }
        } else {
            var headers = {}
        }
        return request({
			headers: headers,
            url: url,
		    method: 'GET',
		    jar: setting.cookie.jar
	    }, (error, response, body) => {
            setting.cookie.save()
            if (cb) {
                if (!error && response.statusCode == 200) {
    	    		cb(false, response, body)
    	  		} else {
    				cb(true)
    			}
            }
		})
    },
    post (url, setting, cb) {
        if (setting.referer) {
            var headers = { "Referer": setting.referer }
        } else {
            var headers = {}
        }
        return request({
			headers: headers,
            url: url,
		    method: 'POST',
            form: setting.form,
		    jar: setting.cookie.jar
	    }, (error, response, body) => {
            setting.cookie.save()
            if (cb) {
                if (!error && response.statusCode == 200) {
    	    		cb(false, response, body)
    	  		} else {
    				cb(true)
    			}
            }
		})
    }
}
