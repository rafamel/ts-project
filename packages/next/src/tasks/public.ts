import { Deep, Dictionary, Empty, Serial } from 'type-core';
import {
  create,
  progress,
  write,
  series,
  mkdir,
  remove,
  copy,
  run,
  Task,
  Context
} from 'kpo';
import { GoogleFontsHelper, GoogleFonts } from 'google-fonts-helper';
import faviconsFn, { FaviconOptions, FaviconResponse } from 'favicons';
import { parseDocument } from 'htmlparser2';
import { merge } from 'merge-strategies';
import path from 'path';
import { defaults } from '../defaults';

export interface PublicParams {
  clean?: boolean;
  destination?: string;
  assets?: string[];
  fonts?: null | PublicFontsParams;
  favicons?: null | PublicFaviconsParams;
  result?: null | PublicResultParams;
}

export type PublicFontsParams = GoogleFonts;

export interface PublicFaviconsParams {
  logo?: string | Buffer | string[];
  options?: FaviconOptions;
}

export interface PublicResultParams {
  url?: string | null;
  path?: string;
  values?: Serial.Type | null;
}

export type PublicOptions = PublicParams;

export function hydratePublic(
  options: PublicOptions | Empty
): Deep.Required<PublicOptions> {
  return merge(
    {
      clean: defaults.public.clean,
      destination: defaults.public.destination,
      assets: defaults.public.assets,
      fonts: defaults.public.fonts,
      favicons: defaults.public.favicons,
      result: defaults.public.result
    },
    options || undefined
  );
}

export function publicTask(options: PublicOptions | Empty): Task.Async {
  const opts = hydratePublic(options);

  return create((ctx) => {
    const assetsOpts = opts.assets;
    const fontsOpts = opts.fonts;
    const faviconsOpts = opts.favicons;
    const resultOpts = opts.result;

    const result: Dictionary = resultOpts ? { values: resultOpts.values } : {};

    return series(
      opts.clean
        ? remove(path.join(opts.destination, '*'), {
            glob: true,
            strict: false,
            recursive: true
          })
        : null,
      mkdir(opts.destination, { ensure: true }),
      assetsOpts
        ? progress(
            { message: 'Copy assets' },
            create(async (ctx) => {
              await runAssets(ctx, opts.destination, assetsOpts);
            })
          )
        : null,
      fontsOpts
        ? progress(
            { message: 'Download fonts' },
            create(async (ctx) => {
              result.fonts = await runFonts(
                ctx,
                opts.destination,
                (opts.result && opts.result.url) || null,
                fontsOpts
              );
            })
          )
        : null,
      faviconsOpts
        ? progress(
            { message: 'Build icons and manifest' },
            create(async (ctx) => {
              result.favicons = await runFavicons(
                ctx,
                opts.destination,
                (opts.result && opts.result.url) || null,
                faviconsOpts
              );
            })
          )
        : null,
      resultOpts
        ? series(
            mkdir(path.dirname(path.resolve(ctx.cwd, resultOpts.path)), {
              ensure: true
            }),
            write(resultOpts.path, result, { exists: 'overwrite' })
          )
        : null
    );
  });
}

async function runAssets(
  ctx: Context,
  destination: string,
  assets: string[]
): Promise<void> {
  return run(
    ctx,
    copy(assets, destination, {
      glob: true,
      single: false,
      strict: false,
      exists: 'overwrite'
    })
  );
}

async function runFonts(
  ctx: Context,
  destination: string,
  publicUrl: string | null,
  options: PublicFontsParams
): Promise<Dictionary<Dictionary[]>> {
  const files: string[] = [];
  const families = Object.entries(options.families || {});

  for (const [key, value] of families) {
    const instance = new GoogleFontsHelper({
      ...options,
      families: { [key]: value }
    });
    const url = instance.constructURL();
    if (!url) throw Error(`Could not download font ${key}`);

    const filename = `font-${key.toLowerCase()}.css`;
    files.push(filename);
    await GoogleFontsHelper.download(url, {
      base64: false,
      overwriting: true,
      outputDir: ctx.cwd,
      stylePath: path.join(destination, filename),
      fontsDir: path.join(destination, 'fonts'),
      fontsPath: 'fonts'
    });
  }

  return {
    link: files.map((file) => ({
      rel: 'stylesheet',
      href: publicUrl ? `${publicUrl.replace(/\/$/, '')}/${file}` : 'fonts.css'
    }))
  };
}

async function runFavicons(
  ctx: Context,
  destination: string,
  publicUrl: string | null,
  options: Required<PublicFaviconsParams>
): Promise<Dictionary<Dictionary[]>> {
  const urlPath = 'favicons-' + String(Math.random()).replace('.', '');
  const urlPathRegex = new RegExp(urlPath, 'g');
  const urlPathSlashRegex = new RegExp(urlPath + '\\/?', 'g');

  const response = await new Promise<FaviconResponse>((resolve, reject) => {
    faviconsFn(
      options.logo,
      { ...options.options, path: urlPath },
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });

  await run(
    ctx,
    series(
      mkdir(destination, { ensure: true }),
      ...response.images.map((asset) => {
        return write(path.join(destination, asset.name), asset.contents, {
          exists: 'overwrite'
        });
      }),
      ...response.files.map((asset) => {
        const content = String(asset.contents).replace(urlPathSlashRegex, '');

        return write(path.join(destination, asset.name), content, {
          exists: 'overwrite'
        });
      })
    )
  );

  const html = response.html.map((x) => {
    return publicUrl
      ? x.replace(urlPathRegex, publicUrl.replace(/\/$/, ''))
      : x.replace(urlPathSlashRegex, '');
  });

  return faviconsHtmlToElements(html);
}

function faviconsHtmlToElements(html: string[]): Dictionary<Dictionary[]> {
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
