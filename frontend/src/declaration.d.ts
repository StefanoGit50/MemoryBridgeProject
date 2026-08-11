
/**
 * permette a typescript di vedere i css
 */

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
