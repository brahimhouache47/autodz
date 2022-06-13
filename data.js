import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Brahim',
      email: 'adminbrahim@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'dawed',
      email: 'userdawed@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',

      name: 'Filtre Citroen',
      slug: 'filtre-citroen',
      category: 'Filtre',
      image: '/images/p1.jpg', // 679px × 829px
      price: 900,
      countInStock: 3,
      brand: 'Citroen',
      rating: 4.5,
      numReviews: 10,
      description: 'Filtre aire premier choix ',
    },
    {
      // _id: '2',

      name: 'Filtre Hyundai',
      slug: 'Filtre-hyundai',
      category: 'Filtre',
      image: '/images/p2.jpg',
      price: 1200,
      countInStock: 20,
      brand: 'Hyundai',
      rating: 4.0,
      numReviews: 10,
      description: 'Filtre original Hyundai',
    },
    {
      //  _id: '3',

      name: 'Filtre Toyota',
      slug: 'Filtre-toyota',
      category: 'Filtre',
      image: '/images/p3.jpg',
      price: 1500,
      countInStock: 15,
      brand: 'Toyota',
      rating: 4.5,
      numReviews: 14,
      description: 'Filtre premier choix original toyota',
    },
    {
      // _id: '4',
      name: 'Filtre Renault ',
      slug: 'Filtre-renault',
      category: 'Filtre',
      image: '/images/p4.jpg',
      price: 900,
      countInStock: 10,
      brand: 'Renault',
      rating: 4.5,
      numReviews: 10,
      description: 'Filre aire renault',
    },
  ],
};
export default data;
