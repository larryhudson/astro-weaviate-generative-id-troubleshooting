# Repo for troubleshooting Weaviate issue

This is a repo for troubleshooting an issue I'm having with Weaviate.

When using generative search, I'm not able to retrieve the object ID of each search result.

To get this running locally:
- Clone this repo, `cd` into the directory and run `npm install` to install the dependencies.
- Duplicate `.env.sample` to `.env` and edit with your OpenAI API key.
- Run `npm run dev` to start up the local dev server.

When Weaviate boots up, it will automatically create the 'Note' class and add an example note.

When you go to the homepage, it will run two generative search queries:
- one that includes the `_additional { id }` in the `withFields` of the query - the generative search result is not available in the response
- one that does not - the generative search result is available.