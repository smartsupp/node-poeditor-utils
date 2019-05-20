import * as PoeditorClient from 'poeditor-client'

export function createClient(apiToken: string): Client {
	return new PoeditorClient(apiToken)
}

export interface Client {
	projects: {
		list: () => Promise<Project[]>
	}
}

export interface Project {
	name: string
	languages: {
		list: () => Promise<Language[]>
	}
}

export interface Language {
	code: string
	terms: {
		list: () => Promise<Term[]>
	}
}

export interface Term {
	term: string
	translation: string
}
