declare module "*css";
declare module "*.scss";

declare module "swiper/css/pagination";
declare module "swiper/css/navigation";
declare module "swiper/css/effect-fade";
declare module "swiper/css/effect-coverflow";

declare module "*.svg" {
    const content: string;
    export default content;
}
declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

declare module "*.m4a" {
  const src: string;
  export default src;
}
