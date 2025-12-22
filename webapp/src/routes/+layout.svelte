<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();

	const siteUrl = 'https://nlesc.github.io/data-storytelling';
	const title = 'Data Storytelling | eScience Center';
	const description =
		'AI-powered data storytelling platform for research software - transform complex research into compelling narratives';
	const ogImage = `${siteUrl}/images/og_image.jpg`;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content="eScience Center" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={siteUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

{@render children?.()}
