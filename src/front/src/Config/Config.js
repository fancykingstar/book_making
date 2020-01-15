import I from 'immutable';

const ENV = process.env.NODE_ENV;
const GIT_HASH = process.env.GIT_HASH;

const CONFIG_DEV = {
	API_ROOT_HTTP: 'http://rc.deflamel.com',
	PROXY: 'https://cors-anywhere.herokuapp.com/',
	GIT_HASH,
	PAYPAL_CLIENT_ID:
		'AXHCZKP5-KUIlvn3oSQwq3kl9PIRXmH1BW5E8SmzRtfzSftZQiw2pGc_FC0YY-wBLyU6HAYJZ0mvryWU'
};

const CONFIG_PROD = {
	API_ROOT_HTTP: 'http://dev.deflamel.com',
	PROXY: '',
	GIT_HASH,
	PAYPAL_CLIENT_ID:
		'ARZFFKXlGjVnb70kMe8KAw-Q15ZGJp6gZ3fCg5kAZwMlNejkmmRoXPp7ZUfkBmebDEzZSkUFs4f4mSRl'
};

const CONFIG = ENV == 'development' ? CONFIG_DEV : CONFIG_PROD;

export default CONFIG;
