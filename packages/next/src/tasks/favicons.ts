import { Deep, Dictionary, Empty } from 'type-core';
import { create, progress, write, series, mkdir, Task } from 'kpo';
import faviconsFn, { FaviconOptions, FaviconResponse } from 'favicons';
import { parseDocument } from 'htmlparser2';
import { merge } from 'merge-strategies';
import path from 'path';
import { defaults } from '../defaults';

export interface FaviconsParams {
  logo?: string | Buffer | string[];
  urls?: {
    assets?: string | null;
    result?: string | null;
  };
  dest?: {
    assets?: string;
    result?: string;
  };
  favicons?: FaviconOptions;
}

export type FaviconsOptions = FaviconsParams;

export function hydrateFavicons(
  options: FaviconsOptions | Empty
): Deep.Required<FaviconsOptions> {
  return merge(
    {
      logo: defaults.favicons.logo,
      urls: defaults.favicons.urls,
      dest: defaults.favicons.dest,
      favicons: defaults.favicons.favicons as any
    },
    options || undefined
  );
}

export function favicons(options: FaviconsOptions | Empty): Task.Async {
  const opts = hydrateFavicons(options);
  return progress(
    { message: 'Building icons and manifest' },
    create(async () => {
      const urlPath = 'favicons-' + String(Math.random()).replace('.', '');
      const urlPathRegex = new RegExp(urlPath, 'g');
      const urlPathSlashRegex = new RegExp(urlPath + '\\/?', 'g');

      const response = await new Promise<FaviconResponse>((resolve, reject) => {
        faviconsFn(
          opts.logo,
          { ...opts.favicons, path: urlPath },
          (err, res) => {
            return err ? reject(err) : resolve(res);
          }
        );
      });

      let manifest: any = null;

      return series(
        mkdir([opts.dest.assets, path.dirname(opts.dest.result)], {
          ensure: true
        }),
        ...response.images.map((asset) => {
          return write(
            path.join(opts.dest.assets, asset.name),
            asset.contents,
            { exists: 'overwrite' }
          );
        }),
        ...response.files.map((asset) => {
          const content = opts.urls.assets
            ? String(asset.contents).replace(
                urlPathRegex,
                opts.urls.assets.replace(/\/$/, '')
              )
            : String(asset.contents).replace(urlPathSlashRegex, '');

          if (asset.name === 'manifest.json') {
            manifest = JSON.parse(content);
          }

          return write(path.join(opts.dest.assets, asset.name), content, {
            exists: 'overwrite'
          });
        }),
        create(() => {
          const html = response.html.map((x) => {
            return opts.urls.result
              ? x.replace(urlPathRegex, opts.urls.result.replace(/\/$/, ''))
              : x.replace(urlPathSlashRegex, '');
          });

          const content = {
            ...(manifest ? { manifest } : {}),
            head: responseHtmlToElements(html)
          };

          return write(opts.dest.result, content, { exists: 'overwrite' });
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
