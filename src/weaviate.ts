import weaviate, { EmbeddedOptions, type EmbeddedClient } from "weaviate-ts-embedded";
import path from "path";

const WEAVIATE_DATA_PATH = path.join(
  process.cwd(),
  "weaviate-data"
)



export const weaviateClient = weaviate.client(
  new EmbeddedOptions({
    port: 9898,
    env: {
      DEFAULT_VECTORIZER_MODULE: "text2vec-openai",
      OPENAI_APIKEY: import.meta.env.VITE_OPENAI_APIKEY,
      PERSISTENCE_DATA_PATH: WEAVIATE_DATA_PATH,
    },
  }),
  {
    scheme: "http",
    host: "127.0.0.1:9898",
  },
);

async function initialiseWeaviate() {
  const NOTE_CLASS = {
    class: "Note",
    description: "Notes",
    properties: [
      {
        name: "content",
        dataType: ["text"],
        description: "Note content",
      },
    ]
  }

  const noteClassExists = await weaviateClient.schema.exists(NOTE_CLASS.class);
  if (!noteClassExists) {
    await weaviateClient.schema.classCreator().withClass(NOTE_CLASS).do();

    await weaviateClient.data.creator().withClassName(NOTE_CLASS.class).withProperties({
      content: "This is a note"
    }).do();
  }
}

await weaviateClient.embedded.start();
await initialiseWeaviate();

export async function generativeQueryWithPromptInFields() {
  const generatePrompt = "Summarise the text: {content}";
  const response = await weaviateClient.graphql.get()
    .withClassName("Note")
    .withFields(`content _additional { id generate ( singleResult: { prompt:\"${generatePrompt}\"}){error singleResult } }`)
    .withNearText({
      concepts: ["love"],
    })
    .do();

  return response;
}

export async function generativeQueryWithId() {
  const generatePrompt = "Summarise the text: {content}";
  const response = await weaviateClient.graphql.get()
    .withClassName("Note")
    .withGenerate({
      singlePrompt: generatePrompt
    })
    .withFields(`content _additional { id }`)
    .withNearText({
      concepts: ["love"],
    })
    .do();

  return response;
}

export async function generativeQueryWithoutId() {
  const response = await weaviateClient.graphql.get()
    .withClassName("Note")
    .withFields("content")
    .withNearText({
      concepts: ["love"],
    })
    .withGenerate({
      singlePrompt: "Summarise the text: {content}"
    })
    .do();

  return response;
}