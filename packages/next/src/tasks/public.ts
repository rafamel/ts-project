import { Deep, Dictionary, Empty } from 'type-core';
import {
  create,
  progress,
  write,
  series,
  mkdir,
  Task,
  remove,
  copy
} from 'kpo';
import faviconsFn, { FaviconOptions, FaviconResponse } from 'favicons';
import { parseDocument } from 'htmlparser2';
import { merge } from 'merge-strategies';
import path from 'path';
import { defaults } from '../defaults';

export interface PublicParams {
  dest?: string;
  clean?: boolean;
  assets?: string[];
  favicons?: null | PublicFaviconsParams;
}

export interface PublicFaviconsParams {
  logo?: string | Buffer | string[];
  result?: string;
  urls?: {
    result?: string | null;
    manifests?: string | null;
  };
  options?: FaviconOptions;
}

export type PublicOptions = PublicParams;

export function hydratePublic(
  options: PublicOptions | Empty
): Deep.Required<PublicOptions> {
  return merge(
    {
      dest: defaults.public.dest,
      clean: defaults.public.dest,
      assets: defaults.public.assets,
      favicons: defaults.public.favicons
    },
    options || undefined
  );
}

export function publicTask(options: PublicOptions | Empty): Task.Async {
  const opts = hydratePublic(options);
  return series(
    mkdir(opts.dest, { ensure: true }),
    opts.clean
      ? remove(path.join(opts.dest, '*'), {
          glob: true,
          strict: false,
          recursive: true
        })
      : null,

    opts.assets
      ? progress(
          { message: 'Handling assets' },
          copy(opts.assets, opts.dest, {
            glob: true,
            single: false,
            strict: false,
            exists: 'overwrite'
          })
        )
      : null,
    faviconsTask(opts)
  );
}

function faviconsTask(opts: Deep.Required<PublicOptions>): Task.Async | null {
  const favicons = opts.favicons;
  if (!favicons) return null;

  return progress(
    { message: 'Building icons and manifest' },
    create(async () => {
      const urlPath = 'favicons-' + String(Math.random()).replace('.', '');
      const urlPathRegex = new RegExp(urlPath, 'g');
      const urlPathSlashRegex = new RegExp(urlPath + '\\/?', 'g');

      const response = await new Promise<FaviconResponse>((resolve, reject) => {
        faviconsFn(
          favicons.logo,
          { ...favicons.options, path: urlPath },
          (err, res) => {
            return err ? reject(err) : resolve(res);
          }
        );
      });

      return series(
        mkdir([opts.dest, path.dirname(favicons.result)], {
          ensure: true
        }),
        ...response.images.map((asset) => {
          return write(path.join(opts.dest, asset.name), asset.contents, {
            exists: 'overwrite'
          });
        }),
        ...response.files.map((asset) => {
          const content = favicons.urls.manifests
            ? String(asset.contents).replace(
                urlPathRegex,
                favicons.urls.manifests.replace(/\/$/, '')
              )
            : String(asset.contents).replace(urlPathSlashRegex, '');

          return write(path.join(opts.dest, asset.name), content, {
            exists: 'overwrite'
          });
        }),
        create(() => {
          const html = response.html.map((x) => {
            return favicons.urls.result
              ? x.replace(urlPathRegex, favicons.urls.result.replace(/\/$/, ''))
              : x.replace(urlPathSlashRegex, '');
          });

          const manifest = response.files
            .filter((asset) => asset.name === 'manifest.json')
            .map((asset) => {
              return favicons.urls.result
                ? asset.contents.replace(
                    urlPathRegex,
                    favicons.urls.result.replace(/\/$/, '')
                  )
                : asset.contents.replace(urlPathSlashRegex, '');
            });

          const content = {
            ...(manifest.length ? { manifest: JSON.parse(manifest[0]) } : {}),
            head: responseHtmlToElements(html)
          };

          return write(path.resolve(opts.dest, favicons.result), content, {
            exists: 'overwrite'
          });
        })
      );
    })
  );
}

function responseHtmlToElements(html: string[]): Dictionary<Dictionary[]> {
  const str = `${html.join('')}`;
  const doc = parseDocument(str);
  const nodes = doc.children;

  const elements: Dictionary<Dictionary[]> = {};
  for (const node of nodes as any[]) {
    const attribs = node.attribs;

    Object.hasOwnProperty.call(elements, node.name)
      ? elements[node.name].push(attribs)
      : (elements[node.name] = [attribs]);
  }

  return elements;
}
