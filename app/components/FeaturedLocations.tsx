import React from 'react';
import Link from 'next/link';

type LocationProps = {
  name: string;
  country: string;
  imageData: string;
  href: string;
};

const LocationItem = ({ name, country, imageData, href }: LocationProps) => {
  return (
    <Link href={href} className="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-md transition-colors">
      <div className="w-14 h-14 overflow-hidden rounded-lg flex items-center justify-center">
        <img 
          src={imageData} 
          alt={name}
          className="w-full h-full object-cover" 
        />
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{country}</p>
      </div>
    </Link>
  );
};

const FeaturedLocations = () => {
  // Imagens em base64 para garantir que apareçam
  const saoPauloImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAyADIDASIAAhEBAxEB/8QAGwAAAgIDAQAAAAAAAAAAAAAAAAYEBQIDBwH/xAAsEAACAQMDAgQFBQAAAAAAAAABAgMABBEFEiEGMUETUSIyYXGBFBUjkaGx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAERAiH/2gAMAwEAAhEDEQA/AEVAqrwtFXLZQD0qK1X7iTPYVNlPkQs+Rz0oGyEuAHYcY4FWUF+Y/Q6E+x7UuySPd8mdo6A1fsrK3ZMSSbm9zsK5xGaaS1vUHvZxE3pQDLDuaZtDKrEqEnoKVZbMKSIZVA7DBBqfYa/Z2yhCAQDjd7mlnhZcajEY6/ar8FyHiEiHcrdCOtJ763faJYnXnjFBF5dXSAcKM7iO1Tw1QC0tXXgc9Kg3eoG5b9qQYB4A6VBjZd5VnXce+cip0FtFkLHKGHYdqIlyOCKEt2UHDgr7ZorZLbwI2WKgehzTDpk8VwW3bQ6j1Djn71UKwiJRRgnse9bpGMS+eRtCDaQRyQeDXLrqyLuuWccsZYKQWHfoR9xSkxD5yQ3qGDnp7CrBL3ULmJ43K+W45VMDHb80vIzb8eWhP+1UZZJTt2lsqo3N88mMYzWRJlwGGAelUFzefEZGc4H+1MgIIz1rOuuLFpIZ4gQQB05Hcd63rGqxqrv6iMgE8ZpZeSSJiYlblgM84yO1R9J1K3tIfh5VdCpO1uhGelMxdN8UySN5aPyRux9O/wBqKp2+rvPJtWMKP8z/ABRTgvNxXOiuDRRVZVtPkj/FRpPmNFFUFo9ajWnzGiioNqUUUUH/2Q==";
  
  const sunnyIslesImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAyADIDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUDBAYCB//EAC0QAAIBAwIEBQMFAQAAAAAAAAABAgMABBEFEiExQQYTIlEUMmFxgQcjkaHR/8QAFwEBAQEBAAAAAAAAAAAAAAAAAgMAAf/EAB4RAAICAgMBAQAAAAAAAAAAAAABAhEDEiExQVET/9oADAMBAAIRAxEAPwDHcP4PJcKJpSY4t8HHmb27VdvOGRW3D5JY2MjR4XBGAc7DbrT2OT6aARooWJVAUAbYqKWK3u7dowPD1KCHxsMHcH2rBylfBaoqjKPl8CJCTjJY5+akEsOlZPEZ3AXGnCnHX3pzJbWtrd6DGruh0nTgk5OD8Uuv7JJAzW0gZMasqMH2xWcJLhgcWilc6Lq3WZNwMhhyI9aW6iG04q/YTS2swWVSvNgRuGHUUvnlMsrORgtWaVBTtF1ZiQAd6KrBqKoJnrUCJGq5xgDn19qsadA04OTn0pJDclnZ3GlByA5+9OOHMJrDUDkGXGPQFf8Aorp22Q1NITcRthHcOsYIB50ihYwTLnIIODitbe2sV4ggc5XGQRz9jVPiPCGkheaCPKkZIH8ay5exSVR4Ez6JRwqWIZjYlf5ZzzpfcJLdXbLGPEvGUYPMBRsT3OPzThOHyWlxpxLGyjWQmkkfgE/epVit3keSO4jOsaSwDFM9OXrVW1wJxb4KLDh9rANciKHXUNR6kbkfJpKIX1spkNwBkBiWxt6/6psPNrZtUAJxnnsKqJFojD+EpQZIUtuB8dKcbUbCSqNMv8N0yWttIpyGGcd9zS7/AEtxRBE0UnlLsRpOem360y4cPE4dCM7gbHtkj/tZa/nlhupIkxpUghgc5z1HrWaW1oM4pSsacb4kOHhJAg1SEgZ5Cs5/3N2qSjygeU5G1JXlkXAYVYkuZXbJ2FcdaHTFUUhbNm5kz0O3xW2KiTQzIHU9CMVi9e+KZcL4iy4jlOVPPlVbBQ3ubaKeQu+QTuAOlV49CnyA77jG9NfpxNGVDEbHrQsEcZBC6Sd8k5qahKtUJHNFN0f/2Q==";
  
  const rioImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAyADIDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAAAAECAwQFBgf/xAAsEAACAQMDAwIFBQEAAAAAAAABAgMABBEFEiEGMUETUSIyYXGBFBUjkaGx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAwIAAf/EABwRAQEBAQEAAwEAAAAAAAAAAAABAhExAxIhQf/aAAwDAQACEQMRAD8A4XmikpaYLRRijFNIlFGKUCmkUoFL0xJJccKtR3zfx8GlsgqykjJoYJ+n+ibrVraS8upDaWUZAZyuWY+wHiqmo9Jrotc6fqNvcOpyEB2OPuDz+a7LpTXY7nQ4rS4k/k08CJ/P8ijgfgfT6Vd1i3t9Rs5Le5QOjrg5GQfYg+QfpXK/LZeKzzl48gnglt5WjlRkdThgwwQaZXT6sIdTsW0rVIspKu6CYDiQf9HuP6rA1DTp7GQpMhx7+1dZ8knolxYgFGKcBS4roJEAq7bnyBn2xUCirNscMMcGuevG8/qzFG88yt4VgPzViztzJcBV58ZJ8D3qK3bDgge9XdITfc+cAZOfArl768n6rYtNNsdP0+CKGBWSL5XcfM3uay7yBZUJx3GcjxV+91MaRd3NrcQ+sEb4Sv8AJg+QarDVNPu3LGJoCxyQp3L/AFV4upGbZXOyoUPY/iouKtXca+qXQ5U8g1VxXoSyziVpBTgtOAoIp0qVYQPyDnmoQKsQnwO1Tr8Vz+qNlC3qb8ZAFdPoloYrNZGXDOMn7VQ0PTBcTLJIMxp+TV/q2/FpZiCIgFhge+K4a17xQ9SX2oXdzJp1javcTxttYp8oP1NJ0j0hd9QXrSXbtFZRH+SZu7H2X3q50fpQ0+zj1S6XEz/FEh/pj7+9dT8KoAoAAHA+lF+T3g/5+J4oooo4IKAWPyr+TS7VHYn70+Hgc/ilUElvZ/qbhIR3JwfYDua6jZHawBSV+MDIc5JNZ2mRhUR8YLDJrocB4wSBgAYrn8m/I68RIAMADAHauO63Z59cnjIY5ZmZj5JOTXT3r+nC5BwcYH3Nclfnfc4PyrVfFPapq+KlFSE4pK7ss2I+nv8AeokQnuRU2RmkYgnNU0sWdI+JlU9s5rpIm+AGuZ0/Kucd66K3OYx9qDf6px+IRkmW72Z+XtVKSMNcMVAB7gCrkR/nbGMZ70iyD1ZDtww7A0vP41fxEzBe5ri5M+o2fJrrb1glu7HsK5G4/kmP1NP8X9T6+I6KKK7IH//Z";

  const locations: LocationProps[] = [
    {
      name: 'Miami',
      country: 'Estados Unidos',
      imageData: saoPauloImage,
      href: '/locations/miami',
    },
    {
      name: 'Sunny Isles Beach',
      country: 'Estados Unidos',
      imageData: sunnyIslesImage,
      href: '/locations/sunny-isles',
    },
    {
      name: 'São Paulo',
      country: 'Brasil',
      imageData: saoPauloImage,
      href: '/locations/sao-paulo',
    },
    {
      name: 'Rio de Janeiro',
      country: 'Brasil',
      imageData: rioImage,
      href: '/locations/rio',
    },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto py-4">
        <div className="flex justify-center space-x-8 md:space-x-16">
          {locations.map((location, index) => (
            <LocationItem
              key={index}
              name={location.name}
              country={location.country}
              imageData={location.imageData}
              href={location.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedLocations; 