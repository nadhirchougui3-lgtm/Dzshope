import { Link } from 'react-router-dom'
import './CategoriesPage.css'

function CategoriesPage() {
  const categories = [
    {
      nom: 'Vêtements',
      label: 'Fashion & Clothing',
      description: 'Explore our latest clothing collection.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Chaussures',
      label: 'Shoes & Footwear',
      description: 'Discover footwear for every style.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Sacs',
      label: 'Bags & Luggage',
      description: 'Bags designed for style and everyday use.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Montres',
      label: 'Watches',
      description: 'Elegant watches for every occasion.',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Téléphones',
      label: 'Smartphones',
      description: 'Discover the latest smartphones.',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Audio',
      label: 'Audio & Headphones',
      description: 'Enjoy music with premium audio products.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Ordinateurs',
      label: 'Computers & Laptops',
      description: 'Powerful devices for work and entertainment.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Gaming',
      label: 'Gaming',
      description: 'Gear up with equipment made for gamers.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Soins personnels',
      label: 'Personal Care',
      description: 'Premium skincare products for your daily routine.',
      image: 'https://images.unsplash.com/photo-1739980213756-753aea153bb8?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Accessoires',
      label: 'Men’s Accessories',
      description: 'Complete your look with rings, bracelets and more.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Sport',
      label: 'Sports & Fitness',
      description: 'Equipment and essentials for an active lifestyle.',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Maquillage',
      label: 'Beauty & Makeup',
      description: 'Discover makeup from iconic beauty brands.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Maison',
      label: 'Home & Kitchen',
      description: 'Useful essentials for your home and kitchen.',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Camping',
      label: 'Outdoor & Camping',
      description: 'Practical equipment for outdoor adventures.',
      image: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Décoration',
      label: 'Home Decoration',
      description: 'Add character and style to your home.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Art & Création',
      label: 'Art & Creative Supplies',
      description: 'Tools and supplies for creative projects.',
      image: 'https://images.unsplash.com/photo-1777353245766-8b2ef9e436e1?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Lecture',
      label: 'Books & Reading',
      description: 'Discover books and inspiring reading collections.',
      image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=85'
    },
    {
      nom: 'Bureau',
      label: 'Office & Stationery',
      description: 'Practical tools for your workspace.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85'
    }
  ]

  return (
    <div className="dz-categories-page">
      <div className="dz-categories-header">
        <span className="dz-categories-label">
          DZSHOP COLLECTION
        </span>

        <h1>
          Shop by <span>Category</span>
        </h1>

        <p>
          Explore our carefully selected collections and find exactly what you need.
        </p>
      </div>

      <div className="dz-categories-grid">
        {categories.map(function (categorie, index) {
          return (
            <Link
              key={categorie.nom}
              to={'/produits?categorie=' + encodeURIComponent(categorie.nom)}
              className="dz-category-link"
            >
              <article className="dz-category-card">
                <div className="dz-category-image">
                  <img
                    src={categorie.image}
                    alt={categorie.label}
                  />

                  <div className="dz-category-overlay"></div>

                  <span className="dz-category-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="dz-category-content">
                  <span className="dz-category-name">
                    {categorie.nom}
                  </span>

                  <h2>
                    {categorie.label}
                  </h2>

                  <p>
                    {categorie.description}
                  </p>

                  <span className="dz-category-action">
                    Explore collection
                    <strong>→</strong>
                  </span>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CategoriesPage 