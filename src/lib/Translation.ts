export default class Translation {
	term: string
	language: string
	value: string

	constructor(term, language, value) {
		this.term = term
		this.language = language
		this.value = value
	}
}
