import { Piano } from '../build'

describe('Piano', () => {
	context('can be constructed', () => {
		it('no arguments', () => {
			const piano = new Piano()
		})

		it('velocity layers', () => {
			const piano = new Piano({
				velocities: 4,
			})
		})

		it('velocity layers', () => {
			const piano = new Piano({
				velocities: 4,
			})
		})

		it('inherits from Tone.js', () => {
			const piano = new Piano({
				velocities: 1,
			}).toDestination()
		})
	})

	context('loads', () => {
		it('can load the samples', () => {
			const piano = new Piano({
				velocities: 1,
			})
			return piano.load()
		})
	})
})