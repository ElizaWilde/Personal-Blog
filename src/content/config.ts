import { stat } from 'node:fs/promises';
import { basename, dirname, extname } from 'node:path';
import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';

const POST_PATTERN = ['**/*.md', '**/*.mdx'];
const POST_BASE = 'src/data/post';
const DEFAULT_AUTHOR = 'Eliza';
const CATEGORY_TITLE_BY_FOLDER: Record<string, string> = {
  'DevOps&Cloud': 'DevOps/Cloud',
  Test: 'Testing',
};

const postGlobLoader = glob({ pattern: POST_PATTERN, base: POST_BASE });

const getPostDefaults = async (id: string, filePath?: string) => {
  const now = new Date();
  const filename = filePath ? basename(filePath) : basename(id);
  const parentFolder = filePath ? basename(dirname(filePath)) : '';
  let publishDate = now;
  let updateDate = now;

  if (filePath) {
    try {
      const fileStats = await stat(filePath);
      publishDate = fileStats.birthtimeMs > 0 ? fileStats.birthtime : fileStats.mtime;
      updateDate = fileStats.mtime;
    } catch {
      // The file may have changed between discovery and parsing; use the current time.
    }
  }

  return {
    title: basename(filename, extname(filename)),
    publishDate,
    updateDate,
    category: parentFolder && parentFolder !== 'post' ? (CATEGORY_TITLE_BY_FOLDER[parentFolder] ?? parentFolder) : '',
    draft: false,
    author: DEFAULT_AUTHOR,
  };
};

const postLoader: Loader = {
  name: 'post-loader-with-automatic-defaults',
  async load(context) {
    await postGlobLoader.load({
      ...context,
      parseData: async ({ id, data, filePath }) =>
        context.parseData({
          id,
          filePath,
          data: {
            ...(await getPostDefaults(id, filePath)),
            ...data,
          },
        }),
    });
  },
};

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: postLoader,
  schema: z.object({
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date(),
    draft: z.boolean(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string(),
    tags: z.array(z.string()).optional(),
    author: z.string(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
};
