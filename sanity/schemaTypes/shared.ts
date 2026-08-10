import { defineField, defineType } from 'sanity';

export const pagePreview = {
	select: {
		title: 'title.[1].value',
		subtitle: 'title.[0].value',
	},
};

export const pageFields = [
	defineField({
		name: 'title',
		type: 'internationalizedArrayString',
		title: 'İsim',
		validation: (rule) => rule.required(),
	}),
	defineField({
		name: 'metaDescription',
		type: 'internationalizedArrayString',
		title: 'Meta Tanımı',
		validation: (rule) => rule.required(),
		// maybe make readonly for non-admins
	}),
	defineField({
		name: 'slug',
		type: 'internationalizedArrayString',
		title: 'Slug',
		validation: (rule) => rule.required(),
		// maybe make readonly for non-admins
	}),
];

export const productOrCategoryFields = [
	defineField({
		name: 'image',
		type: 'image',
		title: 'Görsel',
		options: { hotspot: true },
		validation: (r) => r.required(),
	}),
	defineField({
		name: 'tags',
		title: 'Tagler',
		type: 'internationalizedArrayString',
	}),
];

export const productListFields = (title: string, allowedTypes: string[]) => [
	defineField({
		name: 'description',
		title: 'Tanım',
		type: 'internationalizedArrayString',
		validation: (r) => r.required(),
	}),
	defineField({
		name: 'products',
		title,
		type: 'array',
		of: [
			defineField({
				type: 'reference',
				name: 'products',
				to: allowedTypes.map((type) => ({ type })),
			}),
		],
		validation: (r) => r.required().min(1),
	}),
];

export const blockContent = defineType({
	name: 'blockContent',
	type: 'array',
	of: [
		{
			type: 'block',
		},
	],
});
