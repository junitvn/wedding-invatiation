export const GUESTS: Record<string, string> = {
  banteo: 'Bạn Tèo',
  cochuanhoa: 'Cô chú An Hoà',
};

export type VenueConfig = {
  title: string;
  address: string;
  textAddress: string;
  mapSrc: string;
};

export const VENUES: Record<string, VenueConfig> = {
  nhatrai: {
    title: 'TƯ GIA NHÀ TRAI',
    address: 'Ứng Hoà - Hà Nội',
    textAddress: `Nhà số 94-96, đường làng phía Tây, \nthôn Cung Thuế, xã Ứng Hoà, thành phố Hà Nội`,
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1693.903807543785!2d105.86121701559864!3d20.676652683977462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135cb4af8896d81%3A0x5349e1a458477421!2zTmjDoCB4ZSBMw6ogSOG7kw!5e1!3m2!1sen!2s!4v1777203752955!5m2!1sen!2s',
  },
  nhagai: {
    title: 'TƯ GIA NHÀ GÁI',
    address: 'Hà Nội',
    textAddress: 'Hà Nội',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1693.903807543785!2d105.86121701559864!3d20.676652683977462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135cb4af8896d81%3A0x5349e1a458477421!2zTmjDoCB4ZSBMw6ogSOG7kw!5e1!3m2!1sen!2s!4v1777203752955!5m2!1sen!2s',
  },
};

export const DEFAULT_VENUE = VENUES.nhatrai;
