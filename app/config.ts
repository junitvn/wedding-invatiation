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
    mapSrc: 'https://maps.app.goo.gl/f9YcU5vGzLzN29fXA',
  },
  nhagai: {
    title: 'TƯ GIA NHÀ GÁI',
    address: 'Văn Quan - Lạng Sơn',
    textAddress: 'Nhà thi đấu phố Đức Hinh,\n xã Văn Quan, tỉnh Lạng Sơn',
    mapSrc: 'https://maps.app.goo.gl/KWG9UUyZKwo4V9Vb9',
  },
};

export const DEFAULT_VENUE = VENUES.nhatrai;
