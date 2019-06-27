declare module 'google-fonts' {
  interface IList {
    [key: string]: boolean | string | string[];
  }

  function fonts(list: IList): string;
  namespace fonts {
    function add(list: IList): void;
  }

  export default fonts;
}
