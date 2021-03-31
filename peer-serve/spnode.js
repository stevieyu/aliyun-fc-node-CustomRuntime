const app = require('express')();
const bodyParser = require('body-parser')
const {observable, observe, unobserve, raw} = require('@nx-js/observer-util/dist/cjs.es6.js')
const multipeer = require('./multipeer')

let peersEvent = []

const signals = observable({})
const mp = multipeer()
	.on('signal', (data, peer, id) => {
		console.log('SIGNAL', JSON.stringify(data))
		signals[id] = data
		peersEvent.push({
			type: 'signal',
			data: data
		})
	})
	.on('connect', () => {
		peersEvent.push({
			type: 'connect',
			data: null
		})
		console.log('CONNECT')
	})
	.on('data', (data, peer) => {
		console.log('data: ' + data)
		peersEvent.push({
			type: 'data',
			data
		})
		peer.send('whatever server data: ' + Math.random())
	})
	.on('error', err => {
		console.error('error', err)
		peersEvent.push({
			type: 'error',
			data: err
		})
	})
	.on('close', (peer, id, self) => {
		peersEvent.push({
			type: 'close',
			data: null
		})
		self.remove(id);
		console.log('close')
	})

app.use(bodyParser.json());
app.use(require('cors')());

// app.get('/*', staticServe(path.join(__dirname, 'dist')));

app.post('/signal', async (req, res)=> {
	console.log('post signal', req.body)
	if(typeof req.body !== 'object'){
		res.send({
			body: req.body
		})
		return
	}
	const {id, signal} = req.body

	const peer = mp.add(id)
	peer.signal(signal)
	const ov = observe(() => {
		const signal = signals[id]
		if(!signal) return
		delete signals[id];
		unobserve(ov)
		res.send(raw(signal));
	})
})

app.get('/error', (req, res) => {
	res.send(peersEvent)
})


app.get('/*', (req, res) => {
	res.send({status: 'ok'})
})

app.listen(9000)