declare const couleur: {
    rgb: (r: number, g: number, b: number) => (str: string) => string;
    bold: (str: string) => string;
};
export default couleur;
