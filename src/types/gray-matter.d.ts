declare module 'gray-matter' {
  interface GrayMatterResult {
    data: {
      [key: string]: any;
    };
    content: string;
    excerpt?: string;
    orig: string;
  }

  interface GrayMatterOptions {
    parser?: (str: string) => any;
    excerpt?: boolean | ((file: string, options: GrayMatterOptions) => string);
    excerpt_separator?: string;
    engines?: {
      [key: string]: (str: string) => any;
    };
    language?: string;
    delimiters?: string | [string, string];
  }

  function matter(
    str: string,
    options?: GrayMatterOptions
  ): GrayMatterResult;

  export = matter;
} 