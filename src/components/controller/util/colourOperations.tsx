
const hexToRgb = (hex:string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
};
const toHex = (n:number) => Math.min(Math.max(0, n), 255).toString(16).padStart(2, '0');
const rgbToHex = (r:number, g:number, b:number):string => {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
export const lightenHexColor = (hexColor:string, ratio:number):string => {

    const rgb = hexToRgb(hexColor);
    const newRgb = rgb.map((value) => Math.round(value + (255 - value) * ratio));

    const newHexColor = rgbToHex(newRgb[0], newRgb[1], newRgb[2]);

    return newHexColor;
}