import * as PoeditorClient from 'poeditor-client'

export function createClient(apiToken: string): Client {
	return new PoeditorClient(apiToken)
}

export interface Client {
	projects: {
		list: () => Project[]
	}
}

export interface Project {
	name: string
	languages: {
		list: () => Language[]
	}
}

export interface Language {
	code: string
	terms: {
		list: () => Term[]
	}
}

export interface Term {
	term: string
	translation: string
}
