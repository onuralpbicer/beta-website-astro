import { defineType, defineField } from 'sanity';

export default defineType({
	name: 'whyUs',
	title: 'Neden Biz?',
	type: 'document',
	preview: {
		select: {
			title: 'title.[1].value',
			subtitle: 'title.[0].value',
		},
	},
	fields: [
		defineField({
			name: 'title',
			title: 'İsim',
			type: 'internationalizedArrayString',
			validation: (r) => r.required(),
		}),
		defineField({ name: 'iconName', title: 'Icon ismi', type: 'string' }),
	],
});
