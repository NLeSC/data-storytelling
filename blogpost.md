# Making LLMs Work for Science: How AI-Powered Storytelling Helps Researchers Communicate Their Software

*Large language models get a lot of attention in research for what they might replace. We wanted to explore what they can enable: better, faster scientific communication that actually reaches the right audiences.*

---

There's an ongoing conversation in the research community about large language models. Most of it focuses on risks: hallucinations, bias, the worry that generated text might replace genuine scholarly work. Those concerns are valid and worth taking seriously.

But there's another side to this conversation that doesn't get enough attention. LLMs can be genuinely useful tools when they're pointed at the right problems, with the right constraints and the right human oversight. Scientific communication is one of those problems.

At the Netherlands eScience Center, we build research software across four scientific domains: Environment & Sustainability, Life Sciences, Natural Sciences & Engineering and, Social Sciences & Humanities. Hundreds of projects, each representing months or years of collaborative work with research teams across the country and internationally. All catalogued in the [Research Software Directory](https://research-software-directory.org/). The software is solid, sometimes groundbreaking. But communicating that work to different audiences (the public, academic peers, funders, workshop participants) takes time that most research teams simply don't have. There's a persistent gap between the research software we produce and the stories we tell about it.

We built a tool to close that gap. And in doing so, we learned some things about what it actually looks like when LLMs serve science instead of the other way around.

## An interactive journey through four research domains

The first thing you see when you open the [Data Storytelling app](https://github.com/NLeSC/data-storytelling) is a 3D particle system. Not a dashboard. Not a table. A cloud of two thousand glowing dots that shift and pulse as you scroll down the page.

The idea was simple: before you read a single word about a piece of software, you should already have a sense of the research domain it belongs to. Visuals create that context faster than text ever could.

The entire application is one long scroll. As you move down, you pass through the domains, each with its own custom 3D scene built in Three.js. Each scene does something different:

**Environmental Sustainability** gives you a wireframe Earth surrounded by an atmosphere of particles that shift from blue to red. It's a temperature gradient. You haven't read a single word about climate software yet, but you already *feel* the domain. That's the whole point.

**Life Sciences** (this one's my favourite, if I'm honest) renders a rotating double helix. The base pairs are colour-coded: adenine in red, thymine in cyan, guanine blue, cytosine orange. Tiny molecular particles orbit the whole structure. Pure eye candy, but it puts you in the right headspace before you start exploring genomics tools.

**Engineering** drops you into a network of connected nodes floating around a wireframe cube. Computational infrastructure, visualized. Nodes link and unlink. It feels alive.

**Social Sciences & Humanities** takes that network idea further with clustered groups and inter-cluster connections. Think social graphs. Think data flowing between communities.

Now here's where it stops being just a tech demo. Each 3D scene is peppered with floating cards. Actual projects from the Research Software Directory, fetched live from the API. You hover over one, it glows and scales up. You click it and boom, a modal with the full project details. Description, DOI, metadata, links.

And tucked inside that modal? A tab labelled "Generate Story."

That's where the real trick happens.

## The communication bottleneck in research software

Anyone in research communications will recognise this situation.

You've got a brilliant piece of software. It does something novel with satellite imagery or protein folding or natural language processing for historical Dutch manuscripts. You need to write about it. But write about it for *whom*?

The version for the general public needs to be warm, accessible, maybe open with a compelling question like "What if we could predict floods before they happen?" The version for an academic journal needs an abstract, proper methodology discussion, and citations formatted just so. The internal review for your board needs FTE estimates, risk assessments, and honest talk about technical debt. And your programme director just wants a one-pager they can scan in three minutes between meetings.

Same project. Four different pieces of writing. And you need to do this for a hundred projects.

> This is where good research software becomes invisible. Not because the work isn't worth communicating, but because the communication itself is a bottleneck. The software ships, the README gets written, maybe a tweet goes out, and that's it. Months of collaborative work, reduced to a paragraph.

This is also precisely the kind of problem where LLMs can be a real asset to researchers. Not as a replacement for human judgment, but as a drafting tool that handles the structural heavy lifting: tone calibration, audience adaptation, first-pass content generation. The key is being intentional about how you use them. Not "throw a description at a chatbot and hope for the best," but structured, context-rich prompts designed for specific communication goals.

## Six audiences, six different stories

The story generator ships with six prompt templates. I want to be specific about what these are, because "prompt template" sounds trivial and these are anything but.

Each one is 500-plus words of careful instructions, closer to a creative brief than a prompt. They specify structure, tone, section order, word count targets, what to emphasise, what to skip. Here's what each does:

**Communications** (roughly 800 to 1,200 words). Tells the model to write like a science journalist. Start with a hook, explain the problem in terms your parents would understand, focus on real-world impact, end with something people can act on. The prompt says "use analogies and examples to explain technical concepts."

**Academic** (1,500 to 2,000 words). Formal. Structured. Abstract up front, methodology section, validation results, related work comparison, citation placeholders in `[Author, Year]` format. It reads like a proper paper section, not a blog post wearing a lab coat.

**Internal Review** (1,000 to 1,500 words). This is the honest one. The prompt tells the model to be "candid about challenges and risks" and to include resource analysis with FTE estimates. It produces the kind of document you'd want your review committee to read: strengths *and* weaknesses, no sugarcoating.

**One Pager** (under 300 words). Concise to the point of ruthlessness. What it does, who it's for, key benefits, quick stats, how to get started. Nothing else. The prompt says "every word must earn its place." I appreciate that energy.

**Course Material** (2,000 to 3,000 words). We added this one not long ago and I'm kind of excited about it. It generates educational content you could hand to someone: learning objectives, a technology deep dive, step-by-step tutorials, three tiers of exercises (beginner, intermediate, advanced), and self-assessment questions. Give it to a workshop organiser and they've got a starting point for a full training session.

**Blog Post** (800 to 1,200 words). This one was modelled directly on the eScience Center's own Medium blog. We analysed dozens of our published posts to capture the voice: community-focused, accessible, story-driven with a problem-solution structure. It generates posts that read like something our editorial team would write, complete with section headers, collaborative framing, and references to the open science ecosystem. The idea is that a researcher or RSE could generate a first draft and hand it to communications with minimal rework.

Here's what surprised me most during development. The difference between a good and a mediocre generated story almost never comes down to the model. It comes down to the prompt. Two thousand five hundred words of structured instructions. That's the actual product. The Gemini API call is almost the easy part.

## Feeding the machine (context makes or breaks everything)

A prompt template alone produces decent-ish output. Generic, but sound in structure. What makes the generated stories *useful* is context.

The generator pulls related software from the same research domain via the RSD API, without any extra effort from the user. So if you're generating a story about a climate modelling tool, it already knows about the other environmental software in the ecosystem and can reference them.

You can also upload documents. PDFs, text files, markdown. Research proposals work great for this. The app extracts the text (up to 10,000 characters worth), folds it into the prompt, and the output goes from generic to grounded in specifics. Night and day difference.

For custom projects (things not in the RSD) there's an "Own Project" button in the top navigation. Pop in a title, description, some reference URLs, upload whatever context you've got, pick your audience, and off you go. Same six templates, same quality, no RSD dependency.


## Under the bonnet (for the curious)

A few technical choices that I think are interesting, even if they're invisible to most users:

**No backend.** The Gemini API gets called straight from the browser. No server, no proxy, no infrastructure to babysit. You deploy it as a static site and walk away. The tradeoff? Users bring their own API key, stored in localStorage, never sent anywhere except to Google. For a research-oriented audience that already juggles API keys for half a dozen services, this felt like a reasonable ask.

**Svelte 5 runes everywhere.** The whole app runs on Svelte 5's new reactivity system: `$state`, `$derived`, `$effect`. When AI-generated text streams in, only the story display component re-renders. Not the 3D scene. Not the navigation. Not the settings panel. For something that's running WebGL animations, parsing SSE streams, and managing modal state all at once, that granularity needs to be optional.

**Scroll velocity drives the 3D.** This is the detail I'm most proud of. The scroll store doesn't just track how far down the page you are. It measures how *fast* you're scrolling and in which direction. That velocity feeds into the Three.js scenes. Scroll fast and the camera pulls back, particles scatter wider, everything feels like it's accelerating with you. Scroll slow and things settle into a gentle rotation. It's the kind of thing you won't notice unless you're looking for it, which is the point. The best interactions are the ones you feel rather than see.

**Prompt engineering treated as product design.** I keep coming back to this because I think it's the least obvious and most important decision we made. The prompt templates weren't written by a developer in ten minutes. They were iterated on, tested against real projects, revised, tested again. The "Internal Review" template went through five or six drafts before it produced output a programme manager would find useful on a consistent basis. Treating prompts with the same rigour you'd give a product spec? That's where the real value lives.

## What this taught us about LLMs as tools for science

Building and using this tool surfaced a few insights about how LLMs can genuinely serve researchers, rather than just generate noise.

**Audience adaptation.** Nobody needs another text generator. What researchers need is a tool that understands the difference between writing for a review committee and writing for the general public. The gap between "generate some text about this software" and "generate an internal review with risk assessment and FTE estimates in a tone appropriate for a review committee" is where the real utility lives. When you put that specificity into your prompts, LLMs stop being gimmicks and start being useful.

**Transparency makes AI tools trustworthy.** Streaming the output word by word isn't just a UX nicety. It makes the AI feel less like a black box. You see it working. You see it repeat itself or choose a weird word, and somehow that makes the good parts feel more trustworthy. Every person who's tested the tool has commented on this. If we want researchers to adopt LLM-based tools, building them in ways that feel transparent and inspectable matters more than making the output perfect.

**Multiple perspectives reveal what a single description can't.** When you generate a communications piece, an academic paper, a review document, a one-pager, a course module, and a blog post about the same project, you learn things about that project you didn't know. The academic version surfaces methodological contributions you'd overlooked. The one-pager forces you to articulate the core value in twenty words. The course material makes you think about what's teachable. The blog post draft shows you how the work connects to the broader research community. LLMs become a thinking tool here, not just a writing tool. Six different lenses on the same research.

**Context is more important than model sophistication.** We've run the same project through Gemini Flash and Gemini Pro with identical prompts. The difference is marginal. But the difference between a bare-bones description and one enriched with a research proposal, team information, and three related software packages? Dramatic. This has implications beyond our tool. If research institutions want to use LLMs well, investing in structured metadata and rich context (things the RSD already provides) will matter more than chasing the latest model.

## LLMs as collaborators, not replacements

Let me be clear about what this tool does and doesn't do.

It doesn't replace the science communicator who knows that a particular project has a funny origin story, or that the lead developer gave a brilliant conference talk last month, or that "digital bridges" works better for this audience than "computational pipelines." Those things require human judgment, institutional memory, and taste. No model provides that.

What it does is handle the structural work that prevents most research software from ever being properly communicated. Structure, tone, audience calibration, first-pass content generation. It gets you from a blank page to a solid draft in minutes. From there, the human takes over.

That's the pattern we think works for LLMs in science more broadly. Not autonomous generation. Not replacing experts. Instead: structured tools that handle well-defined tasks with rich context and human oversight. Tools that make researchers more effective at the parts of their job that aren't their core expertise but still matter, like communicating their work to the people who need to hear about it.

The conversation about LLMs in research is often framed as a threat. We think it's more productive to ask: where can these tools genuinely help, and what does it take to use them responsibly? For us, scientific communication turned out to be a great answer.

A hundred projects, six audience types, one tool. The stories were always there. We just needed a better way to start telling them.

---

*The Data Storytelling application is open source at [github.com/NLeSC/data-storytelling](https://github.com/NLeSC/data-storytelling). Built at the Netherlands eScience Center with SvelteKit, Three.js (Threlte), and the Google Gemini API. We'd love to hear how other research organisations approach this challenge. Contributions and conversations welcome.*
