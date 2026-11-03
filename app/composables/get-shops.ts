export interface Shop {
  id: number
  title: string
  description: string
  rating: number
  color: string
}

export const useGetShops = (): Shop[] => {
  return [
    {
      id: 1,
      title: 'Kedai Kopi Nusantara',
      description: 'Kopi pilihan dari berbagai penjuru nusantara dengan cita rasa autentik dan suasana yang nyaman.',
      rating: 4.7,
      color: '#6F4E37',
    },
    {
      id: 2,
      title: 'Bakery & Co.',
      description: 'Roti dan pastry artisan yang dipanggang segar setiap pagi dengan bahan-bahan berkualitas tinggi.',
      rating: 4.3,
      color: '#D4A373',
    },
    {
      id: 3,
      title: 'Warung Makan Bu Sari',
      description: 'Masakan rumahan yang lezat dengan menu harian berganti, cocok untuk makan siang dan makan malam.',
      rating: 4.9,
      color: '#E76F51',
    },
    {
      id: 4,
      title: 'Toko Elektronik Maju',
      description: 'Pusat penjualan elektronik terlengkap dengan garansi resmi dan layanan purna jual terpercaya.',
      rating: 3.8,
      color: '#264653',
    },
    {
      id: 5,
      title: 'Apotek Sehat Bersama',
      description: 'Apotek dengan tenaga apoteker profesional, menyediakan obat generik hingga suplemen premium.',
      rating: 4.5,
      color: '#2A9D8F',
    },
    {
      id: 6,
      title: 'Toko Bunga Melati',
      description: 'Rangkaian bunga segar untuk berbagai momen spesial, tersedia layanan antar ke seluruh kota.',
      rating: 4.1,
      color: '#E9C46A',
    },
    {
      id: 7,
      title: 'Barbershop Keren',
      description: 'Potong rambut modern dengan barber berpengalaman, suasana maskulin dan hasil rapi dijamin.',
      rating: 4.6,
      color: '#457B9D',
    },
    {
      id: 8,
      title: 'Laundry Express 24',
      description: 'Layanan laundry kilat siap dalam 3 jam, bersih, wangi, dan dilipat rapi siap pakai.',
      rating: 3.5,
      color: '#A8DADC',
    },
  ]
}